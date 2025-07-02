"use client";
import React, { useState } from 'react';
import { useI18n } from "@/hooks/useI18n";
import { useTheme } from "@/hooks/useTheme";
import { labels } from "@/data/labels";

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

export default function Home() {
  const { lang, data, error, handleTranslate, loading, setTranslationMode, setUserAcceptedFallback, status, translationMode } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const [pendingLang, setPendingLang] = useState<string | null>(null);

  // Novo handleTranslate que só delega para o hook
  const onTranslate = async (targetLang: string) => {
    if (targetLang === lang) return;
    if (translationMode === 'ai') {
      setPendingLang(targetLang);
      await handleTranslate(targetLang);
    } else {
      await handleTranslate(targetLang);
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
      <Navbar
        lang={lang}
        onTranslate={onTranslate}
        onToggleTheme={toggleTheme}
        theme={theme}
        translationMode={translationMode}
        onChangeTranslationMode={setTranslationMode}
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
                {data?.contact?.linkedin ? "LinkedIn" : "LinkedIn não disponível"}
              </a>
            </p>
          )}
        </header>
        <Summary data={data} title={labelSet.summary} />
        <Skills
          data={{ coreSkills: data?.coreSkills || [], technicalSkills: data?.technicalSkills || {} }}
          titleMain={labelSet.coreSkills}
          titleTech={labelSet.technicalSkills}
        />
        <Experience data={data} title={labelSet.experience} />
        <Education data={data} title={labelSet.education} />
        <Languages data={data} title={labelSet.languages} />
      </main>
      <Footer />
      <BackToTop label={labelSet.backToTop} />

      <FallbackModal
        open={!!(error && error.includes('Gostaria de usar a tradução padrão?'))}
        onAccept={handleAcceptFallback}
        onCancel={handleCancelFallback}
      />
    </>
  );
}
