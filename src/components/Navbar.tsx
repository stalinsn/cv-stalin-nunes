
import React from "react";

interface NavbarProps {
  lang: string;
  onTranslate: (targetLang: string) => void;
  onToggleTheme: () => void;
  theme: "light" | "dark";
  translationMode: string;
  onChangeTranslationMode: (mode: string) => void;
}

const languages = [
  { code: "ptbr", label: "Português" },
  { code: "en", label: "Inglês" },
  { code: "es", label: "Espanhol" },
  { code: "fr", label: "Francês" },
  { code: "de", label: "Alemão" },
  { code: "it", label: "Italiano" },
];

const modes = [
  { value: "ai", label: "IA" },
  { value: "free", label: "Gratuito" },
  { value: "mock", label: "Mock" },
];

export default function Navbar({
  lang,
  onTranslate,
  onToggleTheme,
  theme,
  translationMode,
  onChangeTranslationMode,
}: NavbarProps) {
  return (
    <header className="topbar">
      <div className="toolbar">
        <span className="brand">CV · Stalin Nunes</span>

        <div className="button-group">
          <div className="theme-toggle">
            <span className="theme-label">Tema</span>
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
            <label>Idioma:</label>
            <select
              value={lang}
              onChange={(e) => onTranslate(e.target.value)}
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          <div className="translation-mode">
            <label>Modo:</label>
            <select
              value={translationMode}
              onChange={(e) => onChangeTranslationMode(e.target.value)}
            >
              {modes.map((mode) => (
                <option key={mode.value} value={mode.value}>
                  {mode.label}
                </option>
              ))}
            </select>
          </div>

          <button className="btn" onClick={() => window.print()}>
            Exportar PDF
          </button>
        </div>
      </div>
    </header>
  );
}
