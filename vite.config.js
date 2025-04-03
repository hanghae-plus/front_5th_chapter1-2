import { resolve } from "node:path";
import { defineConfig } from "vite";
import { defineConfig as defineTestConfig, mergeConfig } from "vitest/config";

export default mergeConfig(
  defineConfig({
    base:
      process.env.NODE_ENV === "production" ? "/front_5th_chapter1-2/" : "/",

    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, "index.html"),
          hash: resolve(__dirname, "index.hash.html"),
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
      setupFiles: resolve(__dirname, "src/setupTests.js"),
      exclude: ["**/e2e/**", "**/*.e2e.spec.js", "**/node_modules/**"],
    },
  }),
);
