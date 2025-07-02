import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const languageNames: Record<string, string> = {
  ptbr: "Português (Brasil)",
  en: "Inglês",
  es: "Espanhol", 
  fr: "Francês", 
  de: "Alemão", 
  it: "Italiano", 
  // se quiser suporte a mais, inclua aqui…
};

export async function POST(req: NextRequest) {
  const { cvData, targetLang } = await req.json();
  const langName = languageNames[targetLang] || targetLang;

  const prompt = `Traduza este currículo para ${langName} e retorne **apenas** o JSON.
Preserve a estrutura do objeto, apenas traduza os textos.

Currículo:
${JSON.stringify(cvData, null, 2)}`;

  const completion = await openai.chat.completions.create({
    model: process.env.NEXT_PUBLIC_OPENAI_MODEL || "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0,
  });

  const result = completion.choices[0].message?.content?.trim();
  const tokensUsed = completion.usage?.total_tokens || 0;

  try {
    const json = JSON.parse(result || "{}");
    return NextResponse.json({
      translated: json,
      tokensUsed,
    });
  } catch (error) {
    console.error("Erro ao parsear a resposta da IA:", error);
    return NextResponse.json(
      { error: "Falha ao converter a resposta em JSON" },
      { status: 500 }
    );
  }
}
