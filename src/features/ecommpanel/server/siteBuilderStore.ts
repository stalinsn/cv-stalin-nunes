import 'server-only';
import fs from 'node:fs';
import path from 'node:path';

import type { RuntimeResolvedPage } from '@/features/site-runtime/contracts';
import { publishRuntimePages } from '@/features/site-runtime/server/publishedStore';
import { normalizeStorefrontRoutePathCandidate } from '@/features/site-runtime/routeRules';
import { resolveSiteRouteNamespaceBySlug } from '@/features/ecommpanel/siteNamespaces';
import type {
  SiteBlock,
  SiteBlockType,
  SiteLayoutPreset,
  SitePage,
  SitePageSlot,
  SitePageStatus,
} from '../types/siteBuilder';
import { nowIso, randomToken } from './crypto';

const VALID_PAGE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/;
const TRASH_RETENTION_MS = 1000 * 60 * 60 * 24 * 30;

type SiteBuilderDb = {
  pages: Map<string, SitePage>;
  loaded: boolean;
  seeded: boolean;
};

type SitePageRecord = Omit<SitePage, 'slots'>;

type PersistedSiteBuilder = {
  pages: SitePage[];
};

type PersistedSiteRouteRegistry = {
  routes: SitePageRecord[];
};

type PersistedSitePageDocument = {
  pageId: string;
  slots: SitePageSlot[];
};

const LEGACY_DATA_FILE = path.join(process.cwd(), 'src/data/ecommpanel/site-pages.json');
const ROUTES_FILE = path.join(process.cwd(), 'src/data/ecommpanel/site-routes.json');
const PAGES_DIR = path.join(process.cwd(), 'src/data/ecommpanel/site-pages');

declare global {
  var __ECOMMPANEL_SITE_BUILDER_DB__: SiteBuilderDb | undefined;
}

function getDb(): SiteBuilderDb {
  if (!global.__ECOMMPANEL_SITE_BUILDER_DB__) {
    global.__ECOMMPANEL_SITE_BUILDER_DB__ = {
      pages: new Map(),
      loaded: false,
      seeded: false,
    };
  }
  return global.__ECOMMPANEL_SITE_BUILDER_DB__;
}

function createDefaultSeo(input: { title: string; description: string }): SitePage['seo'] {
  return {
    title: input.title,
    description: input.description,
    keywords: '',
    noIndex: true,
  };
}

function createDefaultTheme(): SitePage['theme'] {
  return {
    backgroundColor: '#ffffff',
    textColor: '#0f172a',
    accentColor: '#0f4f9c',
  };
}

function hydratePage(page: SitePage): SitePage {
  return {
    ...page,
    seo: page.seo || createDefaultSeo({ title: page.title, description: page.description || '' }),
    theme: page.theme || createDefaultTheme(),
    slots: Array.isArray(page.slots)
      ? page.slots.map((slot) => ({
          ...slot,
          blocks: Array.isArray(slot.blocks)
            ? slot.blocks.map((block) => ({
                ...block,
                style: block.style || {},
              }))
            : [],
        }))
      : [],
  };
}

function toPageRecord(page: SitePage): SitePageRecord {
  const { slots: _slots, ...record } = page;
  return record;
}

function getPageDocumentPath(pageId: string): string {
  return path.join(PAGES_DIR, `${pageId}.json`);
}

function readJsonFile<T>(filePath: string): T | null {
  if (!fs.existsSync(filePath)) return null;
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJsonAtomic(filePath: string, value: unknown): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const payload = JSON.stringify(value, null, 2);
  const tmpPath = `${filePath}.tmp-${process.pid}-${Date.now()}`;
  fs.writeFileSync(tmpPath, payload, 'utf-8');
  fs.renameSync(tmpPath, filePath);
}

function ensureDataDir(): void {
  fs.mkdirSync(path.dirname(ROUTES_FILE), { recursive: true });
  fs.mkdirSync(PAGES_DIR, { recursive: true });
}

function toRuntimePublishedPage(page: SitePage): RuntimeResolvedPage | null {
  if (page.status !== 'published') return null;
  if (page.deletedAt) return null;
  return {
    id: page.id,
    title: page.title,
    slug: page.slug,
    description: page.description,
    status: page.status,
    layoutPreset: page.layoutPreset,
    slots: page.slots,
    seo: page.seo,
    theme: page.theme,
  };
}

function syncPublishedRuntimeSnapshot(pages: SitePage[]): void {
  const publishedPages = pages
    .map((page) => toRuntimePublishedPage(page))
    .filter((page): page is RuntimeResolvedPage => Boolean(page));
  publishRuntimePages(publishedPages);
}

