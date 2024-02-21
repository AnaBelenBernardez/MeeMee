import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import HomeButton from "../HomeButton";
import SignOutButton from "../SignOutButton";
import { AuthContext } from "../../context/AuthContext.jsx";
import "./style.css";
import { useTranslation } from "react-i18next";

function Header() {
  const { t } = useTranslation();
  const { auth, userData } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="triangleright-header"></div>
      <div className="triangleleft-header"></div>
      <nav className="header-nav">
        <div className="left-section">
          <HomeButton />
        </div>
        <input
          type="checkbox"
          className="mobile-menu-check"
          id="expand-menu"
          checked={isMobileMenuOpen}
          onChange={handleMobileMenuToggle}
        ></input>
        <div className={`right-section ${isMobileMenuOpen ? "open" : ""}`}>
          <NavLink to="/events" onClick={closeMobileMenu}>
            {t("header.exploreEvents")}
          </NavLink>
          {auth && (
            <NavLink to="/postevent" onClick={closeMobileMenu}>
              {t("header.postEvent")}
            </NavLink>
          )}
          {/* {auth && (
            <NavLink
              to={`/user/${userData.nickname}`}
              onClick={closeMobileMenu}
            >
              My Account
            </NavLink>
          )} */}
          <div className="separator"></div>
          <div className="nav-signin">
            <SignOutButton />
          </div>
        </div>
        <div className="mobile-menu" onClick={handleMobileMenuToggle}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </nav>
    </header>
  );
}

export default Header;
