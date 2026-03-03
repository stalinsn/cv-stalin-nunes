import 'server-only';

import type { RuntimeResolveResult } from '@/features/site-runtime/contracts';
import { normalizeRuntimePath, resolveDynamicRuntimePath } from '@/features/site-runtime/server/publishedStore';

const NATIVE_STATIC_PATHS = new Set<string>(['/', '/plp', '/cart', '/checkout', '/checkout/confirmation']);
const NATIVE_DYNAMIC_PATTERNS: RegExp[] = [/^\/[^/]+\/p$/];

function isNativePath(pathname: string): boolean {
  if (NATIVE_STATIC_PATHS.has(pathname)) return true;
  return NATIVE_DYNAMIC_PATTERNS.some((pattern) => pattern.test(pathname));
}

export function resolveStorefrontPath(pathname: string): RuntimeResolveResult {
  const path = normalizeRuntimePath(pathname);
  const page = resolveDynamicRuntimePath(path);
  if (page) {
    return { source: 'dynamic', path, page };
  }

  if (isNativePath(path)) {
    return { source: 'native', path, page: null };
  }

  return { source: 'not_found', path, page: null };
}
