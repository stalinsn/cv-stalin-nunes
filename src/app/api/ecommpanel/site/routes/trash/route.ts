import type { NextRequest } from 'next/server';
import { getApiAuthContext, hasPermission } from '@/features/ecommpanel/server/auth';
import { errorNoStore, jsonNoStore } from '@/features/ecommpanel/server/http';
import { listTrashedSitePages } from '@/features/ecommpanel/server/siteBuilderStore';

export const dynamic = 'force-dynamic';

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

  const routes = listTrashedSitePages().map((page) => ({
    id: page.id,
    title: page.title,
    slug: page.slug,
    status: page.status,
    updatedAt: page.updatedAt,
    publishedAt: page.publishedAt,
    deleteExpiresAt: page.deleteExpiresAt,
  }));

  return jsonNoStore({ routes });
}
