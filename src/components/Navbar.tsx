import React, { useState } from "react";
import { clearTranslationCache } from "@/utils/translationCache";

interface NavbarLabels {
  theme: string;
  language: string;
  mode: string;
  exportPDF: string;
  translationModeAI: string;
  translationModeFree: string;
  translationModeMock: string;
}

interface NavbarProps {
  lang: string;
  onTranslate: (targetLang: string) => void;
  onToggleTheme: () => void;
  theme: "light" | "dark";
  translationMode: string;
  onChangeTranslationMode: (mode: string) => void;
  labels: NavbarLabels;
}

const languages = [
  { code: "ptbr", label: "Português" },
  { code: "en", label: "Inglês" },
  { code: "es", label: "Espanhol" },
  { code: "fr", label: "Francês" },
  { code: "de", label: "Alemão" },
  { code: "it", label: "Italiano" },
];

export default function Navbar({
  lang,
  onTranslate,
  onToggleTheme,
  theme,
  translationMode,
  onChangeTranslationMode,
  labels,
}: NavbarProps) {
  const [cacheCleared, setCacheCleared] = useState(false);

  const handleClearCache = () => {
    clearTranslationCache();
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 2000);
  };

  // Verifica se há cache salvo
  const hasCache =
    typeof window !== "undefined" &&
    Object.keys(localStorage).some((k) => k.startsWith("translation_"));

  return (
    <header className="topbar">
      <div className="toolbar">
        <span className="brand">CV · Stalin Nunes</span>
        <div className="button-group">
          <div className="theme-toggle">
            <span className="theme-label">{labels.theme}</span>
            <label className="switch">
              <input
                type="checkbox"
                onChange={onToggleTheme}
                checked={theme === "dark"}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="language-selector">
            <label>{labels.language}:</label>
            <select value={lang} onChange={(e) => onTranslate(e.target.value)}>
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          <div className="translation-mode">
            <label>{labels.mode}:</label>
            <select
              value={translationMode}
              onChange={(e) => onChangeTranslationMode(e.target.value)}
            >
              <option value="ai">{labels.translationModeAI}</option>
              <option value="free">{labels.translationModeFree}</option>
              <option value="mock">{labels.translationModeMock}</option>
            </select>
          </div>

          <button className="btn" onClick={() => window.print()}>
            {labels.exportPDF}
          </button>

          {hasCache && (
            <button
              className="btn"
              style={{ marginLeft: 8 }}
              onClick={handleClearCache}
            >
              {cacheCleared ? "Cache limpo!" : "Limpar cache de traduções"}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
