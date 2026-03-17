import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

const SHEET_ID = process.env.GOOGLE_SHEET_ID || '1ESe5JpZFiZTRVDAPZ3uxLAXBek3KoNE3NXDuLqXS6bk';
const SHEET_NAME = 'TokensIA';

// Função para obter credenciais do Google a partir das variáveis de ambiente
function getGoogleCredentials() {
  return {
    type: process.env.GOOGLE_SERVICE_ACCOUNT_TYPE || 'service_account',
    project_id: process.env.GOOGLE_SERVICE_ACCOUNT_PROJECT_ID,
    private_key_id: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_ID,
    auth_uri: process.env.GOOGLE_SERVICE_ACCOUNT_AUTH_URI || 'https://accounts.google.com/o/oauth2/auth',
    token_uri: process.env.GOOGLE_SERVICE_ACCOUNT_TOKEN_URI || 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL || '')}`,
    universe_domain: 'googleapis.com'
  };
}

function getAuth() {
  const credentials = getGoogleCredentials();
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

// Controle de tentativas e bloqueio por IP
const ATTEMPT_LIMIT = 5;
const BLOCK_TIME_MINUTES = 10;
const ipAttempts: Record<string, { count: number; last: number; blockedUntil?: number }> = {};

export async function POST(req: NextRequest) {
  const { token } = await req.json();
  const ip = req.headers.get('x-forwarded-for') || '';
  // Bloqueio temporário por IP
  const now = Date.now();
  if (ipAttempts[ip]?.blockedUntil && now < ipAttempts[ip].blockedUntil) {
    return NextResponse.json({ error: `Muitas tentativas inválidas. Tente novamente em alguns minutos.` }, { status: 429 });
  }

  if (!token) return NextResponse.json({ error: 'Token não informado.' }, { status: 400 });

  const auth = await getAuth();
  const sheets = google.sheets({ version: 'v4', auth });

  // Busca todos os tokens
  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A2:C`, // pula cabeçalho
  });
  const rows = data.values || [];
  for (let i = 0; i < rows.length; i++) {
    const [sheetToken, usos, ativo] = rows[i];
    if (sheetToken === token && ativo === 'TRUE' && Number(usos) > 0) {
      // Reset tentativas ao sucesso
      ipAttempts[ip] = { count: 0, last: now };
      // Apenas valida, não decrementa usos
      return NextResponse.json({ success: true, usos_restantes: Number(usos) });
    }
  }
  // Falha: incrementa tentativas
  if (!ipAttempts[ip]) ipAttempts[ip] = { count: 0, last: now };
  ipAttempts[ip].count++;
  ipAttempts[ip].last = now;
  if (ipAttempts[ip].count >= ATTEMPT_LIMIT) {
    ipAttempts[ip].blockedUntil = now + BLOCK_TIME_MINUTES * 60 * 1000;
  }
  return NextResponse.json({ error: 'Token inválido, inativo ou esgotado.' }, { status: 403 });
}
