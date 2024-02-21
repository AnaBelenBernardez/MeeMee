import React from "react";
import "./style.css";
import ScrollToTop from "../../components/ScrollToTop";
import { useTranslation } from "react-i18next";

function TermsPage() {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  return (
    <main className="terms-page">
      <ScrollToTop />
      <div id="terms-page">
        <h1>{t("translation.terms")}</h1>
        <h2>
          Welcome to Meemee! Before you dive into the app, here's a quick
          rundown of our straightforward Terms of Service:
        </h2>

        <p>
          <strong>{t("translation.acceptanceOfTerms")}</strong>
          <br />
          {t("translation.acceptanceOfTermsText")}
        </p>

        <p>
          <strong>{t("translation.communitySpirit")}</strong>
          <br />
          {t("translation.communitySpiritText")}
        </p>

        <p>
          <strong>{t("translation.yourMeeMeeSpace")}</strong>
          <br />
          {t("translation.yourMeeMeeSpaceText")}
        </p>

        <p>
          <strong>{t("translation.eventContributions")}</strong>
          <br />
          {t("translation.eventContributionsText")}
        </p>

        <p>
          <strong>{t("translation.privacyAndMingling")}</strong>
          <br />
          {t("translation.privacyAndMinglingText")}
          <a href="/privacy">{t("translation.privacyPolicy")}</a>
          {t("translation.privacyAndMinglingText2")}
        </p>

        <p>
          <strong>{t("translation.intellectualGathering")}</strong>
          <br />
          {t("translation.intellectualGatheringText")}
        </p>

        <p>
          <strong>{t("translation.limitationOfEventLiability")}</strong>
          <br />
          {t("translation.limitationOfEventLiabilityText")}
        </p>

        <p>
          <strong>{t("translation.harmonyLaw")}</strong>
          <br />
          {t("translation.harmonyLawText")}
        </p>

        <p>
          {t("translation.questionsOrShareEventTales")}
          <a href="mailto:support@meemee.com">support@MeeMee.com</a>.
        </p>

        <p>
          {t("translation.happyMeeMeeing")}
          <br />
          {t("translation.meeMeeTeam")}
          <br />
        </p>
      </div>
    </main>
  );
}

export default TermsPage;
