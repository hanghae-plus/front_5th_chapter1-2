import { defineConfig as defineTestConfig, mergeConfig } from "vitest/config";
import { defineConfig, loadEnv } from "vite";
import { resolve } from "path";

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return mergeConfig(
    defineConfig({
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
      base: env.VITE_BASE_URL,
      build: {
        rollupOptions: {
          input: {
            main: resolve(__dirname, "index.html"),
            hash: resolve(__dirname, "index.hash.html"),
          },
        },
      },
    }),
  );
};
