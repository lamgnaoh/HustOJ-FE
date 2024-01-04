import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2'
import { fileURLToPath } from 'url';
import path from 'path';

const filename = fileURLToPath(import.meta.url);
const pathSegments = path.dirname(filename);

export default defineConfig({
    plugins: [vue()],
    build: {
        rollupOptions: {
            output: {
                format: 'es'
            },
            preserveEntrySignatures: 'allow-extension',
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(pathSegments, './src'),
            // '~': path.resolve(pathSegments, './node_modules')
        },
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    },
    css: {
        preprocessorOptions: {
            less: {
                math: "always",
                relativeUrls: true,
                javascriptEnabled: true
            },
        },
    },
})