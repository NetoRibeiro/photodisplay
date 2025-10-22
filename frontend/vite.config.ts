import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [preact()],
  build: {
    target: 'es2019',
    outDir: 'dist',
    assetsInlineLimit: 4096
  },
  server: {
    port: 5173
  }
});
