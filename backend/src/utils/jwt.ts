import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { HttpError } from './http-error';

const EXPIRES_IN = '7d';

export function signToken(userId: string): string {
  return jwt.sign({ sub: userId }, env.jwtSecret, { expiresIn: EXPIRES_IN });
}

export function verifyToken(token: string): { sub: string } {
  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    if (typeof decoded === 'string' || !decoded.sub) {
      throw new Error('Malformed token');
    }
    return { sub: String(decoded.sub) };
  } catch {
    throw new HttpError(401, 'Invalid or expired token');
  }
}
