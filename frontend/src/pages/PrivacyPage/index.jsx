import React from "react";
import ScrollToTop from "../../components/ScrollToTop";
import "./style.css";
import { useTranslation } from "react-i18next";

function PrivacyPage() {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  return (
    <main className="privacy-page">
      <ScrollToTop />
      <div id="privacy-page">
        <h1>{t("translation.privacyPolicyPage")}</h1>

        <h2>{t("translation.privacyPolicyIntro")}</h2>

        <p>
          <strong>{t("translation.informationCollected")}</strong>
          <br />
          {t("translation.informationCollectedText")}
        </p>

        <p>
          <strong>{t("translation.eventContributionsPrivacy")}</strong>
          <br />
          {t("translation.eventContributionsText")}
        </p>

        <p>
          <strong>{t("translation.deviceInformation")}</strong>
          <br />
          {t("translation.deviceInformationText")}
        </p>

        <p>
          <strong>{t("translation.cookies")}</strong>
          <br />
          {t("translation.cookiesText")}
        </p>

        <p>
          <strong>{t("translation.howWeUseYourInformation")}</strong>
          <br />
          {t("translation.howWeUseYourInformationText")}
        </p>

        <p>
          <strong>{t("translation.informationSharing")}</strong>
          <br />
          {t("translation.informationSharingText")}
        </p>

        <p>
          <strong>{t("translation.dataSecurity")}</strong>
          <br />
          {t("translation.dataSecurityText")}
        </p>

        <p>
          <strong>{t("translation.changesToPrivacyPolicy")}</strong>
          <br />
          {t("translation.changesToPrivacyPolicyText")}
        </p>

        <p>
          <strong>{t("translation.contactUs")}</strong>
          <br />
          {t("translation.contactUsText")}
          <a href="mailto:privacy@meemee.com">privacy@MeeMee.com</a>
        </p>

        <p>
          {t("translation.enjoyMeeMeeExperience")}
          <br />
          {t("translation.meeMeePrivacyTeam")}
          <br />
        </p>
      </div>
    </main>
  );
}

export default PrivacyPage;
