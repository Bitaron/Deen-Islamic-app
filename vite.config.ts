
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    port: 3000,
  },
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
  },
});
