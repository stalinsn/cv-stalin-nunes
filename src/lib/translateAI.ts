import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function translateWithAI(text: string, targetLang: string) {
  const completion = await openai.chat.completions.create({
    model: process.env.NEXT_PUBLIC_OPENAI_MODEL || 'gpt-3.5-turbo',
    messages: [
      {
        role: 'user',
        content: `Traduza este texto para ${targetLang}: ${text}`,
      },
    ],
  });

  return completion.choices[0].message?.content?.trim() || '';
}
