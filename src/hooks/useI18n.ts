'use client';

import { useState, useEffect, useCallback } from 'react';
import { cvData } from '@/data';
import { cvDataEn } from '@/data/cv-en';
import { cvDataEs } from '@/data/cv-es';
import { cvDataFr } from '@/data/cv-fr';
import { cvDataDe } from '@/data/cv-de';
import { translateWithAI } from '@/lib/translateService';
import { CvData } from '@/types/cv';
import { TranslationStatus, TranslationMode, TranslationCache } from '@/types/translation';
import { clearTranslationCache, getTranslationCache, setTranslationCache } from '@/utils/translationCache';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { 
  SUPPORTED_LANGUAGES, 
  SupportedLanguage, 
  DEFAULT_LANGUAGE 
} from '@/constants/languages';
import { 
  normalizeLangCode, 
  toApiLangCode, 
  isValidLanguage 
} from '@/utils/languageUtils';

// Dados mockados por idioma
const MOCK_DATA: Record<SupportedLanguage, CvData> = {
  [SUPPORTED_LANGUAGES.PTBR]: cvData,
  [SUPPORTED_LANGUAGES.EN]: cvDataEn,
  [SUPPORTED_LANGUAGES.ES]: cvDataEs,
  [SUPPORTED_LANGUAGES.FR]: cvDataFr,
  [SUPPORTED_LANGUAGES.DE]: cvDataDe,
};

const INITIAL_STATUS: TranslationStatus = {
  tokensUsed: null,
  elapsedTime: null,
  payloadSize: null,
  charCount: null,
  model: '',
  promptTokens: null,
  completionTokens: null,
  mode: null,
};

