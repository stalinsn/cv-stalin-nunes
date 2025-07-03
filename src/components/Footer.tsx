import { labels } from '@/data/labels';
import { useI18n } from '@/hooks/useI18n';

export default function Footer() {
  const { lang } = useI18n();
  const footerText = labels.footer?.[lang as keyof typeof labels.footer] || "Todos os direitos reservados.";
  return (
    <footer className="w-full text-center text-sm text-muted mt-8 mb-4">
      © {new Date().getFullYear()} Stalin Souza Nunes. {footerText}
    </footer>
  );
}
