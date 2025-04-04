import { defineConfig as defineTestConfig, mergeConfig } from "vitest/config";
import { defineConfig } from "vite";
import { loadEnv } from "vite";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const baseConfig = {
    base: env.VITE_PUBLIC_PATH || "/",
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, "index.html"),
          // hash: resolve(__dirname, "index.hash.html"),
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
  };

  const testConfig = defineTestConfig({
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.js",
      exclude: ["**/e2e/**", "**/*.e2e.spec.js", "**/node_modules/**"],
    },
  });

  // 🔥 항상 테스트 설정 포함
  return mergeConfig(baseConfig, testConfig);
});
