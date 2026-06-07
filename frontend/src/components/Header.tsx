import { Link, NavLink } from 'react-router-dom';
import { Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { HeaderMenu } from './HeaderMenu';
import './Header.css';

export function Header() {
  const { isAuthenticated } = useAuth();

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
          <HeaderMenu />
        </div>
      </div>
    </header>
  );
}
