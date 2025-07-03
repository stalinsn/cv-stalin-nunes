import React from "react";

interface TranslationModeSelectorProps {
  translationMode: string;
  onChangeTranslationMode: (mode: string) => void;
  labels: {
    mode?: string;
    translationModeAI?: string;
    translationModeFree?: string;
    translationModeMock?: string;
  };
}

export default function TranslationModeSelector({
  translationMode,
  onChangeTranslationMode,
  labels,
}: TranslationModeSelectorProps) {
  return (
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
  );
}
