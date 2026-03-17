import type { NextRequest } from 'next/server';
import {
  getApiAuthContext,
  hasPermission,
  hasValidCsrf,
  isTrustedOrigin,
} from '@/features/ecommpanel/server/auth';
import { errorNoStore, jsonNoStore } from '@/features/ecommpanel/server/http';
import {
  getSitePageById,
  getSitePageBySlug,
  isValidSlug,
  normalizeSlug,
  updateSitePage,
} from '@/features/ecommpanel/server/siteBuilderStore';
import type { SiteLayoutPreset, SitePageSeo, SitePageSlot, SitePageTheme } from '@/features/ecommpanel/types/siteBuilder';
import { getReservedStorefrontSlugError } from '@/features/site-runtime/routeRules';

export const dynamic = 'force-dynamic';

type UpdatePageBody = {
  title?: string;
  slug?: string;
  description?: string;
  layoutPreset?: SiteLayoutPreset;
  slots?: SitePageSlot[];
  seo?: SitePageSeo;
  theme?: SitePageTheme;
};

async function requireSiteContentPermission(req: NextRequest) {
  const auth = await getApiAuthContext(req);
  if (!auth) return { error: errorNoStore(401, 'Não autenticado.') };
  if (!hasPermission(auth.user, 'site.content.manage')) {
    return { error: errorNoStore(403, 'Sem permissão para gerenciar páginas.') };
  }
  return { auth };
}

export async function GET(req: NextRequest, context: { params: Promise<{ pageId: string }> }) {
  const guard = await requireSiteContentPermission(req);
  if ('error' in guard) return guard.error;

  const { pageId } = await context.params;
  const page = getSitePageById(pageId);
  if (!page) {
    return errorNoStore(404, 'Página não encontrada.');
  }

  return jsonNoStore({ page });
}

export async function PUT(req: NextRequest, context: { params: Promise<{ pageId: string }> }) {
  if (!isTrustedOrigin(req)) {
    return errorNoStore(403, 'Origem não permitida.');
  }

  const guard = await requireSiteContentPermission(req);
  if ('error' in guard) return guard.error;

  if (!hasValidCsrf(req, guard.auth.csrfToken)) {
    return errorNoStore(403, 'Token CSRF inválido.');
  }

  const { pageId } = await context.params;
  const current = getSitePageById(pageId);
  if (!current) {
    return errorNoStore(404, 'Página não encontrada.');
  }

  const body = (await req.json().catch(() => null)) as UpdatePageBody | null;
  const title = body?.title?.trim() || '';
  const slug = normalizeSlug(body?.slug || '');
  const description = body?.description?.trim() || '';
  const layoutPreset = body?.layoutPreset;
  const slots = Array.isArray(body?.slots) ? body?.slots : null;
  const seo = body?.seo;
  const theme = body?.theme;

  if (!title || !slug || !layoutPreset || !slots) {
    return errorNoStore(400, 'Título, slug, layout e slots são obrigatórios.');
  }

  if (!isValidSlug(slug)) {
    return errorNoStore(400, 'Caminho inválido. Use letras minúsculas, números, hífen e barra para segmentação.');
  }

  const reservedError = getReservedStorefrontSlugError(slug);
  if (reservedError) {
    return errorNoStore(409, reservedError);
  }

  const duplicate = getSitePageBySlug(slug);
  if (duplicate && duplicate.id !== pageId) {
    return errorNoStore(409, 'Já existe uma página com esse slug.');
  }

  const page = updateSitePage(pageId, {
    title,
    slug,
    description,
    layoutPreset,
    slots,
    seo,
    theme,
  });

  if (!page) {
    return errorNoStore(404, 'Página não encontrada.');
  }

  return jsonNoStore({ ok: true, page });
}
