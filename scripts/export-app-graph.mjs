#!/usr/bin/env node
/* eslint-disable no-console */
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const APPS = {
  cv: 'src/app/cv',
  motd: 'src/app/motd',
  ecommerce: 'src/app/e-commerce',
};

function parseArgs() {
  const args = Object.fromEntries(
    process.argv.slice(2).map((a) => {
      const [k, v = true] = a.replace(/^--/, '').split('=');
      return [k, v === 'false' ? false : v];
    }),
  );
  
  // Handle --all flag
  if (args.all) {
    return {
      app: 'all',
      outDir: path.resolve(root, String(args.out || 'exports')),
      doZip: Boolean(args.zip ?? true), // Default to zip when using --all
      doInstall: Boolean(args.install ?? false),
      dryRun: Boolean(args['dry-run'] ?? args.dryRun ?? false),
    };
  }
  
  if (!args.app || !(args.app in APPS)) {
    console.error('Use: node scripts/export-app-graph.mjs --app=cv|motd|ecommerce|--all [--out=exports] [--zip] [--install] [--dry-run]');
    process.exit(1);
  }
  return {
    app: String(args.app),
    outDir: path.resolve(root, String(args.out || 'exports')),
    doZip: Boolean(args.zip ?? false),
    doInstall: Boolean(args.install ?? false),
    dryRun: Boolean(args['dry-run'] ?? args.dryRun ?? false),
  };
}

async function ensureDir(p) {
  await fsp.mkdir(p, { recursive: true });
}

async function copyFile(src, dest) {
  await ensureDir(path.dirname(dest));
  await fsp.copyFile(src, dest);
}

function readJSON(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

/**
 * Recursively collect CSS imports from a CSS file
 */
async function collectCSSImports(cssFile, collected = new Set()) {
  if (collected.has(cssFile) || !fs.existsSync(cssFile)) return [];
  
  collected.add(cssFile);
  const imports = [cssFile];
  
  try {
    const content = await fsp.readFile(cssFile, 'utf-8');
    const importRegex = /@import\s+["']([^"']+)["'];?/g;
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];
      let resolvedPath;
      
      if (importPath.startsWith('./') || importPath.startsWith('../')) {
        // Relative import
        resolvedPath = path.resolve(path.dirname(cssFile), importPath);
      } else {
        // Absolute import from src/styles
        resolvedPath = path.resolve('src/styles', importPath);
      }
      
      // Add .css extension if missing
      if (!resolvedPath.endsWith('.css')) {
        resolvedPath += '.css';
      }
      
      if (fs.existsSync(resolvedPath)) {
        const subImports = await collectCSSImports(resolvedPath, collected);
        imports.push(...subImports);
      }
    }
  } catch (err) {
    // Ignore read errors
  }
  
  return imports;
}

function relativeToRoot(p) {
  return path.relative(root, p).split(path.sep).join('/');
}

