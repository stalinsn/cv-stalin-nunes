import type { NextRequest } from 'next/server';
import {
  getApiAuthContext,
  hasPermission,
  hasValidCsrf,
  isTrustedOrigin,
} from '@/features/ecommpanel/server/auth';
import { errorNoStore, jsonNoStore } from '@/features/ecommpanel/server/http';
import {
  createSitePage,
  getSitePageBySlug,
  isValidSlug,
  listSitePages,
  normalizeSlug,
} from '@/features/ecommpanel/server/siteBuilderStore';

export const dynamic = 'force-dynamic';

type CreateRouteBody = {
  title?: string;
  slug?: string;
  description?: string;
};

async function requireSiteContentPermission(req: NextRequest) {
  const auth = await getApiAuthContext(req);
  if (!auth) return { error: errorNoStore(401, 'Não autenticado.') };
  if (!hasPermission(auth.user, 'site.content.manage')) {
    return { error: errorNoStore(403, 'Sem permissão para gerenciar rotas.') };
  }
  return { auth };
}

export async function GET(req: NextRequest) {
  const guard = await requireSiteContentPermission(req);
  if ('error' in guard) return guard.error;

  const routes = listSitePages().map((page) => ({
    id: page.id,
    title: page.title,
    slug: page.slug,
    status: page.status,
    updatedAt: page.updatedAt,
    publishedAt: page.publishedAt,
  }));

  return jsonNoStore({ routes });
}

export async function POST(req: NextRequest) {
  if (!isTrustedOrigin(req)) {
    return errorNoStore(403, 'Origem não permitida.');
  }

  const guard = await requireSiteContentPermission(req);
  if ('error' in guard) return guard.error;

  if (!hasValidCsrf(req, guard.auth.csrfToken)) {
    return errorNoStore(403, 'Token CSRF inválido.');
  }

  const body = (await req.json().catch(() => null)) as CreateRouteBody | null;
  const title = body?.title?.trim() || '';
  const slug = normalizeSlug(body?.slug || '');

  if (!title || !slug) {
    return errorNoStore(400, 'Título e slug são obrigatórios.');
  }

  if (!isValidSlug(slug)) {
    return errorNoStore(400, 'Slug inválido. Use apenas letras minúsculas, números e hífen.');
  }

  if (getSitePageBySlug(slug)) {
    return errorNoStore(409, 'Já existe uma rota com esse slug.');
  }

  const page = createSitePage({
    title,
    slug,
    description: body?.description,
  });

  return jsonNoStore({ ok: true, route: page });
}
