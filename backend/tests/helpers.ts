import request from 'supertest';
import { createApp } from '../src/app';
import { prisma } from '../src/db/prisma';

// Tests exercise the app through its HTTP API (no direct service imports).
const app = createApp();

export const api = () => request(app);

let counter = 0;

export async function registerUser() {
  counter += 1;
  const email = `user${counter}_${Math.random().toString(36).slice(2)}@test.dev`;
  const res = await request(app)
    .post('/api/auth/register')
    .send({ email, password: 'secret123', displayName: 'Tester' });
  return { email, token: res.body.token as string, user: res.body.user };
}

export const bearer = (token: string) => ({ Authorization: `Bearer ${token}` });

export async function firstLullabyId(): Promise<string> {
  const res = await request(app).get('/api/lullabies');
  return res.body[0].id as string;
}

export async function closeDb() {
  await prisma.$disconnect();
}