function createBlock(type: SiteBlockType): SiteBlock {
  const id = `blk-${randomToken(4)}`;
  if (type === 'hero') {
    return {
      id,
      type,
      enabled: true,
      data: {
        title: 'Título Hero',
        subtitle: 'Subtítulo de apoio para a seção principal.',
      },
    };
  }

  if (type === 'rich_text') {
    return {
      id,
      type,
      enabled: true,
      data: {
        content: 'Bloco de texto editável com conteúdo institucional.',
      },
    };
  }

  if (type === 'cta') {
    return {
      id,
      type,
      enabled: true,
      data: {
        label: 'Saiba mais',
        href: '/e-commerce',
      },
    };
  }

  if (type === 'banner') {
    return {
      id,
      type,
      enabled: true,
      data: {
        title: 'Banner promocional',
        imageUrl: '/images/image-banner.webp',
      },
    };
  }

  if (type === 'product_card') {
    return {
      id,
      type,
      enabled: true,
      data: {
        skuRef: 'SKU-EXEMPLO-001',
        title: 'Produto em destaque',
        price: 19.9,
      },
    };
  }

  return {
    id,
    type,
    enabled: true,
    data: {
      title: 'Vitrine de produtos',
      collection: 'ofertas',
    },
  };
}

export function createSlotsForPreset(preset: SiteLayoutPreset): SitePageSlot[] {
  const count =
    preset === 'single_block'
      ? 1
      : preset === 'tic_tac_toe'
      ? 9
      : preset === 'four_quadrants'
        ? 4
        : preset === 'three_horizontal'
          ? 3
          : 3;

  return Array.from({ length: count }).map((_, index) => ({
    id: `slot-${index + 1}`,
    label: `Área ${index + 1}`,
    blocks: [],
  }));
}

function seedSlots(): SitePageSlot[] {
  const slots = createSlotsForPreset('three_vertical');
  slots[0].blocks.push(createBlock('hero'));
  slots[1].blocks.push(createBlock('rich_text'));
  slots[2].blocks.push(createBlock('cta'));
  return slots;
}

function createStarterSlotsForSlug(slug: string): { layoutPreset: SiteLayoutPreset; slots: SitePageSlot[] } {
  const namespace = resolveSiteRouteNamespaceBySlug(slug);
  const slots = createSlotsForPreset(namespace.layoutPreset);

  namespace.starterPlan.forEach((plan, slotIndex) => {
    const slot = slots[slotIndex];
    if (!slot) return;
    slot.blocks.push(...plan.map((blockType) => createBlock(blockType)));
  });

  return {
    layoutPreset: namespace.layoutPreset,
    slots,
  };
}

function readSitePageSlots(pageId: string, layoutPreset: SiteLayoutPreset): SitePageSlot[] {
  const document = readJsonFile<PersistedSitePageDocument>(getPageDocumentPath(pageId));
  if (!document?.pageId || document.pageId !== pageId || !Array.isArray(document.slots)) {
    return createSlotsForPreset(layoutPreset);
  }

  return document.slots;
}

function saveDb(): void {
  const db = getDb();
  ensureDataDir();
  const pages = Array.from(db.pages.values());

  const registry: PersistedSiteRouteRegistry = {
    routes: pages.map((page) => toPageRecord(page)),
  };
  writeJsonAtomic(ROUTES_FILE, registry);
  writeJsonAtomic(LEGACY_DATA_FILE, { pages });

  for (const page of pages) {
    const document: PersistedSitePageDocument = {
      pageId: page.id,
      slots: page.slots,
    };
    writeJsonAtomic(getPageDocumentPath(page.id), document);
  }

  syncPublishedRuntimeSnapshot(pages);
}

function loadFromSplitFiles(db: SiteBuilderDb): boolean {
  const registry = readJsonFile<PersistedSiteRouteRegistry>(ROUTES_FILE);
  if (!registry?.routes) return false;

  db.pages.clear();
  for (const route of registry.routes) {
    const hydrated = hydratePage({
      ...route,
      slots: readSitePageSlots(route.id, route.layoutPreset),
    } as SitePage);
    db.pages.set(hydrated.id, hydrated);
  }

  db.seeded = db.pages.size > 0;
  syncPublishedRuntimeSnapshot(Array.from(db.pages.values()));
  return true;
}

function loadFromLegacyFile(db: SiteBuilderDb): boolean {
  const legacy = readJsonFile<PersistedSiteBuilder>(LEGACY_DATA_FILE);
  if (!legacy?.pages) return false;

  db.pages.clear();
  for (const page of legacy.pages) {
    const hydrated = hydratePage(page);
    db.pages.set(hydrated.id, hydrated);
  }

  db.seeded = db.pages.size > 0;
  saveDb();
  return true;
}

function loadDb(): void {
  const db = getDb();
  if (db.loaded) return;

  db.loaded = true;
  if (loadFromSplitFiles(db)) return;
  if (loadFromLegacyFile(db)) return;

  db.pages.clear();
  db.seeded = false;
}

function purgeExpiredTrash(): boolean {
  const db = getDb();
  const now = Date.now();
  let changed = false;
  for (const [id, page] of db.pages.entries()) {
    if (!page.deleteExpiresAt) continue;
    if (now >= new Date(page.deleteExpiresAt).getTime()) {
      db.pages.delete(id);
      changed = true;
    }
  }
  return changed;
}

