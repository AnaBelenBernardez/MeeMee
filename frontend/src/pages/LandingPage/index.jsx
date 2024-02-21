import React from "react";
import { useTranslation } from "react-i18next";
import "./style.css";

import SearchBar from "../../components/SearchBar";
import NextEvents from "../../components/NextEvents";

function LandingPage() {
  const { t } = useTranslation();

  return (
    <main className="LandingPage">
      <section className="landing-top">
        <div className="first-row">
          <h1 className="header-text">{t("landingPage.joinCommunity")}</h1>
          <div className="Hello">{t("landingPage.hello")}</div>
        </div>
        {/* <div className="second-row">
          <SearchBar placeholderText={t("landingPage.searchPlaceholder")} />
          <button className="landing-signup">{t("landingPage.signUp")}</button>
        </div> */}
      </section>

      <section className="landing-bottom">
        <div className="triangle-left"></div>
        <div className="triangle-right"></div>
        <NextEvents />
      </section>
    </main>
  );
}

export default LandingPage;
