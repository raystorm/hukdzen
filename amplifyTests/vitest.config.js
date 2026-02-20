import { defineConfig } from 'vitest/config';

export default defineConfig({
   test: {
      include: ['../amplify/data/**/__tests__/**/*.test.js'],
      coverage: {
         provider: 'v8',
         include: ['../amplify/data/**/*.js'],
         exclude: ['../amplify/data/**/__tests__/**'],
         reportsDirectory: './coverage',
      },
   },
});
