import React from "react";
import "./style.css";
import { useTranslation } from "react-i18next";

function NoNextEvents() {
  const { t } = useTranslation();

  return (
    <div className="nonext-events">
      <div id="no-nextevents">
        <p>{t("translation.noEvents")}</p>
      </div>
    </div>
  );
}

export default NoNextEvents;
