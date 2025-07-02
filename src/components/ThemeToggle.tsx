'use client';
import { useTheme } from '@/hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-hover"
    >
      {theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
    </button>
  );
}