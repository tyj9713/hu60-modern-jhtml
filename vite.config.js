import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "es2022",
    cssCodeSplit: false,
    manifest: "manifest.json",
    lib: {
      entry: resolve(import.meta.dirname, "src/app.js"),
      formats: ["es"],
    },
    rollupOptions: {
      output: {
        entryFileNames: "app.min.js",
        chunkFileNames: "chunks/[name]-[hash].js",
        assetFileNames: (assetInfo) =>
          assetInfo.names?.some((name) => name.endsWith(".css"))
            ? "theme.min.css"
            : "assets/[name]-[hash][extname]",
      },
    },
  },
});
