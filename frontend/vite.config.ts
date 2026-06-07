import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// During local dev, proxy API + audio to the backend on :4000.
// In production the nginx container handles this proxying instead.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:4000',
      '/media': 'http://localhost:4000',
    },
  },
});
