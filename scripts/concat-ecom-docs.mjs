#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const baseDir = path.resolve('src/features/ecommerce/docs');
const ordered = [
  'README.md',
  'overview.md',
  'structure.md',
  'operation.md',
  'implementation/README.md',
  'implementation/components.md',
  'implementation/styles.md',
  'implementation/state-cart.md',
  'implementation/feature-flags.md',
  'implementation/data.md',
  'reference/README.md',
  'reference/routes.md',
  'reference/env.md',
  'reference/style-tokens.md',
  'recipes/README.md',
  'recipes/add-shelf.md',
  'recipes/new-product-card.md',
  'recipes/integrate-catalog-service.md',
  'troubleshooting.md',
  'roadmap.md',
  'checklists.md',
];

const outArgIndex = process.argv.findIndex((a) => a === '--out');
const outPathArg = outArgIndex > -1 ? process.argv[outArgIndex + 1] : null;
const outPath = path.resolve(outPathArg || path.join(baseDir, 'ALL.md'));

function readIfExists(p) {
  try {
    return fs.readFileSync(p, 'utf8');
  } catch {
    return null;
  }
}

function ensureDir(p) {
  const dir = path.dirname(p);
  fs.mkdirSync(dir, { recursive: true });
}

function main() {
  if (!fs.existsSync(baseDir)) {
    console.error(`[concat-ecom-docs] Diretório não encontrado: ${baseDir}`);
    process.exit(1);
  }

  const parts = [];
  const now = new Date();
  const header = `# E-commerce — Documentação Consolidada\n\nGerado em ${now.toISOString()}\n\n> Origem: src/features/ecommerce/docs (estrutura modular mantida).\n> Links relativos podem apontar para os arquivos originais.\n`;
  parts.push(header);

  for (const rel of ordered) {
    const abs = path.join(baseDir, rel);
    const content = readIfExists(abs);
    if (!content) {
      console.warn(`[concat-ecom-docs] Ignorando (não encontrado): ${rel}`);
      continue;
    }
    const sep = `\n\n---\n\n<!-- Begin: ${rel} -->\n`;
    parts.push(sep);
    parts.push(content.trim());
    parts.push(`\n<!-- End: ${rel} -->\n`);
  }

  const finalStr = parts.join('\n');
  ensureDir(outPath);
  fs.writeFileSync(outPath, finalStr, 'utf8');
  console.log(`[concat-ecom-docs] Arquivo gerado em: ${outPath}`);
}

main();
