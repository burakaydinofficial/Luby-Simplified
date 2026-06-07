import { configureStore } from '@reduxjs/toolkit';
import { api } from './api';

// Store holds only the RTK Query cache reducer — no hand-written slices.
export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
