import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { api, registerUser, bearer, firstLullabyId, closeDb } from './helpers';

let lullabyId: string;

beforeAll(async () => {
  lullabyId = await firstLullabyId();
});

afterAll(closeDb);

describe('likes (the Liked playlist)', () => {
  it('requires authentication (401)', async () => {
    const res = await api().get('/api/me/likes');
    expect(res.status).toBe(401);
  });

  it('likes, lists, then unlikes a lullaby', async () => {
    const { token } = await registerUser();
    const auth = bearer(token);

    const liked = await api().put(`/api/me/likes/${lullabyId}`).set(auth);
    expect(liked.status).toBe(204);

    const list = await api().get('/api/me/likes').set(auth);
    expect(list.status).toBe(200);
    expect(list.body.some((l: { id: string }) => l.id === lullabyId)).toBe(true);

    const unliked = await api().delete(`/api/me/likes/${lullabyId}`).set(auth);
    expect(unliked.status).toBe(204);

    const after = await api().get('/api/me/likes').set(auth);
    expect(after.body.some((l: { id: string }) => l.id === lullabyId)).toBe(false);
  });

  it('returns 404 when liking a non-existent lullaby', async () => {
    const { token } = await registerUser();
    const res = await api().put('/api/me/likes/nope').set(bearer(token));
    expect(res.status).toBe(404);
  });
});
