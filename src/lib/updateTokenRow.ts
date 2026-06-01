import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

const SHEET_ID = process.env.GOOGLE_SHEET_ID || '1ESe5JpZFiZTRVDAPZ3uxLAXBek3KoNE3NXDuLqXS6bk';
const SHEET_NAME = 'TokensIA';

// Função para obter credenciais do Google a partir das variáveis de ambiente
function getGoogleCredentials() {
  const envCredentials = {
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

  if (
    envCredentials.project_id &&
    envCredentials.private_key_id &&
    envCredentials.private_key &&
    envCredentials.client_email &&
    envCredentials.client_id
  ) {
    return envCredentials;
  }

  const serviceAccountPath = path.join(process.cwd(), 'google-service-account.json');
  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error('Credenciais Google ausentes: defina GOOGLE_SERVICE_ACCOUNT_* ou google-service-account.json');
  }

  const fileCredentials = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8')) as Record<string, string>;
  return {
    type: fileCredentials.type || 'service_account',
    project_id: fileCredentials.project_id,
    private_key_id: fileCredentials.private_key_id,
    private_key: fileCredentials.private_key?.replace(/\\n/g, '\n'),
    client_email: fileCredentials.client_email,
    client_id: fileCredentials.client_id,
    auth_uri: fileCredentials.auth_uri || 'https://accounts.google.com/o/oauth2/auth',
    token_uri: fileCredentials.token_uri || 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(fileCredentials.client_email || '')}`,
    universe_domain: 'googleapis.com'
  };
}

export async function updateTokenRow({ token, update }: { token: string, update: Record<string, unknown> }) {
  const credentials = getGoogleCredentials();
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
