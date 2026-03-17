import type { NextRequest } from 'next/server';
import {
  getApiAuthContext,
  hasPermission,
  hasValidCsrf,
  isTrustedOrigin,
} from '@/features/ecommpanel/server/auth';
import { errorNoStore, jsonNoStore } from '@/features/ecommpanel/server/http';
import { getStorefrontTemplate, updateStorefrontTemplate } from '@/features/ecommpanel/server/storefrontTemplateStore';

export const dynamic = 'force-dynamic';

type UpdateTemplateBody = {
  template?: unknown;
};

async function requireSiteLayoutPermission(req: NextRequest) {
  const auth = await getApiAuthContext(req);
  if (!auth) return { error: errorNoStore(401, 'Não autenticado.') };
  if (!hasPermission(auth.user, 'site.layout.manage')) {
    return { error: errorNoStore(403, 'Sem permissão para gerenciar o template da loja.') };
  }
  return { auth };
}

export async function GET(req: NextRequest) {
  const guard = await requireSiteLayoutPermission(req);
  if ('error' in guard) return guard.error;

  return jsonNoStore({ template: getStorefrontTemplate() });
}

export async function PATCH(req: NextRequest) {
  if (!isTrustedOrigin(req)) {
    return errorNoStore(403, 'Origem não permitida.');
  }

  const guard = await requireSiteLayoutPermission(req);
  if ('error' in guard) return guard.error;

  if (!hasValidCsrf(req, guard.auth.csrfToken)) {
    return errorNoStore(403, 'Token CSRF inválido.');
  }

  const body = (await req.json().catch(() => null)) as UpdateTemplateBody | null;
  if (!body?.template) {
    return errorNoStore(400, 'Payload do template é obrigatório.');
  }

  const template = updateStorefrontTemplate(body.template);
  return jsonNoStore({ ok: true, template });
}
