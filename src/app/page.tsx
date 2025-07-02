"use client";
import React, { useState } from 'react';
import { useI18n } from "@/hooks/useI18n";
import { useTheme } from "@/hooks/useTheme";
import { labels } from "@/data/labels";
import { languageLabels } from "@/data/languageLabels";

import Navbar from "@/components/Navbar";
import Summary from "@/components/Summary";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import Languages from "@/components/Languages";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import StatusBar from "@/components/StatusBar";
import FallbackModal from "@/components/FallbackModal";
import ConfirmTranslateModal from "@/components/ConfirmTranslateModal";

import '@/styles/statusbar.css';

function LoadingOverlay({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="loading-overlay">
      {/* Overlay escuro/translúcido cobrindo toda a tela */}
    </div>
  );
}

export default function Home() {
  const { lang, data, error, handleTranslate, loading, setTranslationMode, setUserAcceptedFallback, status, translationMode } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const [pendingLang, setPendingLang] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedLang, setSelectedLang] = useState<string | null>(null);

  // Novo handleTranslate que só delega para o hook
  const onTranslate = async (targetLang: string) => {
    if (targetLang === lang) return;
    setSelectedLang(targetLang);
    setShowConfirmModal(true);
  };

  const handleConfirmTranslate = async () => {
    if (selectedLang) {
      setShowConfirmModal(false);
      await handleTranslate(selectedLang);
      setSelectedLang(null);
    }
  };

  // Modal: usuário aceita fallback para mock
  const handleAcceptFallback = async () => {
    if (pendingLang) {
      setUserAcceptedFallback(true);
      await handleTranslate(pendingLang);
      setUserAcceptedFallback(false);
      setTranslationMode('ai');
      setPendingLang(null);
    }
  };
  // Modal: usuário recusa fallback
  const handleCancelFallback = () => {
    setUserAcceptedFallback(false);
    setPendingLang(null);
  };

  const handleCancelTranslate = () => {
    setShowConfirmModal(false);
    setSelectedLang(null);
  };

  function safe<T>(value: T | undefined | null, fallback = "Não informado"): T | string {
    return value ?? fallback;
  }

  // Seleciona labels conforme idioma (fallback para pt)
  const labelSet = labels[lang as keyof typeof labels] || labels.pt;

  // StatusBar deve persistir enquanto houver estatísticas relevantes
  const hasStatus =
    loading ||
    !!error ||
    status.tokensUsed !== null ||
    status.elapsedTime !== null ||
    status.payloadSize !== null ||
    status.charCount !== null;

  // Mensagem dinâmica para status
  const statusMessage = error
    ? `Erro: ${error}`
    : loading
    ? 'Traduzindo com IA... Aguarde.'
    : status.tokensUsed !== null
    ? 'Tradução concluída com IA!'
    : '';

  return (
    <>
      <LoadingOverlay show={loading} />
      <Navbar
        lang={lang}
        onTranslate={onTranslate}
        onToggleTheme={toggleTheme}
        theme={theme}
        translationMode={translationMode}
        onChangeTranslationMode={setTranslationMode}
        labels={{
          theme: labelSet.theme,
          language: labelSet.language,
          mode: labelSet.mode,
          exportPDF: labelSet.exportPDF,
          translationModeAI: labelSet.translationModeAI,
          translationModeFree: labelSet.translationModeFree,
          translationModeMock: labelSet.translationModeMock,
        }}
      />

      {hasStatus && (
        <StatusBar
          loading={loading}
          statusMessage={statusMessage}
          tokensUsed={loading ? null : status.tokensUsed}
          elapsedTime={loading ? null : status.elapsedTime}
          payloadSize={loading ? null : status.payloadSize}
          charCount={loading ? null : status.charCount}
          model={loading ? '' : status.model}
        />
      )}

      {/* Exibe feedback de erro se houver */}
      {error && (
        <div style={{ color: 'red', margin: '1rem' }}>Erro: {error}</div>
      )}

      <main className="wrapper">
        <header className="card" id="header">
          <h1 className="text-3xl font-bold">{safe(data?.name)}</h1>
          <h2 className="text-lg text-accent font-medium">
            {safe(data?.title)}
          </h2>
          <p>{safe(data?.location)}</p>
          {data?.contact && (
            <p>
              <a
                href={`tel:${data?.contact?.phone?.replace(/[^\d]/g, "") || ""}`}
              >
                {safe(data?.contact?.phone)}
              </a>{" "}·{" "}
              <a href={`mailto:${data?.contact?.email || ""}`}>
                {safe(data?.contact?.email)}
              </a>{" "}·{" "}
              <a
                href={data?.contact?.linkedin || "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                {labelSet.linkedin} {data?.contact?.linkedin ? '' : `(${labelSet.notAvailable})`}
              </a>
            </p>
          )}
        </header>
        <Summary data={data} title={data.summaryTitle || labelSet.summary} />
        <Skills
          data={{ coreSkills: data?.coreSkills || [], technicalSkills: data?.technicalSkills || {} }}
          titleMain={data.coreSkillsTitle || labelSet.coreSkills}
          titleTech={data.technicalSkillsTitle || labelSet.technicalSkills}
        />
        <Experience data={data} title={data.experienceTitle || labelSet.experience} />
        <Education data={data} title={data.educationTitle || labelSet.education} />
        <Languages data={data} title={data.languagesTitle || labelSet.languages} />
      </main>
      <Footer />
      <BackToTop label={labelSet.backToTop} />

      <FallbackModal
        open={!!(error && error.includes('Gostaria de usar a tradução padrão?'))}
        onAccept={handleAcceptFallback}
        onCancel={handleCancelFallback}
      />

      <ConfirmTranslateModal
        open={showConfirmModal}
        targetLanguage={selectedLang || ''}
        languageLabel={selectedLang ? languageLabels[selectedLang] : ''}
        onConfirm={handleConfirmTranslate}
        onCancel={handleCancelTranslate}
      />
    </>
  );
}
