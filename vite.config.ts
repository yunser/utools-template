import { resolve } from 'path'
import { defineConfig, BuildOptions } from 'vite'
import { viteSingleFile } from "vite-plugin-singlefile"
import react from '@vitejs/plugin-react'
import { createHtmlPlugin } from 'vite-plugin-html'

const target = process.env.TARGET

export default defineConfig(() => {
    const buildConfig = target === 'ui'
        ? {
            target: "esnext",
            assetsInlineLimit: 100000000,
            chunkSizeWarningLimit: 100000000,
            cssCodeSplit: false,
            brotliSize: false,
            rollupOptions: {
                inlineDynamicImports: true,
                output: {
                    manualChunks: () => "index.js",
                },
            },
        }
        : {
            lib: {
                entry: resolve(__dirname, './preload/preload.ts'),
                name: 'myLib',
                formats: ['umd'],
                fileName: () => `preload.js`
            },
        }

    return {
        publicDir: 'public',
        server: {
            watch: {
                ignored: ['!**/node_modules/your-package-name/**']
            }
        },
        plugins: [
            react(),
            viteSingleFile(),
            createHtmlPlugin(),
        ],
        build: {
            ...buildConfig as BuildOptions,
            emptyOutDir: false,
        }
    }
})