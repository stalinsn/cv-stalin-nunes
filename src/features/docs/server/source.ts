import 'server-only';

import fs from 'node:fs';
import path from 'node:path';
import {
  extractLeadParagraph,
  parseFrontmatter,
  parseMarkdownBlocks,
  slugifyFragment,
  stripNumericPrefix,
  type MarkdownBlock,
  type MarkdownFrontmatterValue,
} from './markdown';

export type DocsSectionKey = 'base' | 'guias' | 'slides';

export type DocsHeading = {
  id: string;
  level: number;
  text: string;
};

export type DocsNote = {
  title: string;
  shortTitle: string;
  description: string;
  tags: string[];
  sectionKey: DocsSectionKey;
  sectionLabel: string;
  routePath: string;
  routeSegments: string[];
  sourcePath: string;
  internalKey: string;
  order: number;
  isSectionIndex: boolean;
  blocks: MarkdownBlock[];
  headings: DocsHeading[];
  updatedAt: string;
};

export type DocsGroup = {
  key: DocsSectionKey;
  label: string;
  description: string;
  notes: DocsNote[];
};

type DocsCache = {
  notes: DocsNote[];
  byRoutePath: Map<string, DocsNote>;
  byInternalKey: Map<string, DocsNote>;
  groups: DocsGroup[];
};

const DOCS_ROOT = path.join(process.cwd(), 'docs', 'content');
const SECTION_META: Record<DocsSectionKey, { label: string; description: string }> = {
  base: {
    label: 'Base do projeto',
    description: 'Arquitetura, operação, runbook e visão geral do workspace.',
  },
  guias: {
    label: 'Guias',
    description: 'Guias explicativos com ordem de execução, contexto e trechos reais do código.',
  },
  slides: {
    label: 'Apresentação',
    description: 'Notas mais compactas para roteiro, treinamento e apresentação futura.',
  },
};

let docsCache: DocsCache | null = null;

function walkMarkdownFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const output: string[] = [];

  for (const entry of entries) {
    const absolutePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      output.push(...walkMarkdownFiles(absolutePath));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.md')) {
      output.push(absolutePath);
    }
  }

  return output;
}

function getSectionKey(relativePath: string): DocsSectionKey {
  if (relativePath.startsWith('guias/')) return 'guias';
  if (relativePath.startsWith('slides/')) return 'slides';
  return 'base';
}

function getOrder(relativePath: string): number {
  if (relativePath === '00 - Inicio.md') return -100;
  const baseName = path.basename(relativePath, '.md');
  if (baseName === 'README') return -10;
  const numericMatch = baseName.match(/^(\d+)/);
  if (numericMatch) return Number(numericMatch[1]);
  return 999;
}

function getRouteSegments(relativePath: string): string[] {
  const baseName = path.basename(relativePath, '.md');
  const dirName = path.dirname(relativePath) === '.' ? '' : path.dirname(relativePath);
  const dirSegments = dirName ? dirName.split('/') : [];

  if (relativePath === '00 - Inicio.md') return [];
  if (relativePath === 'README.md') return ['guia'];
  if (baseName === 'README' && dirSegments.length) return dirSegments;

  return [...dirSegments, slugifyFragment(stripNumericPrefix(baseName))];
}

function toRoutePath(routeSegments: string[]): string {
  return routeSegments.length ? `/docs/${routeSegments.join('/')}` : '/docs';
}

function getFallbackTitle(relativePath: string): string {
  const baseName = path.basename(relativePath, '.md');
  if (baseName === 'README') {
    const dirName = path.dirname(relativePath) === '.' ? 'Guia' : path.basename(path.dirname(relativePath));
    return dirName.charAt(0).toUpperCase() + dirName.slice(1);
  }
  return stripNumericPrefix(baseName);
}

function toTags(value: MarkdownFrontmatterValue | undefined): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return [value];
}

