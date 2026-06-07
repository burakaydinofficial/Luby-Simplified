import { Router } from 'express';
import { z } from 'zod';
import * as playlistsController from '../controllers/playlists.controller';
import { validateBody } from '../middleware/validate';
import { requireAuth } from '../middleware/auth';

const nameSchema = z.object({ name: z.string().trim().min(1).max(80) });
const itemSchema = z.object({ lullabyId: z.string().min(1) });

export const playlistsRouter = Router();

playlistsRouter.use(requireAuth);
playlistsRouter.get('/', playlistsController.list);
playlistsRouter.post('/', validateBody(nameSchema), playlistsController.create);
playlistsRouter.get('/:id', playlistsController.get);
playlistsRouter.patch('/:id', validateBody(nameSchema), playlistsController.rename);
playlistsRouter.delete('/:id', playlistsController.remove);
playlistsRouter.post('/:id/items', validateBody(itemSchema), playlistsController.addItem);
playlistsRouter.delete('/:id/items/:lullabyId', playlistsController.removeItem);
