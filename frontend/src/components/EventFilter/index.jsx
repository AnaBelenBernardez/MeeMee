import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./style.css";

function EventFilter({ locations, onFilterChange }) {
  const { t } = useTranslation();
  const [selectedLocation, setSelectedLocation] = useState("");

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

  return (
    <div className="filter-element">
      <select
        id="filter"
        name="location"
        value={selectedLocation}
        onChange={handleLocationChange}
      >
        <option value="" disabled>
          {t("translation.searchCity")}
        </option>
        <option value="">{t("translation.allCities")}</option>
        {locations.map((location) => (
          <option key={location} value={location}>
            {formatLocation(location)}
          </option>
        ))}
      </select>
    </div>
  );
}

export default EventFilter;