async function collectFiles(appKey) {
  const appDir = path.join(root, APPS[appKey]);
  const allFiles = new Set();
  
  // 1) Collect all files in app directory
  async function walkDir(dir) {
    const entries = await fsp.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walkDir(fullPath);
      } else if (entry.isFile() && /\.(ts|tsx|js|jsx|css|json)$/.test(entry.name)) {
        allFiles.add(fullPath);
      }
    }
  }
  
  await walkDir(appDir);
  
  // 2) Add features directory specific to app
  const featuresMap = {
    cv: 'src/features/cv',
    motd: 'src/features/motd', 
    ecommerce: 'src/features/ecommerce'
  };
  
  const featDir = path.join(root, featuresMap[appKey] || `src/features/${appKey}`);
  if (fs.existsSync(featDir)) {
    await walkDir(featDir);
  }
  
  // 3) Scan for imports and add referenced files
  const importPattern = /(?:import|from)\s+['"`](@\/[^'"`]+|\.\.?\/[^'"`]+)['"`]/g;
  
  async function scanImports(filePath) {
    try {
      const content = await fsp.readFile(filePath, 'utf8');
      const matches = content.matchAll(importPattern);
      
      for (const match of matches) {
        let importPath = match[1];
        
        // Resolve @ imports
        if (importPath.startsWith('@/')) {
          importPath = importPath.replace('@/', 'src/');
        }
        
        // Resolve relative imports
        if (importPath.startsWith('./') || importPath.startsWith('../')) {
          importPath = path.resolve(path.dirname(filePath), importPath);
        } else {
          importPath = path.join(root, importPath);
        }
        
        // Try different extensions
        const extensions = ['', '.ts', '.tsx', '.js', '.jsx', '.css', '.json'];
        for (const ext of extensions) {
          const fullPath = importPath + ext;
          if (fs.existsSync(fullPath) && fs.lstatSync(fullPath).isFile()) {
            if (!allFiles.has(fullPath)) {
              allFiles.add(fullPath);
              await scanImports(fullPath); // Recursive scan
            }
            break;
          }
          
          // Try index files
          const indexPath = path.join(importPath, 'index' + ext);
          if (fs.existsSync(indexPath) && fs.lstatSync(indexPath).isFile()) {
            if (!allFiles.has(indexPath)) {
              allFiles.add(indexPath);
              await scanImports(indexPath);
            }
            break;
          }
        }
      }
    } catch (err) {
      // Skip files that can't be read
    }
  }
  
  // Scan all collected files for imports
  const filesToScan = Array.from(allFiles);
  for (const file of filesToScan) {
    await scanImports(file);
  }

  // 4) Scan CSS files for @import statements
  const cssFiles = Array.from(allFiles).filter(f => f.endsWith('.css'));
  for (const cssFile of cssFiles) {
    const cssImports = await collectCSSImports(cssFile);
    for (const importedCss of cssImports) {
      if (!allFiles.has(importedCss)) {
        allFiles.add(importedCss);
      }
    }
  }

  return Array.from(allFiles);
}async function writeScaffold(destDir, appKey, usedFiles) {
  // package.json
  const srcPkg = readJSON(path.join(root, 'package.json'));
  const pick = (obj, keys) => Object.fromEntries(keys.filter((k) => obj?.[k]).map((k) => [k, obj[k]]));
  
  const coreDeps = pick(srcPkg.dependencies || {}, ['next', 'react', 'react-dom', 'googleapis', 'openai']);
  const devPick = pick(srcPkg.devDependencies || {}, [
    'typescript',
    '@types/react',
    '@types/node',
    '@types/react-dom',
    'postcss-import',
    'postcss-nested',
    '@tailwindcss/postcss',
    'prettier',
    'eslint',
    'eslint-config-next',
  ]);

  const pkg = {
    name: `@export/${appKey}`,
    private: true,
    version: '0.0.0',
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint',
    },
    dependencies: coreDeps,
    devDependencies: devPick,
  };
  
  await ensureDir(destDir);
  await fsp.writeFile(path.join(destDir, 'package.json'), JSON.stringify(pkg, null, 2));

  // Copy config files
  const configFiles = ['next.config.ts', 'tsconfig.json', 'postcss.config.mjs', 'next-env.d.ts', 'eslint.config.mjs'];
  for (const file of configFiles) {
    const srcPath = path.join(root, file);
    if (fs.existsSync(srcPath)) {
      await copyFile(srcPath, path.join(destDir, file));
    }
  }

  // Create basic layout if app doesn't have one
  const appLayoutPath = path.join(destDir, 'src', 'app', 'layout.tsx');
  if (!fs.existsSync(appLayoutPath)) {
    const layoutContent = `export const metadata = { title: '${appKey.toUpperCase()}' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body>{children}</body>
    </html>
  );
}
`;
    await ensureDir(path.dirname(appLayoutPath));
    await fsp.writeFile(appLayoutPath, layoutContent);
  }

  // Create root page that re-exports app page
  const appRoute = APPS[appKey].replace('src/app/', '');
  const rootPageContent = `export { default } from './${appRoute}/page';
`;
  await fsp.writeFile(path.join(destDir, 'src', 'app', 'page.tsx'), rootPageContent);

  // For apps that need their layout as root layout (like ecommerce with providers)
  if (appKey === 'ecommerce') {
    const appLayoutContent = `import { EcomProviders } from './e-commerce/providers';
import '../styles/globals.css';
import React from 'react';

export const metadata = { title: 'E-commerce' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body>
        <EcomProviders>
          {children}
        </EcomProviders>
      </body>
    </html>
  );
}
`;
    await fsp.writeFile(path.join(destDir, 'src', 'app', 'layout.tsx'), appLayoutContent);
  } else {
    // For CV and MOTD apps - create root layout that includes global styles
    const appLayoutContent = `import '@/styles/globals.css';

export const metadata = { title: '${appKey.toUpperCase()}' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body>{children}</body>
    </html>
  );
}
`;
    await fsp.writeFile(path.join(destDir, 'src', 'app', 'layout.tsx'), appLayoutContent);
  }

  // README
  const readme = `# ${appKey.toUpperCase()} (Standalone)

Esta pasta contém uma extração do app \`${appKey}\` como projeto Next.js independente.

## Como rodar

1) Instale dependências:
\`\`\`bash
yarn install
\`\`\`

2) Inicie o servidor:
\`\`\`bash
yarn dev
\`\`\`

Rota principal: /
Rota original: /${appRoute}
`;
  await fsp.writeFile(path.join(destDir, 'README.md'), readme);

  // Copy used files
  for (const abs of usedFiles) {
    const rel = relativeToRoot(abs);
    // Only copy files under src/ or public/
    if (!/^src\//.test(rel) && !/^public\//.test(rel)) continue;
    // Skip preview images
    if (rel.startsWith('public/previews/')) continue;
    
    await copyFile(abs, path.join(destDir, rel));
  }

  // Copy public directory basics
  const publicSrc = path.join(root, 'public');
  if (fs.existsSync(publicSrc)) {
    const publicFiles = await fsp.readdir(publicSrc);
    for (const file of publicFiles) {
      if (file !== 'previews') {
        const srcPath = path.join(publicSrc, file);
        const destPath = path.join(destDir, 'public', file);
        if (fs.lstatSync(srcPath).isFile()) {
          await ensureDir(path.dirname(destPath));
          await copyFile(srcPath, destPath);
        }
      }
    }
  }

  // Copy all essential styles directories and root CSS files
  const stylesDirs = [
    'src/styles/tokens',
    'src/styles/components',
    'src/styles/ecommerce'
  ];
  
  // First, copy CSS files directly in src/styles/
  const rootStylesDir = path.join(root, 'src/styles');
  if (fs.existsSync(rootStylesDir)) {
    const entries = await fsp.readdir(rootStylesDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.css')) {
        const srcFile = path.join(rootStylesDir, entry.name);
        const destFile = path.join(destDir, 'src/styles', entry.name);
        await copyFile(srcFile, destFile);
      }
    }
  }
  
  // Then copy subdirectories
  for (const stylesDir of stylesDirs) {
    const srcDir = path.join(root, stylesDir);
    if (fs.existsSync(srcDir)) {
      async function copyStylesDir(srcPath, destPath) {
        await ensureDir(destPath);
        const entries = await fsp.readdir(srcPath, { withFileTypes: true });
        for (const entry of entries) {
          const srcEntry = path.join(srcPath, entry.name);
          const destEntry = path.join(destPath, entry.name);
          if (entry.isDirectory()) {
            await copyStylesDir(srcEntry, destEntry);
          } else if (entry.name.endsWith('.css')) {
            await copyFile(srcEntry, destEntry);
          }
        }
      }
      
      await copyStylesDir(srcDir, path.join(destDir, stylesDir));
    }
  }

  // Create .env.example from root .env files
  const rootEnvFiles = (await fsp.readdir(root)).filter(f => f.startsWith('.env'));
  let envExampleContent = '';
  for (const file of rootEnvFiles) {
    const content = await fsp.readFile(path.join(root, file), 'utf-8');
    const lines = content.split('\n');
    for (const line of lines) {
      if (line.includes('=')) {
        const key = line.split('=')[0];
        if (key && !key.startsWith('#')) {
          envExampleContent += `${key}=\n`;
        }
      }
    }
  }
  if (envExampleContent) {
    await fsp.writeFile(path.join(destDir, '.env.example'), envExampleContent);
  }
}

