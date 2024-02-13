import React from "react";
import "./style.css";
import { NavLink } from "react-router-dom";

function HomeButton() {
  return (
    <div className="home-button">
      <NavLink to="/" className="home-link">
        <img src="/icons/logo.svg" alt="Home Button" />
        MeeMee
      </NavLink>
    </div>
  );
}

export default HomeButton;
