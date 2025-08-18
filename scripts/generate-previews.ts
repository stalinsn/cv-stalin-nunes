/*
  Simple preview generator using Playwright.
  - Captures JPG previews for /cv, /motd, /e-commerce
  - Saves to public/previews/<slug>.jpg

  Usage:
    npx playwright install --with-deps
    ts-node scripts/generate-previews.ts
*/
import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const BASE = process.env.PREVIEW_BASE_URL || 'http://localhost:3000';
const OUT_DIR = path.resolve(process.cwd(), 'public', 'previews');

const targets = [
  { slug: 'cv', path: '/cv' },
  { slug: 'motd', path: '/motd' },
  { slug: 'ecommerce', path: '/e-commerce' },
];

async function ensureOut() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function run() {
  await ensureOut();
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();

    for (const t of targets) {
      const url = BASE + t.path;
      console.log('Capturing', url);
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      // give apps time to settle
      await page.waitForTimeout(800);
      const file = path.join(OUT_DIR, `${t.slug}.jpg`);
      await page.screenshot({ path: file, type: 'jpeg', quality: 75, fullPage: false });
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
