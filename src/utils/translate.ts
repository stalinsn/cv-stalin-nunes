export async function translateWithAI(text: string, targetLang: string) {
  const res = await fetch('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, targetLang }),
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || 'Erro na tradução');
  }

  const { translated } = await res.json();
  return translated;
}
