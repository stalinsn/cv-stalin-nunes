import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'https://www.artmeta.com.br').replace(/\/+$/, '');
  const dynamicRoutes = ['', 'cv'];

  const urls = dynamicRoutes.map(
    (route) => `
      <url>
  <loc>${baseUrl}/${route}</loc>
        <priority>${route === '' ? '1.0' : '0.8'}</priority>
      </url>`
  ).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls}
  </urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
