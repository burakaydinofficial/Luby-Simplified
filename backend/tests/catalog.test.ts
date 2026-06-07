import { describe, it, expect, afterAll } from 'vitest';
import { api, closeDb } from './helpers';

afterAll(closeDb);

describe('catalog', () => {
  it('lists the 8 seeded categories', async () => {
    const res = await api().get('/api/categories');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(8);
  });

  it('lists all 30 seeded lullabies', async () => {
    const res = await api().get('/api/lullabies');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(30);
    expect(res.body[0]).toHaveProperty('audioUrl');
  });

  it('filters by category', async () => {
    const res = await api().get('/api/lullabies?category=animals');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body.every((l: { category: { slug: string } }) => l.category.slug === 'animals')).toBe(true);
  });

  it('searches by title', async () => {
    const res = await api().get('/api/lullabies?search=ocean');
    expect(res.status).toBe(200);
    expect(res.body.some((l: { title: string }) => /ocean/i.test(l.title))).toBe(true);
  });

  it('returns 404 for an unknown lullaby', async () => {
    const res = await api().get('/api/lullabies/does-not-exist');
    expect(res.status).toBe(404);
  });
});
