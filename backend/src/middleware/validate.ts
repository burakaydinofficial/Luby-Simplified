import type { RequestHandler } from 'express';
import type { ZodSchema } from 'zod';

// Validate and coerce req.body against a Zod schema. ZodError is caught by errorHandler.
export function validateBody(schema: ZodSchema): RequestHandler {
  return (req, _res, next) => {
    req.body = schema.parse(req.body);
    next();
  };
}
