import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CmsPageRenderer from '@/features/ecommerce/components/cms/CmsPageRenderer';
import { isOn } from '@/features/ecommerce/config/featureFlags';
import { resolveStorefrontPath } from '@/features/ecommerce/server/routeResolver';

type Params = {
  cmsPath: string[];
};

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { cmsPath } = await params;
  const path = `/${cmsPath.join('/')}`;
  const resolved = resolveStorefrontPath(path);

  if (resolved.source !== 'dynamic' || !resolved.page) {
    return { title: 'Página não encontrada' };
  }

  return {
    title: resolved.page.seo?.title || resolved.page.title,
    description: resolved.page.seo?.description || resolved.page.description,
    keywords: resolved.page.seo?.keywords || undefined,
    robots: resolved.page.seo?.noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export default async function EcommerceDynamicCmsPage({ params }: { params: Promise<Params> }) {
  if (!isOn('ecom.siteResolver.enabled')) {
    notFound();
  }

  const { cmsPath } = await params;
  const path = `/${cmsPath.join('/')}`;
  const resolved = resolveStorefrontPath(path);

  if (resolved.source !== 'dynamic' || !resolved.page) {
    notFound();
  }

  return <CmsPageRenderer page={resolved.page} />;
}
