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
    ]
  }
})
