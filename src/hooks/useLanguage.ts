'use client';

import { useState, useEffect } from 'react';
import { labels } from '@/data/labels';
import { cvData, cvDataEn } from '@/data';

export function useLanguage() {
  const [lang, setLang] = useState<'ptbr' | 'en'>('ptbr');
  const [data, setData] = useState(lang === 'ptbr' ? cvData : cvDataEn);
  const t = labels[lang] || labels['ptbr'];

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
    setLang,
    data,
    setData,
    t,
    translateViaAPI, // 🔥 exporta isso se quiser usar em components
  };
}
