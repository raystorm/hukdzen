import { defineConfig } from 'vitest/config';

export default defineConfig({
   test: {
      include: ['__tests__/**/*.test.js'],
      coverage: {
         provider: 'v8',
         include: ['*.js'],
         exclude: ['__tests__/**'],
         reportsDirectory: './__tests__/coverage',
      },
      globals: true,
      environment: 'node',
   },
});
