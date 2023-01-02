import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import languageDetector from "i18next-browser-languagedetector";

import translationEN from "./locale/en-nav.json";
import translationAR from "./locale/ar-nav.json";

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: translationEN
          },
        ar: {
        translation: translationAR
      }
    },
    fallbackLng: "en",

    interpolation: {
      escapeValue: false
      },
      react: {
        useSuspense : false
    }
  });

export default i18n;