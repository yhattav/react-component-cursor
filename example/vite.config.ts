import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  base: '/react-component-cursor/',
  plugins: [react()],
  resolve: {
    alias: {
      // Point library imports to source files for development
      '@yhattav/react-component-cursor': path.resolve(__dirname, '../src/index.ts')
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  },
  ssr: {
    noExternal: ['@yhattav/react-component-cursor']
  }
});
