import { Router } from 'express';
import * as lullabiesController from '../controllers/lullabies.controller';

export const lullabiesRouter = Router();

lullabiesRouter.get('/', lullabiesController.list);
lullabiesRouter.get('/:id', lullabiesController.get);
