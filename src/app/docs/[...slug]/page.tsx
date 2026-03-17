import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DocsShell } from '@/features/docs/components/DocsShell';
import { getAllDocsStaticRoutes, getDocsNoteByRoute } from '@/features/docs/server/source';

export const dynamicParams = false;
export const dynamic = 'force-static';

export function generateStaticParams() {
  return getAllDocsStaticRoutes().map((slug) => ({ slug }));
}

type Params = {
  slug: string[];
};

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const note = getDocsNoteByRoute(slug);
  if (!note) {
    return {
      title: 'Documentação',
    };
  }

  return {
    title: note.title,
    description: note.description,
  };
}

export default async function DocsNotePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const note = getDocsNoteByRoute(slug);
  if (!note) {
    notFound();
  }

  return <DocsShell note={note} />;
}
