import { defineConfig as defineTestConfig, mergeConfig } from "vitest/config";
import { defineConfig } from "vite";
import { resolve } from "path";

export default mergeConfig(
  defineConfig({
    base:
      process.env.NODE_ENV === "production" ? "/front_5th_chapter1-2/" : "/",

    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, "index.html"), // 메인 엔트리 파일
          hash: resolve(__dirname, "index.hash.html"), // 해시 엔트리 파일
          404: resolve(__dirname, "404.html"), // 404 페이지 포함
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
