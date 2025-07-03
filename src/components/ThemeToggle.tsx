'use client';
import { useTheme } from '@/hooks/useTheme';
import { useI18n } from '@/hooks/useI18n';
import { labels } from '@/data/labels';

export default function ThemeToggle() {
  const { toggleTheme } = useTheme();
  const { lang } = useI18n();

  return (
    <button
      onClick={toggleTheme}
      className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-hover"
    >
      {labels.toggleTheme[lang as import("@/types/cv").Language]}
    </button>
  );
}