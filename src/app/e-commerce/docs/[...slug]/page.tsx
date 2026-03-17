import { redirect } from 'next/navigation';

type Params = {
  slug: string[];
};

export default async function EcommerceDocsAliasDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  redirect(`/docs/${slug.join('/')}`);
}
