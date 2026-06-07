import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { api, registerUser, bearer, firstLullabyId, closeDb } from './helpers';

let lullabyId: string;

beforeAll(async () => {
  lullabyId = await firstLullabyId();
});

afterAll(closeDb);

describe('playlists', () => {
  it('requires authentication (401)', async () => {
    const res = await api().get('/api/me/playlists');
    expect(res.status).toBe(401);
  });

  it('runs the full create → add → rename → remove → delete lifecycle', async () => {
    const { token } = await registerUser();
    const auth = bearer(token);

    const created = await api().post('/api/me/playlists').set(auth).send({ name: 'Bedtime' });
    expect(created.status).toBe(201);
    const id = created.body.id as string;

    const added = await api().post(`/api/me/playlists/${id}/items`).set(auth).send({ lullabyId });
    expect(added.status).toBe(201);

    const got = await api().get(`/api/me/playlists/${id}`).set(auth);
    expect(got.status).toBe(200);
    expect(got.body.items.length).toBe(1);
    expect(got.body.items[0].lullaby.id).toBe(lullabyId);

    const renamed = await api().patch(`/api/me/playlists/${id}`).set(auth).send({ name: 'Sleepy' });
    expect(renamed.status).toBe(200);
    expect(renamed.body.name).toBe('Sleepy');

    const removed = await api().delete(`/api/me/playlists/${id}/items/${lullabyId}`).set(auth);
    expect(removed.status).toBe(204);

    const deleted = await api().delete(`/api/me/playlists/${id}`).set(auth);
    expect(deleted.status).toBe(204);

    const gone = await api().get(`/api/me/playlists/${id}`).set(auth);
    expect(gone.status).toBe(404);
  });

  it('rejects an empty playlist name (400)', async () => {
    const { token } = await registerUser();
    const res = await api().post('/api/me/playlists').set(bearer(token)).send({ name: '' });
    expect(res.status).toBe(400);
  });

  it("does not expose another user's playlist (404)", async () => {
    const owner = await registerUser();
    const other = await registerUser();
    const created = await api()
      .post('/api/me/playlists')
      .set(bearer(owner.token))
      .send({ name: 'Private' });
    const res = await api().get(`/api/me/playlists/${created.body.id}`).set(bearer(other.token));
    expect(res.status).toBe(404);
  });
});
