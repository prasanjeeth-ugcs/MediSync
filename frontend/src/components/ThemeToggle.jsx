import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

/**
 * ThemeToggle — Switches the app between light and dark mode.
 *
 * Adds/removes class="dark" on <html>. Our index.css has
 * `html.dark .bg-surface { ... }` rules that respond to this class.
 * The user's preference is saved in localStorage across visits.
 */

function getInitialTheme() {
  const saved = localStorage.getItem('medisync-theme');
  if (saved) return saved === 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyTheme(isDark) {
  document.documentElement.classList.toggle('dark', isDark);
  localStorage.setItem('medisync-theme', isDark ? 'dark' : 'light');
}

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(getInitialTheme);

  useEffect(() => { applyTheme(isDark); }, [isDark]);
  // Apply immediately on mount before first paint
  useEffect(() => { applyTheme(getInitialTheme()); }, []); // eslint-disable-line

  return (
    <button
      onClick={() => setIsDark(v => !v)}
      className="p-2 rounded-xl text-ink-secondary hover:text-brand-600 hover:bg-brand-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      aria-label="Toggle theme"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
