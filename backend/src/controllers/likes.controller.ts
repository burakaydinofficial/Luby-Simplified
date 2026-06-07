import type { RequestHandler } from 'express';
import * as likeService from '../services/like.service';

export const list: RequestHandler = async (req, res) => {
  res.json(await likeService.listLikedLullabies(req.userId!));
};

export const like: RequestHandler<{ lullabyId: string }> = async (req, res) => {
  await likeService.like(req.userId!, req.params.lullabyId);
  res.status(204).end();
};

export const unlike: RequestHandler<{ lullabyId: string }> = async (req, res) => {
  await likeService.unlike(req.userId!, req.params.lullabyId);
  res.status(204).end();
};
