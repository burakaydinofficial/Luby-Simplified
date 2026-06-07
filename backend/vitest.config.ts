import { defineConfig } from 'vitest/config';

// Integration tests share one database, so run files serially.
export default defineConfig({
  test: {
    environment: 'node',
    fileParallelism: false,
    hookTimeout: 30000,
    testTimeout: 30000,
  },
});
