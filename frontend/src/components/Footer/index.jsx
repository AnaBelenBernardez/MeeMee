import React from "react";
import { Link } from "react-router-dom";
import "./style.css";
import LanguageSelector from "../LanguageSelector";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
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
          <Link to="/terms">{t("footer.terms")}</Link>
          <Link to="/privacy">{t("footer.privacy")}</Link>
          <Link to="/cookie">{t("footer.cookies")}</Link>
        </nav>
      </div>
      <div className="footer-socials">
        <LanguageSelector />
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
