import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { updateTokenRow } from '@/lib/updateTokenRow';
import crypto from 'crypto';

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
  const { cvData, targetLang, token, password, origem } = await req.json();
  
  // Verificação de senha se fornecida
  if (password) {
    const correctPassword = process.env.AI_TRANSLATE_PASSWORD;
    if (correctPassword && password === correctPassword) {
      // Senha correta, prosseguir sem validação de token
    } else {
      return NextResponse.json({ error: 'Senha incorreta.' }, { status: 401 });
    }
  } else if (!token) {
    return NextResponse.json({ error: 'Token de autorização ou senha obrigatório.' }, { status: 401 });
  }
  
  // Validação do token via chamada interna (apenas se não foi autenticado por senha)
  if (!password && token) {
    const validateRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/validate-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    const validateJson = await validateRes.json();
    if (!validateJson.success) {
      return NextResponse.json({ error: 'Token inválido ou esgotado.' }, { status: 401 });
    }
    
    // Decrementa usos_restantes do token
    const usosRestantes = typeof validateJson.usos_restantes === 'number' ? validateJson.usos_restantes : 0;
    if (usosRestantes > 0) {
      await updateTokenRow({ token, update: { usos_restantes: usosRestantes - 1 } });
    }
  }

  const langName = languageNames[targetLang] || targetLang;

  const prompt = `Traduza este currículo para ${langName} e retorne **apenas** o JSON.
Preserve a estrutura do objeto, apenas traduza os textos.

IMPORTANTE: Adicione os seguintes campos ao JSON traduzido, com os títulos das seções principais traduzidos:
- summaryTitle
- coreSkillsTitle
- technicalSkillsTitle
- experienceTitle
- educationTitle
- languagesTitle

Exemplo:
{
  ...
  "summaryTitle": "Professional Summary",
  "coreSkillsTitle": "Core Skills",
  ...
}

Currículo:
${JSON.stringify(cvData, null, 2)}`;

  const start = Date.now();
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
  const elapsed = (Date.now() - start) / 1000;
  const result = completion.choices[0].message?.content?.trim();
  const tokensUsed = completion.usage?.total_tokens || 0;
  const modelo = process.env.NEXT_PUBLIC_OPENAI_MODEL || "gpt-3.5-turbo";
  const userAgent = req.headers.get('user-agent') || '';
  const ip = req.headers.get('x-forwarded-for') || '';
  const texto_hash = crypto.createHash('sha256').update(JSON.stringify(cvData)).digest('hex');
  let status = 'sucesso';
  try {
    const json = JSON.parse(result || "{}");
    // Atualiza planilha com estatísticas
    await updateTokenRow({
      token,
      update: {
        ultimo_uso: new Date().toISOString(),
        ip,
        idioma: targetLang,
        tokens: tokensUsed.toString(),
        tempo: elapsed.toFixed(2),
        modelo,
        user_agent: userAgent,
        texto_hash,
        status,
        origem: origem || '',
        // tentativas: incrementa no updateTokenRow
      }
    });
    return NextResponse.json({
      translated: json,
      tokensUsed,
    });
  } catch (error) {
    status = 'erro';
    await updateTokenRow({
      token,
      update: {
        ultimo_uso: new Date().toISOString(),
        ip,
        idioma: targetLang,
        tokens: tokensUsed.toString(),
        tempo: elapsed.toFixed(2),
        modelo,
        user_agent: userAgent,
        texto_hash,
        status,
        origem: origem || '',
      }
    });
    console.error("Erro ao parsear a resposta da IA:", error);
    return NextResponse.json(
      { error: "Falha ao converter a resposta em JSON" },
      { status: 500 }
    );
  }
}
