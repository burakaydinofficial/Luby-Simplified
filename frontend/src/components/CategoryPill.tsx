import type { ReactNode } from 'react';
import './CategoryPill.css';

interface CategoryPillProps {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}

export function CategoryPill({ active, onClick, children }: CategoryPillProps) {
  return (
    <button className={`category-pill${active ? ' is-active' : ''}`} onClick={onClick}>
      {children}
    </button>
  );
}
