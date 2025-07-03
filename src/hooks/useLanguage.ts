'use client';

import { useState } from 'react';
import { labels } from '@/data/labels';
import { cvData } from '@/data/cv-ptbr';
import { cvDataEn } from '@/data/cv-en';
import { cvDataEs } from '@/data/cv-es';
import { cvDataFr } from '@/data/cv-fr';
import { cvDataDe } from '@/data/cv-de';

const dataMap = {
  ptbr: cvData,
  en: cvDataEn,
  es: cvDataEs,
  fr: cvDataFr,
  de: cvDataDe,
};

export function useLanguage() {
  const [lang, setLang] = useState<'ptbr' | 'en' | 'es' | 'fr' | 'de'>('ptbr');
  const [data, setData] = useState(dataMap[lang]);
  const t = labels[lang] || labels['ptbr'];

  const setLangAndData = (newLang: 'ptbr' | 'en' | 'es' | 'fr' | 'de') => {
    setLang(newLang);
    setData(dataMap[newLang]);
  };

  const translateViaAPI = async (text: string, targetLang: string) => {
    const res = await fetch('/api/translate', {
      method: 'POST',
      body: JSON.stringify({ text, targetLang }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await res.json();
    return result.translatedText;
  };

  return {
    lang,
    setLang: setLangAndData,
    data,
    setData,
    t,
    translateViaAPI, // 🔥 exporta isso se quiser usar em components
  };
}
