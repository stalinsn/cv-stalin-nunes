"use client";
import React, { useState, useEffect } from 'react';
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
import PrivacyModal from '@/components/PrivacyModal';

import '@/styles/statusbar.css';

function LoadingOverlay({ show }: { show: boolean }) {
  if (!show) return null;
  return <div className="loading-overlay" />;
}

export default function Home() {
  const { lang, data, error, handleTranslate, loading, setTranslationMode, setUserAcceptedFallback, status, translationMode, translations } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const [pendingLang, setPendingLang] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [usosRestantes, setUsosRestantes] = useState<number | null>(null);
  const [showLGPD, setShowLGPD] = useState(true);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const onTranslate = async (targetLang: string) => {
    if (targetLang === lang) return;
    if (translations[targetLang]) {
      await handleTranslate(targetLang);
      setSelectedLang(null);
      setShowConfirmModal(false);
      return;
    }
    setSelectedLang(targetLang);
    setShowConfirmModal(true);
  };

  const handleConfirmTranslate = async (tokenInput: string) => {
    setToken(null);
    if (!selectedLang) return;
    const res = await fetch('/api/validate-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: tokenInput })
    });
    const result = await res.json();
    if (!result.success) {
      setToken(result.error || 'Token inválido ou esgotado.');
      return;
    }
    setShowConfirmModal(false);
    setToken(tokenInput);
    setUsosRestantes(result.usos_restantes ?? null);
    await handleTranslate(selectedLang, tokenInput, 'modal');
    setSelectedLang(null);
  };

  useEffect(() => {
    setToken(null);
  }, [selectedLang]);

  const handleAcceptFallback = async () => {
    if (pendingLang) {
      setUserAcceptedFallback(true);
      await handleTranslate(pendingLang);
      setUserAcceptedFallback(false);
      setTranslationMode('ai');
      setPendingLang(null);
    }
  };
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
  const labelSet = labels[lang as keyof typeof labels] || labels.pt;
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
      <StatusBar
        loading={loading}
        statusMessage={statusMessage}
        tokensUsed={status.tokensUsed}
        elapsedTime={status.elapsedTime}
        payloadSize={status.payloadSize}
        charCount={status.charCount}
        model={status.model}
        usosRestantes={usosRestantes}
      />
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
                LinkedIn
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
      {showLGPD && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100vw',
          background: theme === 'dark' ? '#232b22' : 'var(--accent)',
          color: theme === 'dark' ? 'var(--accent)' : '#fff',
          borderTop: theme === 'dark' ? '2px solid var(--accent)' : '2px solid var(--accent-hover)',
          boxShadow: '0 -2px 12px rgba(0,0,0,0.13)',
          padding: '1em 0.5em',
          textAlign: 'center',
          zIndex: 99999,
          fontWeight: 500,
          fontSize: '1.08em',
          letterSpacing: '0.01em',
        }}>
          Este site usa cookies técnicos e coleta dados de uso para proteger sua privacidade e garantir o funcionamento da tradução IA. <a href="#privacidade" style={{color: theme === 'dark' ? 'var(--accent)' : '#fff',textDecoration:'underline',fontWeight:600,cursor:'pointer'}} onClick={e => {e.preventDefault();setShowPrivacy(true);}}>Saiba mais</a>.
          <button
            style={{
              marginLeft: 18,
              background: theme === 'dark' ? 'var(--accent)' : '#fff',
              color: theme === 'dark' ? '#232b22' : 'var(--accent)',
              border: 'none',
              borderRadius: 6,
              padding: '0.4em 1.2em',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '1em',
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              transition: 'background 0.2s',
            }}
            onClick={() => setShowLGPD(false)}
          >
            OK
          </button>
        </div>
      )}
      <PrivacyModal open={showPrivacy} onClose={() => setShowPrivacy(false)} />
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
      <BackToTop label="Voltar ao topo" />
    </>
  );
}
