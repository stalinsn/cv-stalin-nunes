export async function translateWithAI(cvData: any, targetLang: string, token?: string, origem?: string) {
  const res = await fetch('/api/translate', {
    method: 'POST',
    body: JSON.stringify({ cvData, targetLang, token, origem }),
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    throw new Error('Erro na tradução IA');
  }

  const json = await res.json();
  return {
    translated: json.translated,
    tokensUsed: json.tokensUsed,
  };
}
