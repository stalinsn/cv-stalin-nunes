"use client";
import React, { useState, useEffect } from 'react';
import { useI18n } from "@/hooks/useI18n";
import { useTheme } from "@/hooks/useTheme";
import { labels } from "@/data/labels";
import { languageLabels } from "@/data/languageLabels";
import { getTranslationCache } from '@/utils/translationCache';
import { cvData } from '@/data/cv-ptbr';

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
  const { lang, data, error, handleTranslate, loading, setTranslationMode, setUserAcceptedFallback, status, translationMode, translations, clearTranslations, saveTranslation } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const [pendingLang, setPendingLang] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [usosRestantes, setUsosRestantes] = useState<number | null>(null);
  const [showLGPD, setShowLGPD] = useState(true);
  const [showPrivacy, setShowPrivacy] = useState(false);

  // Estado global para togglers das seções
  const [sectionsOpen, setSectionsOpen] = useState({
    summary: true,
    skills: true,
    experience: true,
    education: true,
    languages: true,
  });

  // Função para toggle all
  const allOpen = Object.values(sectionsOpen).every(Boolean);
  const handleToggleAll = () => {
    const next = !allOpen;
    setSectionsOpen({
      summary: next,
      skills: next,
      experience: next,
      education: next,
      languages: next,
    });
  };

  // Lógica simplificada para o modal de confirmação de tradução
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
    if (!selectedLang) return;
    const res = await fetch('/api/validate-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: tokenInput })
    });
    const result = await res.json();
    if (!result.success) {
      setUsosRestantes(result.usos_restantes ?? null);
      return;
    }
    setShowConfirmModal(false);
    setUsosRestantes(result.usos_restantes ?? null);
    await handleTranslate(selectedLang, tokenInput, 'modal');
    setSelectedLang(null);
    setShowConfirmModal(false); // Garante fechamento
  };

  const handleCancelTranslate = () => {
    setShowConfirmModal(false);
    setSelectedLang(null);
  };

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
  function safe<T>(value: T | undefined | null, fallback = "Não informado"): T | string {
    return value ?? fallback;
  }
  const statusMessage = error
    ? `Erro: ${error}`
    : loading
    ? 'Traduzindo com IA... Aguarde.'
    : status.tokensUsed !== null
    ? 'Tradução concluída com IA!'
    : '';

  const langTyped = lang as import("@/types/cv").Language;

  useEffect(() => {
    const savedLang = typeof window !== 'undefined' ? localStorage.getItem('lastLang') : null;
    if (savedLang && savedLang !== lang && savedLang !== 'pt-br') {
      const cacheKey = JSON.stringify(cvData);
      const cached = getTranslationCache(cacheKey, savedLang);
      if (translations[savedLang]) {
        handleTranslate(savedLang);
      } else if (cached) {
        try {
          const parsed = JSON.parse(cached);
          saveTranslation(savedLang, parsed);
        } catch {}
      } else {
        handleTranslate(savedLang);
      }
    }
  }, [handleTranslate, lang, saveTranslation, translations]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lastLang', lang);
    }
  }, [lang]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cacheKey = JSON.stringify(cvData);
      if (!getTranslationCache(cacheKey, 'pt-br')) {
        localStorage.setItem(`translation_pt-br_${cacheKey}`, JSON.stringify(cvData));
      }
    }
  }, []);

  const handleClearTranslations = () => {
    clearTranslations();
    if (typeof window !== 'undefined') {
      localStorage.setItem('lastLang', 'pt-br');
    }
  };

  return (
    <>
      <LoadingOverlay show={loading} />
      <Navbar
        lang={langTyped}
        onTranslate={onTranslate}
        onToggleTheme={toggleTheme}
        theme={theme}
        translationMode={translationMode}
        onChangeTranslationMode={setTranslationMode}
        labels={{
          theme: labels.toggleTheme[langTyped] || "Tema",
          language: labels.language?.[langTyped] || "Idioma",
          mode: labels.mode?.[langTyped] || "Modo",
          exportPDF: labels.downloadPDF[langTyped] || "Exportar PDF",
          translationModeAI: labels.translationModeAI?.[langTyped] || "IA",
          translationModeFree: labels.translationModeFree?.[langTyped] || "Gratuito",
          translationModeMock: labels.translationModeMock?.[langTyped] || "Mock",
          clearCache: labels.clearCache?.[langTyped] || "Limpar cache de tradução",
        }}
        onClearTranslations={handleClearTranslations}
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
        <header className="card" id="header" style={{ position: 'relative' }}>
          <h1 className="text-3xl font-bold">{safe(data?.name)}</h1>
          <h2 className="text-lg text-accent font-medium">{safe(data?.title)}</h2>
          <button
            className="toggle-all-icon-btn"
            onClick={handleToggleAll}
            aria-label={allOpen ? (labels.minimizeAll?.[langTyped] || 'Minimizar todas') : (labels.expandAll?.[langTyped] || 'Expandir todas')}
            title={allOpen ? (labels.minimizeAll?.[langTyped] || 'Minimizar todas') : (labels.expandAll?.[langTyped] || 'Expandir todas')}
            type="button"
          >
            {/* Seta tripla baseada nas setinhas menores */}
            <svg
              width="26" height="44" viewBox="0 0 26 44" fill="none" xmlns="http://www.w3.org/2000/svg"
              style={{
                transform: allOpen ? 'rotate(0deg)' : 'rotate(-180deg)',
                transition: 'transform 0.38s cubic-bezier(.4,2,.6,1)'
              }}
            >
              <g>
                <path d="M7 12L13 18L19 12" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 22L13 28L19 22" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 32L13 38L19 32" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
            </svg>
          </button>
        </header>
        <Summary
          data={data}
          title={data.summaryTitle || labels.summary?.[langTyped] || "Resumo Profissional"}
          open={sectionsOpen.summary}
          setOpen={open => setSectionsOpen(s => ({ ...s, summary: open }))}
        />
        <Skills
          data={data}
          titleMain={data.coreSkillsTitle || labels.coreSkills?.[langTyped] || "Competências Principais"}
          titleTech={data.technicalSkillsTitle || labels.technicalSkills?.[langTyped] || "Competências Técnicas"}
          open={sectionsOpen.skills}
          setOpen={open => setSectionsOpen(s => ({ ...s, skills: open }))}
        />
        <Experience
          data={data}
          title={data.experienceTitle || labels.experience?.[langTyped] || "Experiência Profissional"}
          open={sectionsOpen.experience}
          setOpen={open => setSectionsOpen(s => ({ ...s, experience: open }))}
        />
        <Education
          data={data}
          title={data.educationTitle || labels.education?.[langTyped] || "Formação Acadêmica"}
          open={sectionsOpen.education}
          setOpen={open => setSectionsOpen(s => ({ ...s, education: open }))}
        />
        <Languages
          data={data}
          title={data.languagesTitle || labels.languages?.[langTyped] || "Idiomas"}
          open={sectionsOpen.languages}
          setOpen={open => setSectionsOpen(s => ({ ...s, languages: open }))}
        />
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
          {labels.cookiesNotice?.[langTyped] || 'Este site usa cookies técnicos e coleta dados de uso para proteger sua privacidade e garantir o funcionamento da tradução IA.'} <a href="#privacidade" style={{color: theme === 'dark' ? 'var(--accent)' : '#fff',textDecoration:'underline',fontWeight:600,cursor:'pointer'}} onClick={e => {e.preventDefault();setShowPrivacy(true);}}>{labels.privacyPolicy?.[langTyped] || 'Política de Privacidade'}</a>.
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
            {labels.cookiesOk?.[langTyped] || 'OK'}
          </button>
        </div>
      )}
      <PrivacyModal open={showPrivacy} onClose={() => setShowPrivacy(false)} lang={langTyped} />
      <FallbackModal
        open={!!(error && error.includes('Gostaria de usar a tradução padrão?'))}
        onAccept={handleAcceptFallback}
        onCancel={handleCancelFallback}
      />
      <ConfirmTranslateModal
        open={showConfirmModal}
        languageLabel={selectedLang ? languageLabels[selectedLang] : ''}
        onConfirm={handleConfirmTranslate}
        onCancel={handleCancelTranslate}
      />
      <BackToTop label="Voltar ao topo" />
    </>
  );
}
