import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [ react() ],
  build: {
    outDir: 'build',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router'],
          'vendor-mui': ['@mui/material', '@mui/icons-material',
                         '@mui/x-data-grid', '@mui/x-date-pickers'],
          'vendor-amplify': ['aws-amplify', '@aws-amplify/core', '@aws-amplify/storage'],
          'vendor-redux': ['@reduxjs/toolkit', 'react-redux', 'redux-saga'],
          'vendor-pdf': ['pdfjs-dist', 'react-pdf'],
        }
      }
    },
    chunkSizeWarningLimit: 600
  },
  server: { port: 3000 },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/setupTests.ts'],
    // reporters: ['verbose'],
    exclude: [
      ...configDefaults.exclude,
      'amplify/**', 'amplify-gen1/**',
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
