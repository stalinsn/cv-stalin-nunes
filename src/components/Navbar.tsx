import React, { useState } from "react";
import { Language } from "@/types/cv";
import { clearTranslationCache } from "@/utils/translationCache";
import { labels as globalLabels } from '@/data/labels';
import '@/styles/components/navbar.css';

interface NavbarProps {
  lang: Language;
  onTranslate: (targetLang: Language) => void;
  onToggleTheme: () => void;
  theme: "light" | "dark";
  translationMode: string;
  onChangeTranslationMode: (mode: string) => void;
  labels: {
    theme?: string;
    language?: string;
    mode?: string;
    exportPDF?: string;
    translationModeAI?: string;
    translationModeFree?: string;
    translationModeMock?: string;
    clearCache?: string;
    languageNames?: { [key: string]: string };
  };
  onClearTranslations?: () => void;
}

const languageCodes = Object.keys(globalLabels.languageNames || {}) as Language[];

export default function Navbar({
  lang,
  onTranslate,
  onToggleTheme,
  theme,
  translationMode,
  onChangeTranslationMode,
  labels,
  onClearTranslations,
}: NavbarProps) {
  const [cacheCleared, setCacheCleared] = useState(false);
  const [hasCache, setHasCache] = useState(false);

  const handleLanguageChange = (value: string) => {
    localStorage.setItem('lastLang', value);
    onTranslate(value as Language);
  };

  const handleClearCache = () => {
    clearTranslationCache();
    setCacheCleared(true);
    setHasCache(false);
    if (onClearTranslations) onClearTranslations();
    setTimeout(() => setCacheCleared(false), 2000);
  };

  const languageNames = globalLabels.languageNames;

  return (
    <header className="topbar">
      <div className="toolbar navbar-container">
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
            <select
              className="navbar-select"
              value={lang}
              onChange={(e) => handleLanguageChange(e.target.value)}
            >
              {languageCodes.map((code) => (
                <option key={code} value={code}>
                  {languageNames[code] || code}
                </option>
              ))}
            </select>
          </div>

          <div className="translation-mode">
            <label>{labels.mode}:</label>
            <select
              className="navbar-select"
              value={translationMode}
              onChange={(e) => onChangeTranslationMode(e.target.value)}
            >
              <option value="ai">{labels.translationModeAI}</option>
              <option value="free">{labels.translationModeFree}</option>
              <option value="mock">{labels.translationModeMock}</option>
            </select>
          </div>

          <div className="button-actions">
            <button className="btn" onClick={() => window.print()}>
              {labels.exportPDF}
            </button>
            {hasCache && (
              <button
                className="btn btn-secondary"
                onClick={handleClearCache}
                disabled={cacheCleared}
              >
                {cacheCleared ? labels.clearCache : labels.clearCache}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
