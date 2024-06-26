import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./style.css";

import SearchBar from "../../components/SearchBar";
import NextEvents from "../../components/NextEvents";

function LandingPage() {
  const { t } = useTranslation();
  const [helloText, setHelloText] = useState("Hello");
  const words = [
    "Hola",
    "Olá",
    "안녕",
    "(°▽°)/",
    "Kaixo",
    "مرحبا",
    "привет",
    "Hallo",
    "👋",
    "Ahoj",
    "नमस्ते",
    "你好",
    "Hello",
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
        <h1 className="header-text">{t("landingPage.joinCommunity")}</h1>
        <div id="hello-container">
          <div className="Hello">{helloText}</div>
        </div>
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
