import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';
import { updateTokenRow } from '@/lib/updateTokenRow';
import crypto from 'crypto';

const DEFAULT_OPENAI_MODEL = 'gpt-4o-mini';

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  return new OpenAI({ apiKey });
}

function getTranslationModel() {
  return process.env.OPENAI_MODEL || process.env.NEXT_PUBLIC_OPENAI_MODEL || DEFAULT_OPENAI_MODEL;
}

function getOpenAIErrorResponse(error: unknown) {
  const apiError = error as {
    status?: number;
    code?: string;
    type?: string;
    message?: string;
  };

  if (apiError.status === 401) {
    return NextResponse.json(
      { error: 'Chave da OpenAI inválida, expirada ou sem acesso ao projeto configurado.' },
      { status: 502 },
    );
  }

  if (apiError.status === 404 || apiError.code === 'model_not_found') {
    return NextResponse.json(
      { error: `Modelo OpenAI indisponível ou sem acesso: ${getTranslationModel()}.` },
      { status: 502 },
    );
  }

  if (apiError.status === 429 || apiError.code === 'insufficient_quota') {
    return NextResponse.json(
      { error: 'Crédito, limite mensal ou rate limit da OpenAI atingido. Verifique billing/limits no painel da OpenAI.' },
      { status: 429 },
    );
  }

  console.error('Erro na chamada OpenAI:', error);
  return NextResponse.json(
    { error: 'Falha ao chamar a OpenAI para tradução.' },
    { status: 502 },
  );
}

const languageNames: Record<string, string> = {
  ptbr: 'Português (Brasil)',
  en: 'Inglês',
  es: 'Espanhol',
  fr: 'Francês',
  de: 'Alemão',
  it: 'Italiano',
};

export async function POST(req: NextRequest) {
  let openai: OpenAI;

  try {
    openai = getOpenAIClient();
  } catch {
    return NextResponse.json(
      { error: 'Serviço de tradução indisponível no momento.' },
      { status: 503 },
    );
  }

  const { cvData, targetLang, token, password, origem } = await req.json();

  if (password) {
    const correctPassword = process.env.AI_TRANSLATE_PASSWORD;
    if (!correctPassword || password !== correctPassword) {
      return NextResponse.json({ error: 'Senha incorreta.' }, { status: 401 });
    }
  } else if (!token) {
    return NextResponse.json({ error: 'Token de autorização ou senha obrigatório.' }, { status: 401 });
  }

  let usosRestantes: number | null = null;

  if (!password && token) {
    const validateRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/validate-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    const validateJson = await validateRes.json().catch(() => ({}));

    if (!validateRes.ok) {
      if (validateRes.status === 403) {
        return NextResponse.json({ error: 'Token inválido ou esgotado.' }, { status: 401 });
      }

      if (validateRes.status === 429) {
        return NextResponse.json({ error: validateJson.error || 'Muitas tentativas inválidas.' }, { status: 429 });
      }

      return NextResponse.json({ error: 'Falha interna ao validar token.' }, { status: 500 });
    }

    if (!validateJson.success) {
      return NextResponse.json({ error: 'Token inválido ou esgotado.' }, { status: 401 });
    }

    usosRestantes = typeof validateJson.usos_restantes === 'number' ? validateJson.usos_restantes : 0;
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
  const modelo = getTranslationModel();
  let completion: OpenAI.Chat.Completions.ChatCompletion;

  try {
    completion = await openai.chat.completions.create({
      model: modelo,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0,
    });
  } catch (error) {
    return getOpenAIErrorResponse(error);
  }

  const elapsed = (Date.now() - start) / 1000;
  const result = completion.choices[0].message?.content?.trim();
  const tokensUsed = completion.usage?.total_tokens || 0;
  const promptTokens = completion.usage?.prompt_tokens || 0;
  const completionTokens = completion.usage?.completion_tokens || 0;
  const userAgent = req.headers.get('user-agent') || '';
  const ip = req.headers.get('x-forwarded-for') || '';
  const texto_hash = crypto.createHash('sha256').update(JSON.stringify(cvData)).digest('hex');
  let status = 'sucesso';

  try {
    const json = JSON.parse(result || '{}');

    if (token && typeof usosRestantes === 'number' && usosRestantes > 0) {
      await updateTokenRow({ token, update: { usos_restantes: usosRestantes - 1 } });
    }

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
      },
    });

    return NextResponse.json({
      translated: json,
      tokensUsed,
      promptTokens,
      completionTokens,
      model: modelo,
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
      },
    });

    console.error('Erro ao parsear a resposta da IA:', error);
    return NextResponse.json({ error: 'Falha ao converter a resposta em JSON' }, { status: 500 });
  }
}
