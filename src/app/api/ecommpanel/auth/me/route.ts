import type { NextRequest } from 'next/server';
import { getApiAuthContext, setAuthCookies } from '@/features/ecommpanel/server/auth';
import { errorNoStore, jsonNoStore } from '@/features/ecommpanel/server/http';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await getApiAuthContext(req);

  if (!auth) {
    return errorNoStore(401, 'Não autenticado.');
  }

  const response = jsonNoStore({
    authenticated: true,
    user: auth.user,
    csrfToken: auth.csrfToken,
  });

  // Refresh cookie max-age on each validated session read.
  setAuthCookies(response, auth.rawSessionId, auth.csrfToken);
  return response;
}
