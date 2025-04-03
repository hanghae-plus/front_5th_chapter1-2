import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    jsxFactory: "createVNode",
  },
  optimizeDeps: {
    esbuildOptions: {
      jsx: "transform",
      jsxFactory: "createVNode",
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
    exclude: ["**/e2e/**", "**/*.e2e.spec.js", "**/node_modules/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/**/*.{ts,tsx,js,jsx}"],
    },
  },
});
