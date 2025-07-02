'use client';
import { useTheme } from '@/hooks/useTheme';
import { useI18n } from '@/hooks/useI18n';
import { labels } from '@/data/labels';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { lang } = useI18n();
  const labelSet = labels[lang as keyof typeof labels] || labels.pt;

  return (
    <button
      onClick={toggleTheme}
      className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-hover"
    >
      {theme === 'light' ? labelSet.darkMode : labelSet.lightMode}
    </button>
  );
}