import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ar from "./locales/ar.json";
import en from "./locales/en.json";

const savedLanguage = localStorage.getItem("aspirex-language") || "en";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    ar: {
      translation: ar,
    },
  },
  lng: savedLanguage,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

document.documentElement.lang = savedLanguage;
document.documentElement.dir = savedLanguage === "ar" ? "rtl" : "ltr";

export default i18n;