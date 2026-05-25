// @krazimo/next-standards — recommended ESLint preset for Krazimo Next.js projects.
//
// Essentials at `error`, borderlines at `warn`. Wires:
//   - @next/eslint-plugin-next (core-web-vitals)
//   - typescript-eslint strict
//   - eslint-plugin-react + react-hooks recommended-latest
//   - eslint-plugin-jsx-a11y strict
//   - no-restricted-imports for the no-feature-barrel and shared-no-features rules
//   - max-lines cap (warn)
//   - react/no-danger (no dangerouslySetInnerHTML)

import nextPlugin from "@next/eslint-plugin-next";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";

const FEATURE_BARREL_PATTERN = "^@/features/[^/]+(/server)?$";
// Sub-feature barrels: ban @/features/<feature>/<not-a-primitive> as a directory import.
const SUB_FEATURE_BARREL_PATTERN =
  "^@/features/[^/]+/(?!actions|components|hooks|services|lib|types)[^/]+$";

export default [
  {
    name: "krazimo/ignores",
    ignores: ["**/node_modules/**", "**/.next/**", "**/dist/**", "**/coverage/**", "**/*.d.ts"],
  },

  // typescript-eslint strict (non-type-checked variant by default; users can
  // promote to strict-type-checked in their own config by extending it).
  ...tseslint.configs.strict,

  // React + hooks recommended-latest (for React 19+ / Compiler rules).
  {
    name: "krazimo/react",
    files: ["**/*.{ts,tsx,js,jsx}"],
    plugins: { react, "react-hooks": reactHooks },
    settings: { react: { version: "detect" } },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs["recommended-latest"].rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      // Rule 19a — no dangerouslySetInnerHTML, no exceptions.
      "react/no-danger": "error",
      // Intentional pattern: hydration guards (setMounted) and URL-driven state use
      // synchronous setState in effects. This is the standard Next.js pattern for
      // reading localStorage/searchParams after mount.
      "react-hooks/set-state-in-effect": "off",
    },
  },

  // jsx-a11y strict — Rule 16a.
  {
    name: "krazimo/jsx-a11y",
    files: ["**/*.{tsx,jsx}"],
    plugins: { "jsx-a11y": jsxA11y },
    rules: { ...jsxA11y.configs.strict.rules },
  },

  // @next/next core-web-vitals — Rules 12a, 13a.
  {
    name: "krazimo/nextjs",
    files: ["**/*.{ts,tsx,js,jsx}"],
    plugins: { "@next/next": nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "@next/next/no-img-element": "error",
      "@next/next/no-head-element": "error",
      "@next/next/no-page-custom-font": "error",
      "@next/next/no-duplicate-head": "error",
    },
  },

  // File-size cap — Rule 1b (warn / borderline).
  {
    name: "krazimo/file-size",
    files: ["**/*.{ts,tsx,js,jsx}"],
    rules: {
      "max-lines": ["warn", { max: 200, skipBlankLines: true, skipComments: true }],
    },
  },

  // No barrel files in feature roots — Rule 1d (error / essential).
  {
    name: "krazimo/no-feature-barrel",
    files: ["**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              regex: FEATURE_BARREL_PATTERN,
              message:
                "Feature-level barrel imports are forbidden. Import directly from the source file. See docs/01-architecture-and-files.md → Rule 1d.",
            },
            {
              regex: SUB_FEATURE_BARREL_PATTERN,
              message:
                "Sub-feature barrel imports are forbidden. Import from a primitive (actions/components/hooks/services/lib/types) inside the sub-feature, not the sub-feature root. See docs/01-architecture-and-files.md → Rule 1d.",
            },
          ],
        },
      ],
    },
  },

  // shared/ cannot import from features/ — Rule 1e (error / essential).
  {
    name: "krazimo/shared-no-features",
    files: ["src/shared/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/*", "**/features/*"],
              message:
                "shared/ cannot import from features/. Move the code into the feature, or pull the shared piece down into shared/. See docs/01-architecture-and-files.md → Rule 1e.",
            },
          ],
        },
      ],
    },
  },
];
