import path from "path";
import { defineConfig } from "vite";
import { defineConfig as defineTestConfig, mergeConfig } from "vitest/config";
// import { ssgCopyHTML } from "./plugins/ssg-copy";

// const isCI = process.env.CI === "true";

export default mergeConfig(
  defineConfig({
    // base: isCI ? "/" : "/front_5th_chapter1-2/",
    esbuild: {
      jsxFactory: "createVNode",
    },
    optimizeDeps: {
      esbuildOptions: {
        jsx: "transform",
        jsxFactory: "createVNode",
      },
    },
    // plugins: isCI ? undefined : [ssgCopyHTML(["login", "profile"])],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
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
