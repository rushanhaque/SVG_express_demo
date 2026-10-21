import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  build: {
    rollupOptions: {
      output: {
        // Long-lived vendor chunks: app edits don't invalidate React/GSAP caches.
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('@phosphor-icons')) return 'icons'; // before React: its path contains /react/
          if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'react';
          if (/node_modules\/(gsap|@gsap|lenis)\//.test(id)) return 'motion';
          return 'vendor';
        },
      },
    },
  },
});
