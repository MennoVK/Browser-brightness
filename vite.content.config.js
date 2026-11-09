import { defineConfig } from "vite";

export default defineConfig({
    build: {
        emptyOutDir: false,
        lib: {
            entry: "scripts/content.js",
            formats: ["iife"],
            name: "BrightnessContent",
            fileName: () => "scripts/content.js",
        },
        outDir: "dist",
    },
});
