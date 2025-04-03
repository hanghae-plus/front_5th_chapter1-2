import { defineConfig as defineTestConfig, mergeConfig } from "vitest/config";
import { defineConfig } from "vite";
import { resolve } from "path";

function autoImportCreateVNode() {
  const importCode = `import { createVNode } from "@/lib";\n`;
  return {
    name: "auto-import-create-vnode",
    enforce: "pre",
    transform(code, id) {
      if (id.includes("test.jsx")) return null;
      if (!id.endsWith(".jsx")) return null;
      if (code.includes("import { createVNode }")) return null;

      return {
        code: importCode + code,
        map: null,
      };
    },
  };
}

export default mergeConfig(
  defineConfig({
    base: "./",
    esbuild: {
      jsxFactory: "createVNode",
    },
    optimizeDeps: {
      esbuildOptions: {
        jsx: "transform",
        jsxFactory: "createVNode",
      },
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    plugins: [autoImportCreateVNode()],
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, "index.html"),
          hash: resolve(__dirname, "index.hash.html"),
          notFound: resolve(__dirname, "404.html"),
        },
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
