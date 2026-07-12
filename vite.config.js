import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  // Relative asset paths work on Vercel root domains and GitHub Pages subpaths.
  base: './',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    open: false,
  },
});
