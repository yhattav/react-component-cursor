import { defineConfig } from 'tsup'

export default defineConfig([
  // Production build - strip development code
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    outDir: 'dist',
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    minify: true,
    external: ['react', 'react-dom'],
    define: {
      'process.env.NODE_ENV': '"production"'
    },
    treeshake: true,
    outExtension({ format }) {
      return {
        js: format === 'cjs' ? '.js' : '.mjs'
      }
    },
  },
  // Development build - include all development features
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    outDir: 'dist',
    dts: false, // Only need types once
    splitting: false,
    sourcemap: true,
    clean: false, // Don't clean, we're building alongside production
    minify: false, // Keep readable for development
    external: ['react', 'react-dom'],
    define: {
      'process.env.NODE_ENV': '"development"'
    },
    treeshake: false, // Keep all code for development
    outExtension({ format }) {
      return {
        js: format === 'cjs' ? '.dev.js' : '.dev.mjs'
      }
    },
  }
])
