import { defineConfig as defineTestConfig, mergeConfig } from "vitest/config";
import { defineConfig } from "vite";
import path from "path";

export default mergeConfig(
  defineConfig({
    base: process.env.NODE_ENV === "production" ? "/front_5th_chapter1-2/" : "",
    esbuild: {
      jsxFactory: "createVNode",
    },
    build: {
      outDir: "dist",
      assetsDir: "assets",
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, "index.html"),
          hash: path.resolve(__dirname, "index.hash.html"),
        },
      },
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
