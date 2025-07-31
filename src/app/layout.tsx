import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'CV | Stalin Souza Nunes',
  description: 'Currículo desenvolvido em Next.js por Stalin Souza Nunes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" data-theme="light">
      <body className={plusJakarta.className}>
        {children}
      </body>
    </html>
  );
}
