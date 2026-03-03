import type { NextRequest } from 'next/server';
import { PANEL_SECURITY } from '@/features/ecommpanel/config/security';
import { isTrustedOrigin } from '@/features/ecommpanel/server/auth';
import { errorNoStore, jsonNoStore } from '@/features/ecommpanel/server/http';
import { addAuditEvent, ensureSeededUsers, getUserByEmail, mockResetTokenForUser } from '@/features/ecommpanel/server/mockStore';
import { getRequestFingerprint } from '@/features/ecommpanel/server/requestMeta';
import { checkRateLimit } from '@/features/ecommpanel/server/rateLimit';

export const dynamic = 'force-dynamic';

type ForgotPasswordBody = {
  email?: string;
};

const GENERIC_MESSAGE = 'Se o e-mail existir e estiver ativo, enviaremos as instruções de recuperação.';

export async function POST(req: NextRequest) {
  if (!isTrustedOrigin(req)) {
    return errorNoStore(403, 'Origem não permitida.');
  }

  const rate = checkRateLimit(
    `auth:forgot:${getRequestFingerprint(req)}`,
    PANEL_SECURITY.rateLimits.forgotPassword.limit,
    PANEL_SECURITY.rateLimits.forgotPassword.windowMs,
  );

  if (!rate.allowed) {
    const response = errorNoStore(429, 'Muitas tentativas. Aguarde para tentar novamente.');
    response.headers.set('Retry-After', String(rate.retryAfterSeconds));
    return response;
  }

  const body = (await req.json().catch(() => null)) as ForgotPasswordBody | null;
  const email = body?.email?.trim().toLowerCase() || '';

  if (!email) {
    return errorNoStore(400, 'Informe um e-mail válido.');
  }

  await ensureSeededUsers();
  const user = getUserByEmail(email);

  let resetToken: string | null = null;
  if (user?.active) {
    resetToken = mockResetTokenForUser(email);
  }

  addAuditEvent({
    actorUserId: user?.id,
    event: 'auth.forgot-password',
    outcome: 'success',
    target: email,
  });

  return jsonNoStore({
    ok: true,
    message: GENERIC_MESSAGE,
    ...(process.env.NODE_ENV !== 'production' && resetToken ? { debugResetToken: resetToken } : {}),
  });
}
