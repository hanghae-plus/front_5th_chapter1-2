import path from "path";
import { defineConfig, loadEnv } from "vite";
import { defineConfig as defineTestConfig, mergeConfig } from "vitest/config";
import { ssgCopyHTML } from "./plugins/ssg-copy";

const isCI = process.env.CI === "true";

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return mergeConfig(
    defineConfig({
      base: env.VITE_BASE_URL,
      esbuild: { jsxFactory: "createVNode" },
      optimizeDeps: {
        esbuildOptions: { jsx: "transform", jsxFactory: "createVNode" },
      },
      plugins: isCI ? undefined : [ssgCopyHTML(["login", "profile"])],
      resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
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
