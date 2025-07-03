import { translateWithAI } from './translateAI';
import { translateMock, translateMockString } from './translateMock';

const useAI = process.env.NEXT_PUBLIC_ENABLE_AI === 'true';

export async function translate(text: string, targetLang: string) {
  if (!text) return '';

  try {
    if (useAI) {
      const translated = await translateWithAI(text, targetLang);
      return translated;
    } else {
      const result = await translateMockString(text, targetLang);
      return result.translated;
    }
  } catch (error) {
    console.warn(
      `[Translation Error] IA falhou. Usando Mock. Motivo: ${error}`
    );
    const result = await translateMockString(text, targetLang);
    return result.translated;
  }
}
