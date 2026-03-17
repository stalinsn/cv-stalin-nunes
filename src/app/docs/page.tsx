import type { Metadata } from 'next';
import { DocsShell } from '@/features/docs/components/DocsShell';
import { getDocsHomeNote } from '@/features/docs/server/source';

export const dynamic = 'force-static';

export function generateMetadata(): Metadata {
  const note = getDocsHomeNote();
  return {
    title: note.title,
    description: note.description,
  };
}

export default function DocsHomePage() {
  return <DocsShell note={getDocsHomeNote()} />;
}