async function main() {
  const { app, outDir, doZip, doInstall, dryRun } = parseArgs();

  // Handle --all flag
  if (app === 'all') {
    console.log('Exporting all applications...');
    
    // Clean all old exports first
    console.log('Cleaning old exports...');
    const apps = Object.keys(APPS);
    for (const appKey of apps) {
      const dest = path.join(outDir, appKey);
      const zipPath = `${dest}.zip`;
      await fsp.rm(dest, { recursive: true, force: true }).catch(() => {});
      await fsp.rm(zipPath, { force: true }).catch(() => {});
    }
    
    for (const appKey of apps) {
      console.log(`\n--- Exporting ${appKey} ---`);
      await exportSingleApp(appKey, outDir, doZip, doInstall, dryRun);
    }
    
    console.log('\n✅ All applications exported successfully!');
    if (doZip) {
      console.log('\n📦 ZIP files created:');
      for (const appKey of apps) {
        console.log(`  - ${path.join(outDir, appKey)}.zip`);
      }
    }
    return;
  }

  // Export single app
  await exportSingleApp(app, outDir, doZip, doInstall, dryRun);
}

async function exportSingleApp(app, outDir, doZip, doInstall, dryRun) {
  console.log(`Analyzing ${app}...`);
  
  // Always clean old files first
  const dest = path.join(outDir, app);
  const zipPath = `${dest}.zip`;
  
  // Remove old directory and zip file
  await fsp.rm(dest, { recursive: true, force: true }).catch(() => {});
  await fsp.rm(zipPath, { force: true }).catch(() => {});
  
  // Collect all files used by the app
  const usedFiles = await collectFiles(app);
  
  if (dryRun) {
    console.log(`Files that would be copied for ${app} (${usedFiles.length}):`);
    const rels = usedFiles.map(relativeToRoot).sort();
    for (const rel of rels) {
      console.log(' -', rel);
    }
    return;
  }

  // Create export
  await ensureDir(dest);
  
  await writeScaffold(dest, app, usedFiles);
  
  console.log(`Export complete: ${dest}`);
  console.log(`Files copied: ${usedFiles.length}`);

  // Install dependencies
  if (doInstall) {
    console.log('Installing dependencies...');
    try {
      await execAsync('yarn install', { cwd: dest });
      console.log('Dependencies installed successfully');
    } catch (err) {
      console.warn('Failed to install dependencies:', err.message);
    }
  }

  // Create ZIP if requested
  if (doZip) {
    try {
      const zipPath = `${dest}.zip`;
      
      if (process.platform === 'win32') {
        // Windows using PowerShell
        await execAsync(`powershell -NoProfile -Command "Compress-Archive -Path '${dest}\\*' -DestinationPath '${zipPath}' -Force"`);
      } else {
        // Unix-like systems using zip command
        await execAsync(`cd "${path.dirname(dest)}" && zip -r "${path.basename(zipPath)}" "${path.basename(dest)}"`);
      }
      
      console.log(`ZIP created: ${zipPath}`);
      
      // Remove the original directory after creating ZIP
      await fsp.rm(dest, { recursive: true, force: true });
      console.log(`Directory removed: ${dest}`);
      
    } catch (err) {
      console.warn('Failed to create ZIP:', err.message);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
