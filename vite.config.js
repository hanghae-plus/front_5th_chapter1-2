// import { defineConfig as defineTestConfig, mergeConfig } from "vitest/config";
// import { defineConfig } from "vite";

// export default mergeConfig(
//   defineConfig({
//     esbuild: {
//       jsxFactory: "createVNode",
//     },
//     optimizeDeps: {
//       esbuildOptions: {
//         jsx: "transform",
//         jsxFactory: "createVNode",
//       },
//     },
//   }),
//   defineTestConfig({
//     test: {
//       globals: true,
//       environment: "jsdom",
//       setupFiles: "./src/setupTests.js",
//       exclude: ["**/e2e/**", "**/*.e2e.spec.js", "**/node_modules/**"],
//     },
//   }),
// );
import { defineConfig as defineTestConfig, mergeConfig } from "vitest/config";
import { defineConfig } from "vite";
import fs from "fs-extra"; // fs-extra 사용 (더 안정적인 파일 처리)

// 404.html 템플릿
const create404Html = (base) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Redirecting...</title>
    <script>
      (function() {
        // 현재 URL 저장
        const path = window.location.pathname + window.location.search + window.location.hash;
        const baseUrl = '${base}';
        
        // base path를 고려한 경로 저장
        sessionStorage.redirect = path.startsWith(baseUrl) 
          ? path 
          : baseUrl + path.substring(1);

        // 메인 페이지로 리다이렉트
        window.location.replace(
          window.location.origin + baseUrl + 
          (baseUrl.endsWith('/') ? '' : '/')
        );
      })();
    </script>
  </head>
  <body>
    <h1>페이지를 찾을 수 없습니다.</h1>
    <p>메인 페이지로 리다이렉트합니다...</p>
    <script>
      document.body.style.fontFamily = 'Arial, sans-serif';
      document.body.style.textAlign = 'center';
      document.body.style.padding = '50px';
    </script>
  </body>
</html>
`;

export default ({ mode }) => {
  const base = mode === "production" ? "/front_5th_chapter1-2/" : "/";

  return mergeConfig(
    defineConfig({
      base,
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
          output: {
            manualChunks: undefined,
          },
        },
        // 빌드 후 처리
        outDir: "dist",
        emptyOutDir: true,
        // 빌드 완료 후 404.html 생성 및 index.html 수정
        async writeBundle() {
          // 404.html 생성
          await fs.writeFile("dist/404.html", create404Html(base));

          // index.html에 리다이렉트 처리 스크립트 추가
          const indexHtml = await fs.readFile("dist/index.html", "utf-8");
          const updatedIndexHtml = indexHtml.replace(
            "<head>",
            `<head>
    <script>
      (function() {
        // 404 페이지에서 저장된 원래 URL로 리다이렉트
        const redirect = sessionStorage.redirect;
        delete sessionStorage.redirect;
        if (redirect && redirect !== location.href) {
          history.replaceState(null, null, redirect);
        }
      })();
    </script>`,
          );

          await fs.writeFile("dist/index.html", updatedIndexHtml);
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
