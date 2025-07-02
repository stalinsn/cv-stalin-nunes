import React from 'react';

interface LanguageMap {
  [code: string]: string;
}

export const languageLabels: LanguageMap = {
  ptbr: 'Português',
  en: 'Inglês',
  es: 'Espanhol',
  fr: 'Francês',
  de: 'Alemão',
  it: 'Italiano',
};