export function ensureSeededSiteBuilder(): void {
  loadDb();
  if (purgeExpiredTrash()) {
    saveDb();
  }
  const db = getDb();
  if (db.seeded) return;

  const now = nowIso();
  const page: SitePage = {
    id: 'page-quem-somos',
    title: 'Quem Somos',
    slug: 'quem-somos',
    description: 'Página institucional criada via painel administrativo.',
    seo: createDefaultSeo({
      title: 'Quem Somos',
      description: 'Página institucional criada via painel administrativo.',
    }),
    theme: createDefaultTheme(),
    status: 'draft',
    layoutPreset: 'three_vertical',
    slots: seedSlots(),
    createdAt: now,
    updatedAt: now,
  };

  db.pages.set(page.id, page);
  db.seeded = true;
  saveDb();
}

function isTrashed(page: SitePage): boolean {
  return Boolean(page.deletedAt);
}

export function listSitePages(): SitePage[] {
  ensureSeededSiteBuilder();
  const db = getDb();
  return Array.from(db.pages.values())
    .filter((page) => !isTrashed(page))
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export function listTrashedSitePages(): SitePage[] {
  ensureSeededSiteBuilder();
  const db = getDb();
  return Array.from(db.pages.values())
    .filter((page) => isTrashed(page))
    .sort((a, b) => (a.deletedAt || '') < (b.deletedAt || '') ? 1 : -1);
}

export function getSitePageById(pageId: string): SitePage | null {
  ensureSeededSiteBuilder();
  const page = getDb().pages.get(pageId) || null;
  if (!page || isTrashed(page)) return null;
  return page;
}

export function getSitePageBySlug(slug: string): SitePage | null {
  ensureSeededSiteBuilder();
  for (const page of getDb().pages.values()) {
    if (isTrashed(page)) continue;
    if (page.slug === slug) return page;
  }
  return null;
}

export function getPublishedSitePageBySlug(slug: string): SitePage | null {
  const page = getSitePageBySlug(slug);
  if (!page) return null;
  if (page.status !== 'published') return null;
  return page;
}

export function normalizeSlug(raw: string): string {
  return normalizeStorefrontRoutePathCandidate(raw);
}

export function isValidSlug(slug: string): boolean {
  return VALID_PAGE_SLUG.test(slug);
}

export function createSitePage(input: { title: string; slug: string; description?: string }): SitePage {
  const db = getDb();
  const now = nowIso();
  const description = input.description?.trim() || '';
  const normalizedSlug = normalizeSlug(input.slug);
  const starter = createStarterSlotsForSlug(normalizedSlug);
  const page: SitePage = {
    id: `page-${randomToken(6)}`,
    title: input.title.trim(),
    slug: normalizedSlug,
    description,
    seo: createDefaultSeo({
      title: input.title.trim(),
      description,
    }),
    theme: createDefaultTheme(),
    status: 'draft',
    layoutPreset: starter.layoutPreset,
    slots: starter.slots,
    createdAt: now,
    updatedAt: now,
  };

  db.pages.set(page.id, page);
  saveDb();
  return page;
}

export function updateSitePage(
  pageId: string,
  input: {
    title: string;
    slug: string;
    description: string;
    layoutPreset: SiteLayoutPreset;
    slots: SitePageSlot[];
    seo?: SitePage['seo'];
    theme?: SitePage['theme'];
  },
): SitePage | null {
  const db = getDb();
  const current = db.pages.get(pageId);
  if (!current || isTrashed(current)) return null;

  const next: SitePage = {
    ...current,
    title: input.title.trim(),
    slug: normalizeSlug(input.slug),
    description: input.description.trim(),
    seo: input.seo || current.seo || createDefaultSeo({ title: input.title.trim(), description: input.description.trim() }),
    theme: input.theme || current.theme || createDefaultTheme(),
    layoutPreset: input.layoutPreset,
    slots: input.slots,
    updatedAt: nowIso(),
  };

  db.pages.set(pageId, next);
  saveDb();
  return next;
}

export function setSitePageStatus(pageId: string, status: SitePageStatus): SitePage | null {
  const db = getDb();
  const current = db.pages.get(pageId);
  if (!current || isTrashed(current)) return null;

  const next: SitePage = {
    ...current,
    status,
    updatedAt: nowIso(),
    publishedAt: status === 'published' ? nowIso() : current.publishedAt,
  };

  db.pages.set(pageId, next);
  saveDb();
  return next;
}

export function softDeleteSitePage(pageId: string): SitePage | null {
  const db = getDb();
  const current = db.pages.get(pageId);
  if (!current || isTrashed(current)) return null;

  const deletedAt = nowIso();
  const next: SitePage = {
    ...current,
    status: 'archived',
    deletedAt,
    deleteExpiresAt: new Date(Date.now() + TRASH_RETENTION_MS).toISOString(),
    updatedAt: deletedAt,
  };

  db.pages.set(pageId, next);
  saveDb();
  return next;
}

export function restoreSitePage(pageId: string): SitePage | null {
  const db = getDb();
  const current = db.pages.get(pageId);
  if (!current || !isTrashed(current)) return null;

  const next: SitePage = {
    ...current,
    status: 'draft',
    deletedAt: undefined,
    deleteExpiresAt: undefined,
    updatedAt: nowIso(),
  };

  db.pages.set(pageId, next);
  saveDb();
  return next;
}
