import React from "react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import "./style.css";

function LanguageSelector() {
  const { t } = useTranslation();

  const handleChangeLanguage = (language) => {
    i18n.changeLanguage(language);
  };

  return (
    <div className="languageSelector">
      <button
        className={`language ${i18n.language === "eng" ? "active" : ""}`}
        id="eng"
        onClick={() => handleChangeLanguage("eng")}
      >
        {t("translation.langButtonENG")} |
      </button>
      <button
        className={`language ${i18n.language === "esp" ? "active" : ""}`}
        id="esp"
        onClick={() => handleChangeLanguage("esp")}
      >
        {t("translation.langButtonESP")} |
      </button>
      <button
        className={`language ${i18n.language === "pt" ? "active" : ""}`}
        id="pt"
        onClick={() => handleChangeLanguage("pt")}
      >
        {t("translation.langButtonPT")}
      </button>
    </div>
  );
}

export default LanguageSelector;
