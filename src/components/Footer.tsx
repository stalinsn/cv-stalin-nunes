import { labels } from '@/data/labels';
import { useI18n } from '@/hooks/useI18n';

export default function Footer() {
  const { lang } = useI18n();
  const labelSet = labels[lang as keyof typeof labels] || labels.pt;
  return (
    <footer className="w-full text-center text-sm text-muted mt-8 mb-4">
      © {new Date().getFullYear()} Stalin Souza Nunes. {labelSet.footer}
    </footer>
  );
}
