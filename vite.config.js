import { defineConfig as defineTestConfig, mergeConfig } from "vitest/config";
import { defineConfig } from "vite";

export default ({ mode }) => {
  const base = mode === "production" ? "/front_5th_chapter1-2/" : "/";

  return mergeConfig(
    defineConfig({
      base,
      esbuild: {
        jsxFactory: "createVNode",
      },
      build: {
        rollupOptions: {
          input: {
            main: "./index.html",
            hash: "./index.hash.html",
            notFound: "./404.html", // 404.html 추가
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
};
