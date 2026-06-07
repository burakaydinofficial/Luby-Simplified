import type { CSSProperties } from 'react';
import { coverGradient } from '../lib/cover';
import { getCategoryIcon } from '../lib/categoryIcon';
import './CoverArt.css';

interface CoverArtProps {
  seed: string;
  categorySlug?: string;
}

export function CoverArt({ seed, categorySlug }: CoverArtProps) {
  const Icon = getCategoryIcon(categorySlug);
  const style = { '--cover': coverGradient(seed) } as CSSProperties;
  return (
    <div className="cover-art" style={style}>
      <Icon className="cover-art-icon" aria-hidden />
    </div>
  );
}
