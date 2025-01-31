import { defineConfig } from 'vite';
import { viteSingleFile } from "vite-plugin-singlefile"
import { createHtmlPlugin } from "vite-plugin-html"

export default defineConfig({
  base: "/scramble",
  plugins: [
    viteSingleFile({
      removeViteModuleLoader: true,
    }),
    createHtmlPlugin({
      minify: true,
    }),
  ],
  build: {
    modulePreload: false,
    cssCodeSplit: false,
    assetsInlineLimit: Infinity,
  },
});
