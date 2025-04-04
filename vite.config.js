import { defineConfig as defineTestConfig, mergeConfig } from "vitest/config";
import { defineConfig } from "vite";
import { resolve } from "path";

function createBaseConfig(command) {
  return {
    base: command === "build" ? "/front_5th_chapter1-2/" : "/",
    esbuild: {
      jsxFactory: "createVNode",
    },
    optimizeDeps: {
      esbuildOptions: {
        jsx: "transform",
        jsxFactory: "createVNode",
      },
    },
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, "index.html"),
          hash: resolve(__dirname, "index.hash.html"),
          notFound: resolve(__dirname, "404.html"),
        },
      },
    },
  };
}

const testConfig = defineTestConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
    exclude: ["**/e2e/**", "**/*.e2e.spec.js", "**/node_modules/**"],
  },
});

export default defineConfig(({ command }) => {
  const baseConfig = createBaseConfig(command);
  return mergeConfig(baseConfig, testConfig);
});
