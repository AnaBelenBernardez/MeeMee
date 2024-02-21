import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./style.css";

import SearchBar from "../../components/SearchBar";
import NextEvents from "../../components/NextEvents";

function LandingPage() {
  const { t } = useTranslation();
  const [helloText, setHelloText] = useState(t("landingPage.hello"));
  const words = [
    "Hello",
    "Hola",
    "Olá",
    "안녕",
    "(°▽°)/",
    "Kaixo",
    "مرحبا",
    "привет",
    "Hallo",
    "こんにちは",
    "👋",
    "Ahoj",
    "नमस्ते",
    "你好",
  ];
  const intervalTime = 2000;

  useEffect(() => {
    const changeHelloText = () => {
      let index = words.indexOf(helloText);
      index = (index + 1) % words.length;
      setHelloText(words[index]);
    };

    const interval = setInterval(changeHelloText, intervalTime);
    return () => clearInterval(interval);
  }, [helloText, words]);

  return (
    <main className="LandingPage">
      <section className="landing-top">
        <div className="first-row">
          <h1 className="header-text">{t("landingPage.joinCommunity")}</h1>
          <div className="Hello">{helloText}</div>
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
