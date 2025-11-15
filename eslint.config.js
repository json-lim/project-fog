import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default tseslint.config(
  // TypeScript recommended rules (minimal config for Node 16 compatibility)
  ...tseslint.configs.recommended,

  // Prettier integration (disables conflicting rules)
  prettierConfig,

  {
    files: ["**/*.{js,jsx,ts,tsx}"],

    plugins: {
      prettier,
    },

    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    rules: {
      // Prettier as ESLint rule
      "prettier/prettier": "error",

      // TypeScript rules
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "warn",

      // General rules
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },

  {
    // Ignore patterns
    ignores: [
      "node_modules/**",
      "build/**",
      "dist/**",
      ".cache/**",
      "public/build/**",
      "venv/**",
      "**/*.py",
      "**/__pycache__/**",
    ],
  }
);
