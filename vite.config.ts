import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [ react() ],
  build:   { outDir: 'build' },
  server:  { port: 3000 },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/setupTests.ts'],
    // reporters: ['verbose'],
    exclude: [
      ...configDefaults.exclude,
      'amplify/**',
      'patches/**',
      'Local-Utilities/**',
      '.idea/**', '.git/**'
    ],
    deps: { moduleDirectories: ['node_modules', 'src/__mocks__'] },
    // Add these for better user-event compatibility
    testTimeout: 10000,
    hookTimeout: 10000,
    // pool: 'threads',
    // poolOptions: { threads: { singleThread: true } },
  },
  define: { global: 'globalThis' }
   /*
  ,
  resolve: {
    alias: {
       '@testing-library/user-event':
          '@testing-library/user-event/dist/index.js'
    }
  },
  optimizeDeps: {
    include: ['@testing-library/user-event']
  }
  */
})
