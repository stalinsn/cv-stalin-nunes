import 'server-only';

import fs from 'node:fs';
import path from 'node:path';

import {
  type StorefrontTemplate,
  createDefaultStorefrontTemplate,
  normalizeStorefrontTemplate,
} from '@/features/site-runtime/storefrontTemplate';
import { publishRuntimeStorefrontTemplate } from '@/features/site-runtime/server/publishedTemplateStore';
import { nowIso } from './crypto';

type StorefrontTemplateDb = {
  template: StorefrontTemplate;
  loaded: boolean;
};

type StorefrontTemplateMetaDocument = Pick<StorefrontTemplate, 'schemaVersion' | 'updatedAt' | 'brandName'>;

const LEGACY_DATA_FILE = path.join(process.cwd(), 'src/data/ecommpanel/storefront-template.json');
const STOREFRONT_DATA_DIR = path.join(process.cwd(), 'src/data/ecommpanel/storefront');
const META_FILE = path.join(STOREFRONT_DATA_DIR, 'meta.json');
const THEME_FILE = path.join(STOREFRONT_DATA_DIR, 'theme.json');
const HEADER_FILE = path.join(STOREFRONT_DATA_DIR, 'header.json');
const HOME_FILE = path.join(STOREFRONT_DATA_DIR, 'home.json');
const FOOTER_FILE = path.join(STOREFRONT_DATA_DIR, 'footer.json');

declare global {
  var __ECOMMPANEL_STOREFRONT_TEMPLATE_DB__: StorefrontTemplateDb | undefined;
}

function getDb(): StorefrontTemplateDb {
  if (!global.__ECOMMPANEL_STOREFRONT_TEMPLATE_DB__) {
    global.__ECOMMPANEL_STOREFRONT_TEMPLATE_DB__ = {
      template: createDefaultStorefrontTemplate(),
      loaded: false,
    };
  }

  return global.__ECOMMPANEL_STOREFRONT_TEMPLATE_DB__;
}

function ensureDataDir(): void {
  fs.mkdirSync(STOREFRONT_DATA_DIR, { recursive: true });
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

function saveDb(): void {
  const db = getDb();
  const normalized = normalizeStorefrontTemplate(db.template);
  ensureDataDir();

  const meta: StorefrontTemplateMetaDocument = {
    schemaVersion: normalized.schemaVersion,
    updatedAt: normalized.updatedAt,
    brandName: normalized.brandName,
  };

  writeJsonAtomic(META_FILE, meta);
  writeJsonAtomic(THEME_FILE, normalized.theme);
  writeJsonAtomic(HEADER_FILE, normalized.header);
  writeJsonAtomic(HOME_FILE, normalized.home);
  writeJsonAtomic(FOOTER_FILE, normalized.footer);
  writeJsonAtomic(LEGACY_DATA_FILE, normalized);

  publishRuntimeStorefrontTemplate(normalized);
}

function loadFromSplitFiles(): StorefrontTemplate | null {
  const fallback = createDefaultStorefrontTemplate();
  const meta = readJsonFile<Partial<StorefrontTemplateMetaDocument>>(META_FILE);
  const theme = readJsonFile<StorefrontTemplate['theme']>(THEME_FILE);
  const header = readJsonFile<StorefrontTemplate['header']>(HEADER_FILE);
  const home = readJsonFile<StorefrontTemplate['home']>(HOME_FILE);
  const footer = readJsonFile<StorefrontTemplate['footer']>(FOOTER_FILE);

  if (!meta && !theme && !header && !home && !footer) {
    return null;
  }

  return normalizeStorefrontTemplate({
    ...fallback,
    schemaVersion: meta?.schemaVersion || fallback.schemaVersion,
    updatedAt: meta?.updatedAt || fallback.updatedAt,
    brandName: meta?.brandName || fallback.brandName,
    theme: theme || fallback.theme,
    header: header || fallback.header,
    home: home || fallback.home,
    footer: footer || fallback.footer,
  });
}

function loadFromLegacyFile(): StorefrontTemplate | null {
  const legacy = readJsonFile<unknown>(LEGACY_DATA_FILE);
  if (!legacy) return null;
  return normalizeStorefrontTemplate(legacy);
}

function loadDb(): void {
  const db = getDb();
  if (db.loaded) return;

  db.loaded = true;
  db.template = loadFromSplitFiles() || loadFromLegacyFile() || createDefaultStorefrontTemplate();
  saveDb();
}

export function getStorefrontTemplate(): StorefrontTemplate {
  loadDb();
  return normalizeStorefrontTemplate(getDb().template);
}

export function updateStorefrontTemplate(input: unknown): StorefrontTemplate {
  loadDb();
  const db = getDb();
  const normalized = normalizeStorefrontTemplate(input);
  db.template = {
    ...normalized,
    updatedAt: nowIso(),
  };
  saveDb();
  return normalizeStorefrontTemplate(db.template);
}