export function useI18n() {
  // Estados principais
  const [lang, setLang] = useState<SupportedLanguage>(DEFAULT_LANGUAGE);
  const [data, setData] = useState<CvData>(cvData);
  const [translations, setTranslations] = useState<TranslationCache>({
    [DEFAULT_LANGUAGE]: cvData,
  });
  
  // Estados da tradução
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [translationMode, setTranslationMode] = useState<TranslationMode>('ai');
  const [userAcceptedFallback, setUserAcceptedFallback] = useState(false);
  const [status, setStatus] = useState<TranslationStatus>(INITIAL_STATUS);
  
  // LocalStorage com SSR
  const [lastLang, setLastLang] = useLocalStorage<SupportedLanguage>('lastLang', DEFAULT_LANGUAGE);
  
  // Inicializa idioma do localStorage
  useEffect(() => {
    if (isValidLanguage(lastLang) && lastLang !== lang) {
      setLang(lastLang);
      if (translations[lastLang]) {
        setData(translations[lastLang]);
      }
    }
  }, [lastLang, lang, translations]);

  // Função para trocar idioma (com cache)
  const switchLang = useCallback((targetLang: string) => {
    const normalizedLang = normalizeLangCode(targetLang);
    if (lang === normalizedLang) return;

    if (translations[normalizedLang]) {
      setLang(normalizedLang);
      setData(translations[normalizedLang]);
      setLastLang(normalizedLang);
      setError(null);
      setStatus({
        tokensUsed: 0,
        elapsedTime: 0,
        payloadSize: JSON.stringify(data).length,
        charCount: JSON.stringify(translations[normalizedLang]).length,
        model: 'cache local',
        promptTokens: null,
        completionTokens: null,
        mode: 'cache',
      });
    }
  }, [lang, data, translations, setLastLang]);

  // Função para salvar tradução
  const saveTranslation = useCallback((targetLang: SupportedLanguage, translatedData: CvData) => {
    setTranslations(prev => ({
      ...prev,
      [targetLang]: translatedData,
    }));
    setLang(targetLang);
    setData(translatedData);
    setLastLang(targetLang);
    setError(null);
  }, [setLastLang]);

  const setCacheStatus = useCallback((sourceData: CvData, translatedData: CvData) => {
    setStatus({
      tokensUsed: 0,
      elapsedTime: 0,
      payloadSize: JSON.stringify(sourceData).length,
      charCount: JSON.stringify(translatedData).length,
      model: 'cache local',
      promptTokens: null,
      completionTokens: null,
      mode: 'cache',
    });
  }, []);

  // Função principal de tradução
  const handleTranslate = useCallback(async (
    targetLang: string, 
    token?: string, 
    origem?: string,
    modeOverride?: TranslationMode
  ) => {
    setError(null);
    const normalizedLang = normalizeLangCode(targetLang);
    const activeMode = modeOverride || translationMode;
    
    if (lang === normalizedLang) return true;

    // 1. Verifica cache local
    const cached = getTranslationCache(JSON.stringify(data), normalizedLang);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as CvData;
        saveTranslation(normalizedLang, parsed);
        setCacheStatus(data, parsed);
        return true;
      } catch (error) {
        console.warn('Erro ao parsear cache:', error);
      }
    }

    // 2. Verifica cache em memória
    if (translations[normalizedLang]) {
      setCacheStatus(data, translations[normalizedLang]);
      switchLang(normalizedLang);
      return true;
    }

    // 3. Tradução por IA
    if (activeMode === 'ai') {
      setLoading(true);
      const start = Date.now();
      
      try {
        const apiLang = toApiLangCode(normalizedLang);
        const result = await translateWithAI(data, apiLang, token, origem);
        const elapsed = Date.now() - start;
        
        if (!result?.translated) {
          throw new Error('Tradução IA não retornou resultado válido.');
        }
        
        // Salva nos caches
        saveTranslation(normalizedLang, result.translated);
        setTranslationCache(
          JSON.stringify(data), 
          normalizedLang, 
          JSON.stringify(result.translated)
        );
        
        // Atualiza estatísticas
        setStatus({
          tokensUsed: result.tokensUsed || null,
          elapsedTime: elapsed,
          payloadSize: JSON.stringify(data).length,
          charCount: JSON.stringify(result.translated).length,
          model: process.env.NEXT_PUBLIC_OPENAI_MODEL || 'gpt-4o-mini',
          promptTokens: result.promptTokens || null,
          completionTokens: result.completionTokens || null,
          mode: 'ai',
        });
        
        return true;
      } catch (error) {
        console.error('Erro na tradução IA:', error);
        setError('A tradução com IA está indisponível no momento. Gostaria de usar a tradução padrão?');
        setStatus(INITIAL_STATUS);
        return false;
      } finally {
        setLoading(false);
      }
    }

    // 4. Fallback para mock
    if (activeMode === 'mock' || (error && userAcceptedFallback)) {
      const start = Date.now();
      const mockData = MOCK_DATA[normalizedLang];
      if (!mockData) {
        setError('Tradução padrão não disponível para este idioma.');
        return false;
      }

      saveTranslation(normalizedLang, mockData);
      setStatus({
        tokensUsed: 0,
        elapsedTime: Date.now() - start,
        payloadSize: JSON.stringify(data).length,
        charCount: JSON.stringify(mockData).length,
        model: 'mock',
        promptTokens: null,
        completionTokens: null,
        mode: 'mock',
      });
      return true;
    }

    return false;
  }, [
    lang, 
    data, 
    translations, 
    translationMode, 
    error, 
    userAcceptedFallback,
    saveTranslation,
    switchLang,
    setCacheStatus
  ]);

  // Função para limpar traduções
  const clearTranslations = useCallback(() => {
    setTranslations({ [DEFAULT_LANGUAGE]: cvData });
    setLang(DEFAULT_LANGUAGE);
    setData(cvData);
    setLastLang(DEFAULT_LANGUAGE);
    setError(null);
    setStatus(INITIAL_STATUS);
    clearTranslationCache();
  }, [setLastLang]);

  // Função wrapper para mudança de modo de tradução
  const changeTranslationMode = useCallback((mode: string) => {
    setTranslationMode(mode as TranslationMode);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Estados principais
    lang,
    data,
    translations,
    
    // Estados da tradução
    loading,
    error,
    translationMode,
    userAcceptedFallback,
    status,
    
    // Funções
    handleTranslate,
    switchLang,
    saveTranslation,
    clearTranslations,
    setTranslationMode: changeTranslationMode,
    setUserAcceptedFallback,
    clearError,
  };
}
