import {
  Hash,
  Type,
  Palette,
  PawPrint,
  Moon,
  Trees,
  Heart,
  Waves,
  Music,
  type LucideIcon,
} from 'lucide-react';

// Maps each seeded category slug to a representative icon.
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  'numbers-counting': Hash,
  'letters-alphabet': Type,
  colors: Palette,
  animals: PawPrint,
  'stars-moon-night': Moon,
  'nature-seasons': Trees,
  'family-love': Heart,
  'ocean-water': Waves,
};

export function getCategoryIcon(slug?: string): LucideIcon {
  return (slug && CATEGORY_ICONS[slug]) || Music;
}
