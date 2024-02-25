import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';

export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    quasar({
      sassVariables: resolve(__dirname, 'quasar.variables.scss'),
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    copyPublicDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        stream: resolve(__dirname, 'stream/index.html'),
        raven: resolve(__dirname, 'raven/index.html'),
        coop: resolve(__dirname, 'coop/index.html'),
      }
    },
  },
  envPrefix: ['INFO_'],
  define: {
    'process.env.INFO_NOW': process.env.INFO_NOW,
    'process.env.GATE_LOCATION': JSON.stringify(process.env.GATE_LOCATION),
    'process.env.GATE_FAMILY': JSON.stringify(process.env.GATE_FAMILY),
    'process.env.NETLIFY': process.env.NETLIFY,
    'process.env.STREAM_RECORD_PATH': JSON.stringify(process.env.STREAM_RECORD_PATH),
    'process.env.STREAM_PATH_PREFIX': JSON.stringify(process.env.STREAM_PATH_PREFIX),
    'process.env.STREAM_MEDIA_BASE': JSON.stringify(process.env.STREAM_MEDIA_BASE),
  },
  server: {
    host: true,
    proxy: {
      '^/proxy': {
        target: process.env.PROXY_SERVER,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy/, ''),
      },
    },
  },
});
