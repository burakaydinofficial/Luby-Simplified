import { describe, it, expect, afterAll } from 'vitest';
import { api, registerUser, bearer, closeDb } from './helpers';

afterAll(closeDb);

describe('auth', () => {
  it('registers and returns a token + sanitized user', async () => {
    const { token, user } = await registerUser();
    expect(token).toBeTruthy();
    expect(user).toHaveProperty('id');
    expect(user).not.toHaveProperty('passwordHash');
  });

  it('logs in with valid credentials', async () => {
    const { email } = await registerUser();
    const res = await api().post('/api/auth/login').send({ email, password: 'secret123' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
  });

  it('rejects wrong password with 401', async () => {
    const { email } = await registerUser();
    const res = await api().post('/api/auth/login').send({ email, password: 'wrongpass' });
    expect(res.status).toBe(401);
  });

  it('rejects a duplicate email with 409', async () => {
    const { email } = await registerUser();
    const res = await api()
      .post('/api/auth/register')
      .send({ email, password: 'secret123', displayName: 'Dupe' });
    expect(res.status).toBe(409);
  });

  it('rejects a too-short password with 400', async () => {
    const res = await api()
      .post('/api/auth/register')
      .send({ email: 'shortpw@test.dev', password: '123', displayName: 'X' });
    expect(res.status).toBe(400);
  });

  it('returns the current user for a valid token', async () => {
    const { token, user } = await registerUser();
    const res = await api().get('/api/auth/me').set(bearer(token));
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(user.id);
  });

  it('rejects /me without a token (401)', async () => {
    const res = await api().get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});
