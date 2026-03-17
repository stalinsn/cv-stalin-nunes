import { redirect } from 'next/navigation';

type Params = {
  slug: string[];
};

export default async function DocsAulasAliasDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  redirect(`/docs/guias/${slug.join('/')}`);
}
