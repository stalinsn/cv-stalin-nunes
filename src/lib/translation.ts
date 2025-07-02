import { translateWithAI } from './translateAI';
import { translateMock } from './translateMock';

const useAI = process.env.NEXT_PUBLIC_ENABLE_AI === 'true';

export async function translate(text: string, targetLang: string) {
  if (!text) return '';

  try {
    if (useAI) {
      const translated = await translateWithAI(text, targetLang);
      return translated;
    } else {
      return translateMock(text, targetLang);
    }
  } catch (error) {
    console.warn(
      `[Translation Error] IA falhou. Usando Mock. Motivo: ${error}`
    );
    return translateMock(text, targetLang);
  }
}
