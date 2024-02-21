import React from "react";
import { useTranslation } from "react-i18next";
import "./style.css";

const SendEmailPage = () => {
  const { t } = useTranslation();

  return (
    <main className="postevent-page">
      <div className="postevent-container" id="activation-container">
        <h2>{t("translation.almostThere")}</h2>
        <p>
          {t("translation.checkEmail")}{" "}
          <span className="pay-attention">
            {t("translation.activationNote")}
          </span>
        </p>
        <p>{t("translation.peekInside")}</p>
        <p>{t("translation.didntSeeEmail")}</p>
        <p>{t("translation.clickSpecialLink")}</p>
        <p>
          <span className="pay-attention">{t("translation.cantWait")}</span>
        </p>
      </div>
    </main>
  );
};

export default SendEmailPage;
