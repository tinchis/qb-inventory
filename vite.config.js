import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
    plugins: [svelte()],
    base: './',
    build: {
        outDir: 'html',
        emptyOutDir: false,
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'index.html')
            },
            output: {
                entryFileNames: 'js/main.js',
                chunkFileNames: 'js/[name].js',
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name.endsWith('.css')) {
                        return 'css/main.css';
                    }
                    return 'assets/[name][extname]';
                }
            }
        }
    }
});
