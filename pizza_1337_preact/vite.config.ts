import { defineConfig } from 'vitest/config'
import preact from '@preact/preset-vite'

export default defineConfig({
  plugins: [preact()],
  server: {
    port: 3030,
    proxy: {
      '/v1': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        // Optional: remove '/v1' prefix when forwarding
        // rewrite: (path) => path.replace(/^\/v1/, '')
      }
    }
  
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  test: {
    coverage: {
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'tests/',
        'src/tests',
        '**/*.test.ts',
        '**/*.config.ts'
      ]
    },
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/tests/setup.ts']
  }
})