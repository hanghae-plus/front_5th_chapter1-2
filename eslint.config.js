import globals from "globals";
import pluginJs from "@eslint/js";
import pluginTs from "@typescript-eslint/eslint-plugin";
import parserTs from "@typescript-eslint/parser";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import process from "node:process";

/** @type {import('eslint').Config[]} */
export default [
  {
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: true,
        tsconfigRootDir: process.cwd(),
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@typescript-eslint": pluginTs,
    },
    rules: {
      ...pluginTs.configs.recommended.rules,
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  {
    files: ["**/*.js", "**/*.jsx"],
    ...pluginJs.configs.recommended,
  },
  eslintPluginPrettier,
  eslintConfigPrettier,
];
