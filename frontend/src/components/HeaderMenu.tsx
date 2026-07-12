import { useEffect, useRef, useState } from 'react';
import { Menu as MenuIcon, LogOut, LogIn, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import { useTheme, type Theme } from '../context/ThemeContext';
import './HeaderMenu.css';

const THEME_OPTIONS: { id: Theme; label: string }[] = [
  { id: 'yellow', label: 'Yellow' },
  { id: 'pink', label: 'Pink' },
  { id: 'blue', label: 'Blue' },
];

export function HeaderMenu() {
  const { user, isAuthenticated, logout } = useAuth();
  const { open: openModal } = useModal();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const signIn = () => {
    setOpen(false);
    openModal({ type: 'auth' });
  };

  const signOut = () => {
    setOpen(false);
    logout();
  };

  return (
    <div className="header-menu" ref={ref}>
      <button
        className="icon-button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Menu"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <MenuIcon size={22} />
      </button>

      {open && (
        <div className="header-menu-panel" role="menu">
          {isAuthenticated && (
            <div className="header-menu-user">
              <span className="muted">Signed in as</span>
              <span className="header-menu-name">{user?.displayName}</span>
            </div>
          )}

          <div className="header-menu-section">
            <span className="header-menu-label muted">Theme</span>
            <div className="header-menu-themes">
              {THEME_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  className={`theme-swatch theme-swatch-${option.id}${theme === option.id ? ' is-active' : ''}`}
                  onClick={() => setTheme(option.id)}
                  aria-label={`${option.label} theme`}
                  aria-pressed={theme === option.id}
                >
                  {theme === option.id && <Check size={14} />}
                </button>
              ))}
            </div>
          </div>

          <div className="header-menu-divider" />

          {isAuthenticated ? (
            <button className="header-menu-item" role="menuitem" onClick={signOut}>
              <LogOut size={18} />
              Log out
            </button>
          ) : (
            <button className="header-menu-item" role="menuitem" onClick={signIn}>
              <LogIn size={18} />
              Sign in
            </button>
          )}
        </div>
      )}
    </div>
  );
}
