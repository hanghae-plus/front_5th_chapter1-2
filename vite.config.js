import { defineConfig, mergeConfig, loadEnv } from "vite";
import { defineConfig as defineTestConfig } from "vitest/config";

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const baseViteConfig = defineConfig({
    base: env.VITE_BASE_PATH || "/",
    esbuild: {
      jsxFactory: "createVNode",
    },
    optimizeDeps: {
      esbuildOptions: {
        jsx: "transform",
        jsxFactory: "createVNode",
      },
    },
  });

  const testConfig = defineTestConfig({
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.js",
      exclude: ["**/e2e/**", "**/*.e2e.spec.js", "**/node_modules/**"],
    },
  });

  return mergeConfig(baseViteConfig, testConfig);
};
