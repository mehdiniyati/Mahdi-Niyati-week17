import { useEffect, useState } from "react";
import { LanguageContext } from "./LanguageContext";
import { messages } from "./messages";
const supported = ["en", "fa", "ru"];
function initialLanguage() {
  try {
    const saved = localStorage.getItem("contacts-language");
    if (supported.includes(saved)) return saved;
  } catch {
    /* Language switching still works when storage is unavailable. */
  }
  const browser = navigator.language?.split("-")[0];
  return supported.includes(browser) ? browser : "en";
}
export default function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(initialLanguage);
  const t = (key, values = {}) =>
    (messages[language]?.[key] || key).replace(
      /\{(\w+)\}/g,
      (match, name) => values[name] ?? match,
    );
  const number = (value, minimumIntegerDigits = 1) =>
    new Intl.NumberFormat(language, {
      useGrouping: false,
      minimumIntegerDigits,
    }).format(value);
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "fa" ? "rtl" : "ltr";
    document.title =
      messages[language]?.["Folio — Your connections"] ||
      "Folio — Your connections";
    try {
      localStorage.setItem("contacts-language", language);
    } catch {
      /* Optional persistence. */
    }
  }, [language]);
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, number }}>
      {children}
    </LanguageContext.Provider>
  );
}
