import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
    plugins: [svelte()],
    base: './',
    publicDir: 'public',
    build: {
        outDir: '../html-build',
        emptyOutDir: true,
        assetsInlineLimit: 0,
        copyPublicDir: true,
        rollupOptions: {
            output: {
                assetFileNames: 'assets/[name].[ext]',
                chunkFileNames: 'assets/[name].js',
                entryFileNames: 'assets/[name].js'
            }
        }
    },
    server: {
        port: 3000
    }
});

