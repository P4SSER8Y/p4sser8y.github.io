import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    copyPublicDir: true,
  },
  server: {
    host: true,
  },
  envPrefix: ['INFO_', 'GATE_LOCATION'],
});
