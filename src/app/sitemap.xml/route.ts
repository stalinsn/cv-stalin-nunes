import { NextResponse } from 'next/server';

export async function GET() {
  // Rotas estáticas e dinâmicas do seu site
  const dynamicRoutes = [
    '', // homepage
    'projetos/vtex-io',
    'projetos/fast-store',
    // Adicione mais rotas conforme necessário
  ];

  const urls = dynamicRoutes.map(
    (route) => `
      <url>
        <loc>https://www.artmeta.com.br/${route}</loc>
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
