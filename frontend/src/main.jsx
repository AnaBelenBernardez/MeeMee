import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProviderComponent } from "./context/AuthContext.jsx";

import App from "./App.jsx";
import "./index.css";

import { I18nextProvider } from "react-i18next";
import i18n from "i18next";

import engTranslation from "./languages/eng.json";
import espTranslation from "./languages/esp.json";
import ptTranslation from "./languages/pt.json";

const resources = {
  eng: {
    translation: engTranslation,
  },
  esp: {
    translation: espTranslation,
  },
  pt: {
    translation: ptTranslation,
  },
};

i18n.init({
  resources,
  lng: "eng",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <AuthProviderComponent>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProviderComponent>
    </I18nextProvider>
  </React.StrictMode>
);
