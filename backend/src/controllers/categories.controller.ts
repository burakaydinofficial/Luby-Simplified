import type { RequestHandler } from 'express';
import * as categoryService from '../services/category.service';

export const list: RequestHandler = async (_req, res) => {
  res.json(await categoryService.listCategories());
};
