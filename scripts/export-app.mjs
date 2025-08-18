#!/usr/bin/env node
/*
 Export a standalone Next.js project for a given app (cv|motd|ecommerce).
 - Copies minimal skeleton (package.json, next.config.ts, tsconfig, public, src)
 - Copies route folder under src/app/<routeDir>
 - Creates src/app/page.tsx that re-exports the app's page component
 - Copies shared folders that app components may import (components, styles, data, lib, types, utils, constants)
 - Optional --zip to compress the export using PowerShell Compress-Archive on Windows

 Usage:
   node scripts/export-app.mjs --app=cv --out=exports --zip
*/
import fsp from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const argv = process.argv.slice(2);
const getArg = (name, def) => {
  const hit = argv.find(a => a.startsWith(`--${name}=`));
  return hit ? hit.split('=')[1] : def;
};
const hasFlag = (name) => argv.includes(`--${name}`);

const APP = (getArg('app', '') || '').toLowerCase();
const OUT = getArg('out', 'exports');
const DO_ZIP = hasFlag('zip');

const APPS = {
  cv: { routeDir: 'cv', title: 'CV' },
  motd: { routeDir: 'motd', title: 'MOTD' },
  ecommerce: { routeDir: 'e-commerce', title: 'E-commerce' },
};

if (!APPS[APP]) {
  console.error('Missing or invalid --app. Use one of: cv, motd, ecommerce');
  process.exit(1);
}

const cfg = APPS[APP];
const exportRoot = path.resolve(ROOT, OUT);
const outDir = path.join(exportRoot, APP);

async function rimraf(p) {
  await fsp.rm(p, { recursive: true, force: true });
}

async function ensureDir(p) {
  await fsp.mkdir(p, { recursive: true });
}

async function cp(src, dest) {
  // Node >=16 supports fs.cp
  return fsp.cp(src, dest, { recursive: true, force: true });
}

async function writeFile(p, content) {
  await ensureDir(path.dirname(p));
  await fsp.writeFile(p, content, 'utf8');
}

async function exists(p) {
  try { await fsp.access(p); return true; } catch { return false; }
}

async function main() {
  await ensureDir(exportRoot);
  await rimraf(outDir);
  await ensureDir(outDir);

  // 1) Base files (package.json minimal)
  const rootPkg = JSON.parse(await fsp.readFile(path.join(ROOT, 'package.json'), 'utf8'));
  const pkg = {
    name: `standalone-${APP}`,
    private: true,
    version: '0.1.0',
    scripts: { dev: 'next dev', build: 'next build', start: 'next start' },
    dependencies: {
      next: rootPkg.dependencies?.next || '15.3.3',
      react: rootPkg.dependencies?.react || '^19.0.0',
      'react-dom': rootPkg.dependencies?.['react-dom'] || '^19.0.0',
    },
  };
  await writeFile(path.join(outDir, 'package.json'), JSON.stringify(pkg, null, 2));

  // Copy configs if present
  const maybeCopyFiles = [
    'next.config.ts',
    'tsconfig.json',
    'eslint.config.mjs',
    'postcss.config.mjs',
  ];
  for (const rel of maybeCopyFiles) {
    const src = path.join(ROOT, rel);
    if (await exists(src)) {
      await cp(src, path.join(outDir, rel));
    }
  }

  // 2) Public assets (excluding previews)
  const pubSrc = path.join(ROOT, 'public');
  const pubDest = path.join(outDir, 'public');
  if (await exists(pubSrc)) {
    await cp(pubSrc, pubDest);
    const previews = path.join(pubDest, 'previews');
    await rimraf(previews);
  }

  // 3) src/app structure: copy selected route and wrap as root page
  const srcDir = path.join(outDir, 'src');
  const appDir = path.join(srcDir, 'app');
  await ensureDir(appDir);

  const routeSrc = path.join(ROOT, 'src', 'app', cfg.routeDir);
  const routeDest = path.join(appDir, cfg.routeDir);
  if (!(await exists(routeSrc))) {
    console.error(`Route folder not found: ${routeSrc}`);
    process.exit(2);
  }
  await cp(routeSrc, routeDest);

  const layoutContent = `export const metadata = { title: '${cfg.title}' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
`;
  await writeFile(path.join(appDir, 'layout.tsx'), layoutContent);

  // Re-export the app page as root page
  const pageContent = `export { default } from './${cfg.routeDir}/page';
`;
  await writeFile(path.join(appDir, 'page.tsx'), pageContent);

  // 4) Copy shared folders commonly imported via @/
  const shared = ['components', 'styles', 'data', 'lib', 'types', 'utils', 'constants'];
  for (const folder of shared) {
    const src = path.join(ROOT, 'src', folder);
    if (await exists(src)) {
      await cp(src, path.join(srcDir, folder));
    }
  }

  // 5) README for the exported app
  const readme = `# ${cfg.title} (Standalone)\n\nEsta pasta contém uma extração do app \`${cfg.title}\` como projeto Next.js independente.\n\n## Rodar\n\n\`\`\`bash\nyarn install\nyarn dev\n\`\`\`\n\nRota principal: /.\nRota original (ainda disponível): /${cfg.routeDir}\n`;
  await writeFile(path.join(outDir, 'README.md'), readme);

  // 6) Optional ZIP on Windows
  if (DO_ZIP && process.platform === 'win32') {
    const zipPath = path.join(exportRoot, `${APP}.zip`);
    await new Promise((resolve) => {
      exec(`powershell -NoProfile -Command "Compress-Archive -Path '${outDir}/*' -DestinationPath '${zipPath}' -Force"`, (err) => {
        if (err) console.warn('Zip step skipped (PowerShell Compress-Archive not available).');
        else console.log('Created zip:', zipPath);
        resolve();
      });
    });
  }

  console.log('Export complete:', outDir);
}

main().catch((e) => { console.error(e); process.exit(1); });
