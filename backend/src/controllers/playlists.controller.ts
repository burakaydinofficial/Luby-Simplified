import type { RequestHandler } from 'express';
import * as playlistService from '../services/playlist.service';

export const list: RequestHandler = async (req, res) => {
  res.json(await playlistService.listPlaylists(req.userId!));
};

export const create: RequestHandler = async (req, res) => {
  const playlist = await playlistService.createPlaylist(req.userId!, req.body.name);
  res.status(201).json(playlist);
};

export const get: RequestHandler<{ id: string }> = async (req, res) => {
  res.json(await playlistService.getPlaylist(req.userId!, req.params.id));
};

export const rename: RequestHandler<{ id: string }> = async (req, res) => {
  res.json(await playlistService.renamePlaylist(req.userId!, req.params.id, req.body.name));
};

export const remove: RequestHandler<{ id: string }> = async (req, res) => {
  await playlistService.deletePlaylist(req.userId!, req.params.id);
  res.status(204).end();
};

export const addItem: RequestHandler<{ id: string }> = async (req, res) => {
  await playlistService.addItem(req.userId!, req.params.id, req.body.lullabyId);
  res.status(201).end();
};

export const removeItem: RequestHandler<{ id: string; lullabyId: string }> = async (req, res) => {
  await playlistService.removeItem(req.userId!, req.params.id, req.params.lullabyId);
  res.status(204).end();
};
