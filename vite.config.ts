import * as path from 'path';
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { internalIpV4 } from "internal-ip";

/*
// @ts-expect-error process is a nodejs global
*/
const mobile = !!/android|ios/.exec(process.env.TAURI_ENV_PLATFORM);

// https://vitejs.dev/config/
export default defineConfig(async () => ({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    plugins: [svelte()],

    // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
    //
    // 1. prevent vite from obscuring rust errors
    clearScreen: false,
    // 2. tauri expects a fixed port, fail if that port is not available
    server: {
        port: 1440,
        strictPort: true,
        host: mobile
            ? "0.0.0.0" : false,
        hmr: mobile
            ? {
                protocol: "ws",
                host: await internalIpV4(),
                port: 1441,
            }
            : undefined,
            watch: {
                // 3. tell vite to ignore watching `src-tauri`
                ignored: ["**/src-tauri/**"],
            },
    },
    build: {
        // file path for the CAPACITOR build output directory
        outDir: "build",
    },
}));
