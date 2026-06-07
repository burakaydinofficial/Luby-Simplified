import type { RequestHandler } from 'express';
import { verifyToken } from '../utils/jwt';
import { HttpError } from '../utils/http-error';

// Require a valid Bearer token; attaches req.userId for downstream handlers.
export const requireAuth: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    throw new HttpError(401, 'Authentication required');
  }
  const { sub } = verifyToken(header.slice('Bearer '.length));
  req.userId = sub;
  next();
};
