import 'express';

// Attach the authenticated user's id to the request (set by requireAuth).
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}
