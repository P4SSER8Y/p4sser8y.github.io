import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/gate',
  build: {
    outDir: "dist",
    emptyOutDir: true,
    copyPublicDir: true,
  },
  server: {
    proxy: {
      '/.netlify': 'http://localhost:8888'
    }
  }
})
