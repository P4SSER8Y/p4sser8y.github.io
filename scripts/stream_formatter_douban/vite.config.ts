import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import monkey, { cdn } from 'vite-plugin-monkey';
import components from 'unplugin-vue-components/vite';
import autoImport from 'unplugin-auto-import/vite';
import { VarletImportResolver } from '@varlet/import-resolver';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        components({
            resolvers: [VarletImportResolver()],
        }),
        autoImport({ resolvers: [VarletImportResolver({ autoImport: true })] }),
        monkey({
            entry: 'src/main.ts',
            userscript: {
                namespace: 'npm/vite-plugin-monkey',
                match: ['*://movie.douban.com/*'],
            },
            build: {
                externalGlobals: {
                    vue: cdn.jsdelivr('Vue', 'dist/vue.global.prod.js'),
                },
            },
        }),
    ],
    build: {
        minify: true,
    },
});
