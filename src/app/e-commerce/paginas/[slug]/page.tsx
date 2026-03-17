import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CmsPageRenderer from '@/features/ecommerce/components/cms/CmsPageRenderer';
import { resolveStorefrontPath } from '@/features/ecommerce/server/routeResolver';

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const resolved = resolveStorefrontPath(`/${slug}`);

  if (resolved.source !== 'dynamic' || !resolved.page) {
    return {
      title: 'Página não encontrada',
      robots: { index: false, follow: false },
    };
  }

  return {
    title: resolved.page.seo?.title || resolved.page.title,
    description: resolved.page.seo?.description || resolved.page.description,
    keywords: resolved.page.seo?.keywords || undefined,
    robots: resolved.page.seo?.noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export default async function CmsLegacySlugPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const resolved = resolveStorefrontPath(`/${slug}`);

  if (resolved.source !== 'dynamic' || !resolved.page) {
    notFound();
  }

  return <CmsPageRenderer page={resolved.page} />;
}
