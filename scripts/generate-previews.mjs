/*
  Generate JPG previews for app cards using Playwright (Chromium).
  - Captures /cv, /motd, /e-commerce and saves under public/previews
  Usage:
    yarn previews:install
    # in another terminal: yarn dev
    yarn previews:gen
*/
import path from 'path';
import fs from 'fs';
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CLI flags (cross-platform) with env fallbacks
const argv = process.argv.slice(2);
const arg = (name, def) => {
  const hit = argv.find(a => a.startsWith(`--${name}=`));
  return hit ? hit.split('=')[1] : def;
};

const BASE = arg('base', process.env.PREVIEW_BASE_URL || 'http://localhost:3000');
const OUT_DIR = path.resolve(__dirname, '..', 'public', 'previews');
const ONLY = (arg('only', process.env.PREVIEW_ONLY || '') || '').split(',').map(s => s.trim()).filter(Boolean);
const WIDTH = Number(arg('width', process.env.PREVIEW_WIDTH || 1280));
const HEIGHT = Number(arg('height', process.env.PREVIEW_HEIGHT || 800));
const QUALITY = Number(arg('quality', process.env.PREVIEW_QUALITY || 80));
const DELAY = Number(arg('delay', process.env.PREVIEW_DELAY_MS || 900));
const SCALE = Number(arg('scale', process.env.PREVIEW_SCALE || 1));

const targets = [
  { slug: 'cv', path: '/cv' },
  { slug: 'motd', path: '/motd' },
  { slug: 'ecommerce', path: '/e-commerce' },
];

function ensureOut() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function run() {
  ensureOut();
  const browser = await chromium.launch();
  try {
  const ctx = await browser.newContext({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: SCALE || 1 });
    const page = await ctx.newPage();

    const list = ONLY.length ? targets.filter(t => ONLY.includes(t.slug)) : targets;
    if (list.length === 0) {
      console.log('No targets to capture. Set PREVIEW_ONLY to a valid slug or unset to capture all.');
      return;
    }

    for (const t of list) {
      const url = BASE + t.path;
      console.log('Capturing', url);
  await page.goto(url, { waitUntil: 'networkidle' });
  // wait for fonts if supported
  try { await page.evaluate(() => document.fonts && document.fonts.ready); } catch {}
      // small settle delay for animations and client effects
      await page.waitForTimeout(DELAY);
      const file = path.join(OUT_DIR, `${t.slug}.jpg`);
      await page.screenshot({ path: file, type: 'jpeg', quality: QUALITY, fullPage: false });
      console.log('Saved:', file);
    }
  } finally {
    await browser.close();
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
