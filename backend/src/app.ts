import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { authRouter } from './routes/auth.routes';
import { categoriesRouter } from './routes/categories.routes';
import { lullabiesRouter } from './routes/lullabies.routes';
import { likesRouter } from './routes/likes.routes';
import { playlistsRouter } from './routes/playlists.routes';
import { errorHandler } from './middleware/error';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Audio files (served statically; express.static supports range requests for seeking).
  app.use('/media', express.static(path.resolve(process.cwd(), 'media')));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/categories', categoriesRouter);
  app.use('/api/lullabies', lullabiesRouter);
  app.use('/api/me/likes', likesRouter);
  app.use('/api/me/playlists', playlistsRouter);

  app.use(errorHandler);

  return app;
}
