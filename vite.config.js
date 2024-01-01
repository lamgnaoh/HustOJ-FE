import { defineConfig } from 'vite';
import { createVuePlugin } from "vite-plugin-vue2";
import { fileURLToPath } from 'url';
import path from 'path';

const filename = fileURLToPath(import.meta.url);
const pathSegments = path.dirname(filename);

export default defineConfig({
    plugins: [createVuePlugin()],
    build: {
        rollupOptions: {
            output: {
                format: 'es',
                treeshake: false
            },
            preserveEntrySignatures: 'allow-extension',
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(pathSegments, './src'),
            '~': path.resolve(pathSegments, './node_modules')
        },
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    }
})