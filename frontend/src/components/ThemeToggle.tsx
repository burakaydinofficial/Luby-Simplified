import { Palette } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function ThemeToggle() {
  const { theme, cycleTheme } = useTheme();
  return (
    <button
      className="icon-button"
      onClick={cycleTheme}
      aria-label={`Theme: ${theme}. Click to change.`}
      title={`Theme: ${theme}`}
    >
      <Palette size={20} />
    </button>
  );
}
