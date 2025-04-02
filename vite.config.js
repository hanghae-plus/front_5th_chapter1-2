import { defineConfig as defineTestConfig, mergeConfig } from "vitest/config";
import { defineConfig } from "vite";
import { resolve } from "path";
import { BASE_PATH } from "./src/consts/path";

export default mergeConfig(
  defineConfig({
    base: BASE_PATH + "/",
    build: {
      target: "es2020",
      outDir: "dist",
      rollupOptions: {
        input: {
          main: resolve(__dirname, "index.html"),
          hash: resolve(__dirname, "index.hash.html"),
          notFound: resolve(__dirname, "404.html"),
        },
      },
    },
    esbuild: {
      jsxFactory: "createVNode",
    },
    optimizeDeps: {
      esbuildOptions: {
        jsx: "transform",
        jsxFactory: "createVNode",
      },
    },
  }),
  defineTestConfig({
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.js",
      exclude: ["**/e2e/**", "**/*.e2e.spec.js", "**/node_modules/**"],
    },
  }),
);
