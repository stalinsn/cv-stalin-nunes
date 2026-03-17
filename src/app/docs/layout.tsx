import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Developer Docs',
    template: '%s | Developer Docs',
  },
  description: 'Documentação interna do workspace em formato de site de referência.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
