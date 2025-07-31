import { translateWithAI } from './translateAI';
import { translateWithFreeAPI } from './translateFree';
import { translateMockString } from './translateMock';

const useAI = process.env.NEXT_PUBLIC_ENABLE_AI === 'true';
const useFree = process.env.NEXT_PUBLIC_ENABLE_FREE === 'true';

export async function translate(text: string, targetLang: string) {
  if (!text) return '';

  try {
    if (useAI) {
      return await translateWithAI(text, targetLang);
    } else if (useFree) {
      return await translateWithFreeAPI(text, targetLang);
    } else {
      const result = await translateMockString(text, targetLang);
      return result.translated;
    }
  } catch (error) {
    console.warn(
      `[Translation Error] Tradução falhou. Usando Mock. Motivo: ${error}`
    );
    const result = await translateMockString(text, targetLang);
    return result.translated;
  }
}
