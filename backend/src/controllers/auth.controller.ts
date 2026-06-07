import type { RequestHandler } from 'express';
import * as authService from '../services/auth.service';

export const register: RequestHandler = async (req, res) => {
  const { email, password, displayName } = req.body;
  const result = await authService.register(email, password, displayName);
  res.status(201).json(result);
};

export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  res.json(result);
};

export const me: RequestHandler = async (req, res) => {
  const user = await authService.getUserById(req.userId!);
  res.json(user);
};