function buildNote(absolutePath: string): DocsNote {
  const raw = fs.readFileSync(absolutePath, 'utf-8');
  const relativePath = path.relative(DOCS_ROOT, absolutePath).replace(/\\/g, '/');
  const { frontmatter, body } = parseFrontmatter(raw);
  const blocks = parseMarkdownBlocks(body);
  const firstHeading = blocks.find(
    (block): block is Extract<MarkdownBlock, { type: 'heading' }> => block.type === 'heading' && block.level === 1,
  );
  const title = firstHeading?.text || getFallbackTitle(relativePath);
  const description = extractLeadParagraph(blocks);
  const tags = toTags(frontmatter.tags);
  const sectionKey = getSectionKey(relativePath);
  const routeSegments = getRouteSegments(relativePath);
  const routePath = toRoutePath(routeSegments);
  const sourcePath = `docs/content/${relativePath}`;
  const internalKey = relativePath.replace(/\.md$/, '');
  const stat = fs.statSync(absolutePath);

  return {
    title,
    shortTitle: getFallbackTitle(relativePath),
    description,
    tags,
    sectionKey,
    sectionLabel: SECTION_META[sectionKey].label,
    routePath,
    routeSegments,
    sourcePath,
    internalKey,
    order: getOrder(relativePath),
    isSectionIndex: path.basename(relativePath, '.md') === 'README',
    blocks,
    headings: blocks
      .filter((block): block is Extract<MarkdownBlock, { type: 'heading' }> => block.type === 'heading')
      .map((block) => ({ id: block.id, level: block.level, text: block.text })),
    updatedAt: stat.mtime.toISOString(),
  };
}

function compareNotes(left: DocsNote, right: DocsNote): number {
  if (left.sectionKey !== right.sectionKey) {
    const order = ['base', 'guias', 'slides'];
    return order.indexOf(left.sectionKey) - order.indexOf(right.sectionKey);
  }
  if (left.order !== right.order) return left.order - right.order;
  return left.title.localeCompare(right.title, 'pt-BR');
}

function buildCache(): DocsCache {
  const notes = walkMarkdownFiles(DOCS_ROOT).map(buildNote).sort(compareNotes);
  const byRoutePath = new Map(notes.map((note) => [note.routePath, note]));
  const byInternalKey = new Map(notes.map((note) => [note.internalKey, note]));
  const groups: DocsGroup[] = (['base', 'guias', 'slides'] as DocsSectionKey[]).map((key) => ({
    key,
    label: SECTION_META[key].label,
    description: SECTION_META[key].description,
    notes: notes.filter((note) => note.sectionKey === key),
  }));

  return {
    notes,
    byRoutePath,
    byInternalKey,
    groups,
  };
}

function getCache(): DocsCache {
  if (!docsCache) {
    docsCache = buildCache();
  }
  return docsCache;
}

export function getDocsGroups(): DocsGroup[] {
  return getCache().groups;
}

export function getDocsHomeNote(): DocsNote {
  const note = getCache().byRoutePath.get('/docs');
  if (!note) {
    throw new Error('Docs home note not found.');
  }
  return note;
}

export function getDocsNoteByRoute(routeSegments: string[] = []): DocsNote | null {
  const routePath = toRoutePath(routeSegments);
  return getCache().byRoutePath.get(routePath) || null;
}

export function getAllDocsStaticRoutes(): string[][] {
  return getCache()
    .notes
    .filter((note) => note.routePath !== '/docs')
    .map((note) => note.routeSegments);
}

export function getNeighborNotes(note: DocsNote): {
  previous: DocsNote | null;
  next: DocsNote | null;
} {
  const sectionNotes = getCache().groups.find((group) => group.key === note.sectionKey)?.notes || [];
  const index = sectionNotes.findIndex((candidate) => candidate.routePath === note.routePath);
  return {
    previous: index > 0 ? sectionNotes[index - 1] : null,
    next: index >= 0 && index < sectionNotes.length - 1 ? sectionNotes[index + 1] : null,
  };
}

export function resolveDocsReference(reference: string, currentInternalKey: string): string | null {
  const cache = getCache();
  const [rawTarget] = reference.split('|');
  const target = rawTarget.trim().replace(/\.md$/, '');
  const currentDirectory = path.posix.dirname(currentInternalKey);
  const candidates = new Set<string>();

  if (target.includes('/')) {
    candidates.add(target.replace(/^\/+/, ''));
  } else {
    if (currentDirectory && currentDirectory !== '.') {
      candidates.add(`${currentDirectory}/${target}`);
    }
    candidates.add(target);
  }

  for (const candidate of candidates) {
    const note = cache.byInternalKey.get(candidate);
    if (note) return note.routePath;
  }

  return null;
}
