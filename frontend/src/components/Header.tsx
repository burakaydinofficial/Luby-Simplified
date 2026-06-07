import { Link, NavLink } from 'react-router-dom';
import { Moon, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import './Header.css';

export function Header() {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();

  return (
    <header className="app-header">
      <div className="app-header-inner container">
        <Link to="/" className="brand">
          <Moon className="brand-icon" size={24} />
          <span className="brand-name">Luby</span>
        </Link>

        <nav className="app-nav">
          <NavLink to="/" end className="nav-link">
            Browse
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/library" className="nav-link">
              Library
            </NavLink>
          )}
        </nav>

        <div className="app-header-actions">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <span className="user-name muted">{user?.displayName}</span>
              <button className="button-outline" onClick={logout}>
                <LogOut size={16} />
                Log out
              </button>
            </>
          ) : (
            <button className="button" onClick={openAuthModal}>
              Sign in
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
