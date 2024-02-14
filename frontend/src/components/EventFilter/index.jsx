import React, { useState, useEffect } from "react";
import "./style.css";

function EventFilter({ locations, onFilterChange }) {
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
          Search by city
        </option>
        <option value="">All cities</option>
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
