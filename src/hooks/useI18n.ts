'use client';

import { useState, useEffect } from 'react';
import { cvData } from '@/data';
import { cvDataEn } from '@/data/cv-en';
import { cvDataEs } from '@/data/cv-es';
import { cvDataFr } from '@/data/cv-fr';
import { cvDataDe } from '@/data/cv-de';
import { translateWithAI } from '@/lib/translateService';
import { CvData } from '@/types/cv';
import { getTranslationCache, setTranslationCache } from '@/utils/translationCache';

const mockMap: Record<string, CvData> = {
  ptbr: cvData,
  pt: cvData,
  en: cvDataEn,
  es: cvDataEs,
  fr: cvDataFr,
  de: cvDataDe,
};

export function useI18n() {
  // Corrigido: valor inicial de lang e translations para 'pt-br'
  const [lang, setLang] = useState<string>('pt-br');
  const [data, setData] = useState<CvData>(cvData);
  const [translations, setTranslations] = useState<Record<string, CvData>>({
    'pt-br': cvData,
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
    setTranslations({ 'pt-br': cvData });
    setLang('pt-br');
    setData(cvData);
  }, []);

  // Persistir idioma no localStorage sempre que mudar
  useEffect(() => {
    if (typeof window !== 'undefined' && lang) {
      localStorage.setItem('lastLang', lang);
    }
  }, [lang]);

  // Sempre normaliza o lang ao trocar
  useEffect(() => {
    if (lang && normalizeLangCode(lang) !== lang) {
      setLang(normalizeLangCode(lang));
    }
  }, [lang]);

  // Normaliza o código do idioma para os suportados no select/navbar
  function normalizeLangCode(code: string) {
    if (code === 'ptbr' || code === 'pt-br') return 'ptbr';
    if (code === 'en' || code === 'en-us') return 'en';
    if (code === 'es' || code === 'es-es') return 'es';
    if (code === 'fr' || code === 'fr-fr') return 'fr';
    if (code === 'de' || code === 'de-de') return 'de';
    return code;
  }

  // Converte código curto para código completo esperado pela API de tradução
  function toApiLangCode(code: string) {
    switch (code) {
      case 'ptbr': return 'pt-br';
      case 'en': return 'en-us';
      case 'es': return 'es-es';
      case 'fr': return 'fr-fr';
      case 'de': return 'de-de';
      default: return code;
    }
  }

  /**
   * Faz a tradução usando IA ou Mock
   */
  const handleTranslate = async (targetLang: string, token?: string, origem?: string) => {
    setError(null);
    const normalizedLang = normalizeLangCode(targetLang);
    if (lang === normalizedLang) return;

    // Tenta cache local antes de tudo
    const cached = getTranslationCache(JSON.stringify(data), normalizedLang);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        saveTranslation(normalizedLang, parsed);
        return;
      } catch {}
    }

    if (translations[normalizedLang]) {
      switchLang(normalizedLang);
      return;
    }

    if (translationMode === 'ai') {
      setLoading(true);
      const start = Date.now();
      try {
        // Usa código completo apenas na chamada da API
        const apiLang = toApiLangCode(normalizedLang);
        const result = await translateWithAI(data, apiLang, token, origem);
        const elapsed = Date.now() - start;
        if (!result || !result.translated) {
          throw new Error('Tradução IA não retornou resultado.');
        }
        saveTranslation(normalizedLang, result.translated);
        setTranslationCache(JSON.stringify(data), normalizedLang, JSON.stringify(result.translated));
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
    const normalizedLang = normalizeLangCode(targetLang);
    if (translations[normalizedLang]) {
      setLang(normalizedLang); // força atualização do idioma da interface
      setData(translations[normalizedLang]);
      if (typeof window !== 'undefined') {
        localStorage.setItem('lastLang', normalizedLang);
      }
      return;
    }
  };

  /**
   * Salva uma tradução nova no cache e aplica
   */
  const saveTranslation = (targetLang: string, translatedData: CvData) => {
    const normalizedLang = normalizeLangCode(targetLang);
    setTranslations((prev) => ({
      ...prev,
      [normalizedLang]: translatedData,
    }));
    setLang(normalizedLang);
    setData(translatedData);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lastLang', normalizedLang);
    }
  };

  /**
   * Limpa todas as traduções do cache (exceto pt-br)
   */
  const clearTranslations = () => {
    setTranslations({ 'pt-br': cvData });
    setLang('pt-br');
    setData(cvData);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lastLang', 'pt-br');
    }
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
