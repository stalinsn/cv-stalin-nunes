'use client';

import { useState, useEffect } from 'react';
import { cvData } from '@/data/cv-ptbr';
import { cvDataEn } from '@/data/cv-en';
import { cvDataEs } from '@/data/cv-es';
import { cvDataFr } from '@/data/cv-fr';
import { cvDataDe } from '@/data/cv-de';
import { translateWithAI } from '@/lib/translateService';
import { CvData } from '@/types/cv';

const mockMap: Record<string, CvData> = {
  ptbr: cvData,
  pt: cvData,
  en: cvDataEn,
  es: cvDataEs,
  fr: cvDataFr,
  de: cvDataDe,
};

export function useI18n() {
  const [lang, setLang] = useState<string>('ptbr');
  const [data, setData] = useState<CvData>(cvData);
  const [translations, setTranslations] = useState<Record<string, CvData>>({
    ptbr: cvData,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [translationMode, setTranslationMode] = useState<'ai' | 'mock'>('ai');
  const [userAcceptedFallback, setUserAcceptedFallback] = useState(false);

  // Adiciona estado para status da tradução
  const [status, setStatus] = useState({
    tokensUsed: null as number | null,
    elapsedTime: null as number | null,
    payloadSize: null as number | null,
    charCount: null as number | null,
    model: '',
  });

  // Se o cvData base mudar, limpa cache de traduções
  useEffect(() => {
    setTranslations({ ptbr: cvData });
    setLang('ptbr');
    setData(cvData);
  }, []);

  // Normaliza o código do idioma para os suportados nas labels
  function normalizeLangCode(code: string) {
    if (code.startsWith('pt')) return 'pt';
    if (code.startsWith('en')) return 'en';
    if (code.startsWith('es')) return 'es';
    if (code.startsWith('fr')) return 'fr';
    if (code.startsWith('de')) return 'de';
    if (code.startsWith('it')) return 'it';
    return code;
  }

  /**
   * Faz a tradução usando IA ou Mock
   */
  const handleTranslate = async (targetLang: string, token?: string, origem?: string) => {
    setError(null);
    const normalizedLang = normalizeLangCode(targetLang);
    if (lang === normalizedLang) return;

    if (translations[normalizedLang]) {
      switchLang(normalizedLang);
      return;
    }

    if (translationMode === 'ai') {
      setLoading(true);
      const start = Date.now();
      try {
        const result = await translateWithAI(data, normalizedLang, token, origem);
        const elapsed = Date.now() - start;
        if (!result || !result.translated) {
          throw new Error('Tradução IA não retornou resultado.');
        }
        saveTranslation(normalizedLang, result.translated);
        // Atualiza estatísticas para StatusBar
        setStatus({
          tokensUsed: result.tokensUsed || null,
          elapsedTime: elapsed,
          payloadSize: JSON.stringify(data).length,
          charCount: JSON.stringify(result.translated).length,
          model: process.env.NEXT_PUBLIC_OPENAI_MODEL || 'gpt-3.5-turbo',
        });
      } catch {
        setError('A tradução com IA está indisponível no momento. Gostaria de usar a tradução padrão?');
        setStatus({ tokensUsed: null, elapsedTime: null, payloadSize: null, charCount: null, model: '' });
      } finally {
        setLoading(false);
      }
      return;
    }

    if (translationMode === 'mock' || (error && userAcceptedFallback)) {
      if (mockMap[normalizedLang]) {
        saveTranslation(normalizedLang, mockMap[normalizedLang]);
        setError(null);
      } else {
        setError('Tradução mock não disponível para este idioma.');
      }
      return;
    }
  };

  /**
   * Troca para idioma já existente no cache
   */
  const switchLang = (targetLang: string) => {
    if (translations[targetLang]) {
      setLang(targetLang);
      setData(translations[targetLang]);
    }
  };

  /**
   * Salva uma tradução nova no cache e aplica
   */
  const saveTranslation = (targetLang: string, translatedData: CvData) => {
    setTranslations((prev) => ({
      ...prev,
      [targetLang]: translatedData,
    }));
    setLang(targetLang);
    setData(translatedData);
  };

  /**
   * Limpa todas as traduções do cache (exceto ptbr)
   */
  const clearTranslations = () => {
    setTranslations({ ptbr: cvData });
    setLang('ptbr');
    setData(cvData);
  };

  // Adiciona exportação de translationMode no hook
  return {
    lang,
    data,
    loading,
    error,
    translations,
    handleTranslate,
    switchLang,
    saveTranslation,
    clearTranslations,
    setTranslationMode: (mode: string) => setTranslationMode(mode as 'ai' | 'mock'),
    userAcceptedFallback,
    setUserAcceptedFallback,
    status,
    translationMode,
  };
}
