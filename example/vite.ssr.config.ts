import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    ssr: true,
    rollupOptions: {
      input: './src/main-server.tsx',
      output: {
        format: 'esm'
      }
    },
    outDir: 'dist-ssr'
  },
  ssr: {
    noExternal: ['@yhattav/react-component-cursor']
  }
}); 