import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  root: path.resolve(__dirname, "src/main/core"),
  base: "./",
  build: {
    outDir: path.resolve(__dirname, "dist/renderer"),
    emptyOutDir: true,
  },
});
