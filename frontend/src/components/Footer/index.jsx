import React from "react";
import { Link } from "react-router-dom";
import "./style.css";
import LanguageSelector from "../LanguageSelector";

const Footer = () => {
  return (
    <footer>
      <div className="triangleright-footer"></div>
      <div className="triangleleft-footer"></div>
      <div className="footer-links">
        <nav>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            to="https://github.com/AnaBelenBernardez/MeeMee"
          >
            ©2024 MeeMee
          </Link>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/cookie">Cookies Policy</Link>
        </nav>
      </div>
      <div className="footer-socials">
        <div>{/* <LanguageSelector /> */}</div>
        <a
          href="https://www.tiktok.com/@hackaboss_"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="../icons/tik-tok.svg" alt="tik-tok" />
        </a>
        <a
          href="https://discord.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="../icons\discord.svg" alt="discord" />
        </a>
        <a
          href="https://www.instagram.com/hackaboss_/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="../icons\instagram.svg" alt="instagram" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
