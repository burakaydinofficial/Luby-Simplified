import { useState } from 'react';
import { Search } from 'lucide-react';
import { useGetCategoriesQuery, useGetLullabiesQuery } from '../store/api';
import { LullabyCard } from '../components/LullabyCard';
import { CategoryPill } from '../components/CategoryPill';
import './HomePage.css';

export function HomePage() {
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState('');

  const { data: categories } = useGetCategoriesQuery();
  const { data: lullabies, isLoading } = useGetLullabiesQuery({
    category,
    search: search.trim() || undefined,
  });

  return (
    <div className="page">
      <div className="home-hero">
        <h1 className="page-title">Lullabies for peaceful nights</h1>
        <p className="muted">Browse the library and press play — no account needed.</p>
      </div>

      <div className="home-search">
        <Search size={18} className="home-search-icon" />
        <input
          type="search"
          placeholder="Search lullabies…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search lullabies"
        />
      </div>

      <div className="home-filters">
        <CategoryPill active={!category} onClick={() => setCategory(undefined)}>
          All
        </CategoryPill>
        {categories?.map((item) => (
          <CategoryPill
            key={item.id}
            active={category === item.slug}
            onClick={() => setCategory(item.slug)}
          >
            {item.name}
          </CategoryPill>
        ))}
      </div>

      {isLoading ? (
        <p className="muted">Loading…</p>
      ) : lullabies && lullabies.length > 0 ? (
        <div className="grid">
          {lullabies.map((lullaby) => (
            <LullabyCard key={lullaby.id} lullaby={lullaby} queue={lullabies} />
          ))}
        </div>
      ) : (
        <p className="muted">No lullabies found.</p>
      )}
    </div>
  );
}
