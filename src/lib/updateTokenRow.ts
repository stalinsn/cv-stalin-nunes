import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

const SHEET_ID = '1ESe5JpZFiZTRVDAPZ3uxLAXBek3KoNE3NXDuLqXS6bk';
const SHEET_NAME = 'TokensIA';
const CREDENTIALS_PATH = path.resolve(process.cwd(), 'google-service-account.json');

export async function updateTokenRow({ token, update }: { token: string, update: Record<string, any> }) {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const sheets = google.sheets({ version: 'v4', auth });
  // Busca todos os tokens
  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A2:N`, // 14 colunas
  });
  const rows = data.values || [];
  const header = [
    'token','usos_restantes','ativo','ultimo_uso','ip','idioma','tokens','tempo','modelo','user_agent','texto_hash','status','tentativas','origem'
  ];
  for (let i = 0; i < rows.length; i++) {
    if (rows[i][0] === token) {
      // Atualiza os campos informados
      const row = rows[i];
      header.forEach((col, idx) => {
        if (update[col] !== undefined) row[idx] = update[col];
      });
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: `${SHEET_NAME}!A${i + 2}:N${i + 2}`,
        valueInputOption: 'RAW',
        requestBody: { values: [row] },
      });
      return true;
    }
  }
  return false;
}
