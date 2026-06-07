import type { RequestHandler } from 'express';
import * as lullabyService from '../services/lullaby.service';

export const list: RequestHandler = async (req, res) => {
  const category = typeof req.query.category === 'string' ? req.query.category : undefined;
  const search = typeof req.query.search === 'string' ? req.query.search : undefined;
  res.json(await lullabyService.listLullabies({ category, search }));
};

export const get: RequestHandler<{ id: string }> = async (req, res) => {
  res.json(await lullabyService.getLullaby(req.params.id));
};
