import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SHEET_ID = '1ESe5JpZFiZTRVDAPZ3uxLAXBek3KoNE3NXDuLqXS6bk';
const SHEET_NAME = 'TokensIA';
const CREDENTIALS_PATH = path.resolve(process.cwd(), 'google-service-account.json');

function getAuth() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
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
      // Decrementa usos_restantes
      const newUsos = Number(usos) - 1;
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: `${SHEET_NAME}!B${i + 2}`,
        valueInputOption: 'RAW',
        requestBody: { values: [[newUsos.toString()]] },
      });
      return NextResponse.json({ success: true, usos_restantes: newUsos });
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
