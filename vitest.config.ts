import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    setupFiles: ['./test/setupTests.ts'],
    globals: true,
    include: [
      'test/**/*.{test,spec}.{js,ts,tsx}',
      'src/**/*.{test,spec}.{js,ts,tsx}'
    ],
    exclude: [
      '**/node_modules/**',
      '**/e2e/**',
      '**/dist/**'
    ],
    // CI-friendly configuration
    pool: 'threads',
    poolOptions: {
      threads: {
        maxThreads: process.env.CI ? 2 : undefined,
        minThreads: process.env.CI ? 1 : undefined
      }
    },
    // Better CI reporting
    reporters: process.env.CI ? ['verbose', 'github-actions'] : ['default']
  }
})
