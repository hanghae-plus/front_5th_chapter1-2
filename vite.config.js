import { defineConfig as defineTestConfig, mergeConfig } from "vitest/config";
import { defineConfig } from "vite";
import { BASE_URL } from "./src/utils/baseUrl";
import path from "path";

export default mergeConfig(
  defineConfig({
    esbuild: {
      jsxFactory: "createVNode",
    },
    base: BASE_URL + "/",
    build: {
      rollupOptions: {
        input: {
          history: path.resolve(__dirname, "index.html"),
          hash: path.resolve(__dirname, "index.hash.html"),
          notFound: path.resolve(__dirname, "404.html"),
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
