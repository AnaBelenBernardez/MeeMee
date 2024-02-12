import React from "react";
import { Link } from "react-router-dom";
import "./style.css";

const Footer = () => {
  return (
    <footer>
      <div className="triangleright-footer"></div>
      <div className="triangleleft-footer"></div>
      <div className="footer-links">
        <nav>
          <p>© 2024 MeeMee</p>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/cookie">Cookies Policy</Link>
        </nav>
      </div>
      <div className="footer-socials">
        <a
          href="https://www.tiktok.com/"
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
          href="https://www.instagram.com/"
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
