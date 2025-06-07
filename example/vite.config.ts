import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  base: '/react-component-cursor/',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        server: './src/main-server.tsx'
      }
    }
  },
  ssr: {
    noExternal: ['@yhattav/react-component-cursor']
  }
});
