// Utilitário para cache local de traduções por idioma/texto
// Chave: hash(texto) + idioma

export function getTranslationCache(text: string, lang: string): string | null {
  try {
    const key = `translation_${lang}_${hashString(text)}`;
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function setTranslationCache(text: string, lang: string, translation: string) {
  try {
    const key = `translation_${lang}_${hashString(text)}`;
    localStorage.setItem(key, translation);
  } catch {}
}

export function clearTranslationCache() {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith('translation_'))
      .forEach((k) => localStorage.removeItem(k));
  } catch {}
}

function hashString(str: string): string {
  let hash = 0, i, chr;
  if (str.length === 0) return hash.toString();
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash.toString();
}
