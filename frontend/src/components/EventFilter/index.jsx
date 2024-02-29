import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import "./style.css";

function EventFilter({ locations, onFilterChange }) {
  const { t } = useTranslation();
  const [selectedLocation, setSelectedLocation] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const selectRef = useRef(null);

  const handleLocationChange = (event) => {
    const location = event.target.value;
    setSelectedLocation(location);
    const formattedLocation = formatLocation(location);
    onFilterChange(formattedLocation);
  };

  const formatLocation = (location) => {
    return location
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.body.addEventListener("click", handleClickOutside);

    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="filter-element">
      <div className="custom-select-wrapper">
        <div
          className={`custom-select ${isDropdownOpen ? "open" : ""}`}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          ref={selectRef}
        >
          <span>
            {selectedLocation
              ? formatLocation(selectedLocation)
              : t("translation.searchCity")}
          </span>
          <ul className="custom-select-options">
            <li onClick={() => handleLocationChange({ target: { value: "" } })}>
              {t("translation.allCities")}
            </li>
            {locations.map((location) => (
              <li
                key={location}
                onClick={() =>
                  handleLocationChange({ target: { value: location } })
                }
              >
                {formatLocation(location)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default EventFilter;
