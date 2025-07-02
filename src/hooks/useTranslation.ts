import { useState } from "react";
import { labels } from "./labels";
import { cvData } from "./cvData";

type Language = "pt" | "en";

export function useTranslation() {
  const [lang, setLang] = useState<Language>("pt");

  const t = labels[lang];

  const handleToggleLanguage = () => {
    setLang((prev) => (prev === "pt" ? "en" : "pt"));
  };

  return {
    lang,
    t,
    cv: cvData,
    setLang,
    toggleLanguage: handleToggleLanguage,
  };
}
