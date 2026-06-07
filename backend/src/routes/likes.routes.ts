import { Router } from 'express';
import * as likesController from '../controllers/likes.controller';
import { requireAuth } from '../middleware/auth';

export const likesRouter = Router();

likesRouter.use(requireAuth);
likesRouter.get('/', likesController.list);
likesRouter.put('/:lullabyId', likesController.like);
likesRouter.delete('/:lullabyId', likesController.unlike);
