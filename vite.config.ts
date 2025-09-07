import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [ react() ],
  build:   { outDir: 'build' },
  server:  { port: 3000 },
  test: {
    environment: 'jsdom',
    setupFiles: ['src/setupTests.ts'],
    globals: true,
    reporter: ['verbose'],
    outputDiffLines: 50,
    exclude: [
      ...configDefaults.exclude,
      'amplify/**',
      'patches/**',
      'Local-Utilities/**',
      '.idea/**', '.git/**'
    ],
    deps: { moduleDirectories: ['node_modules', 'src/__mocks__'] },
  },
  define: { global: 'globalThis' },
  resolve: {
    alias: {
       '@testing-library/user-event':
          '@testing-library/user-event/dist/index.js'
    }
  },
  optimizeDeps: {
    include: ['@testing-library/user-event']
  }
})
