import js from "@eslint/js";
import typescript from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import perfectionist from "eslint-plugin-perfectionist";
import globals from "globals";

/**
 * CONFIGURACIÓN DE ESLINT v9
 * Estándar de calidad para React Router v7 y TypeScript
 */
export default [
  // 🚫 1. SECCIÓN DE IGNORADOS
  // Evitamos que el linter pierda tiempo analizando archivos compilados o basura.
  {
    ignores: [
      "build/**", // Salida de producción de React Router
      ".react-router/**", // Cache de desarrollo de v7
      "node_modules/**",
      "public/build/**", // Activos estáticos procesados
      "dist/**",
    ],
  },

  // ⚙️ 2. REGLAS RECOMENDADAS DE JAVASCRIPT
  js.configs.recommended,

  // 🛠️ 3. CONFIGURACIÓN PRINCIPAL (TS + REACT)
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser, // Habilita window, document, setTimeout, etc.
        ...globals.node, // Habilita process, __dirname, etc.
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
      react: react,
      "react-hooks": reactHooks,
      perfectionist: perfectionist,
    },
    rules: {
      // 📝 REGLAS DE REACT (Era React 19)
      ...reactHooks.configs.recommended.rules,
      "react/jsx-uses-react": "off", // No más 'import React' en cada archivo
      "react/react-in-jsx-scope": "off", // Gracias al compilador de React 19

      // 🏛️ LÓGICA DE IMPORTACIONES (Plugin: Perfectionist)
      // Mantiene los imports ordenados por tipo y alfabéticamente.
      "perfectionist/sort-imports": [
        "error",
        {
          type: "alphabetical",
          order: "asc",
          groups: [
            "react",
            "type-import",
            ["value-builtin", "value-external"],
            "type-internal",
            "value-internal",
            ["type-parent", "type-sibling", "type-index"],
            ["value-parent", "value-sibling", "value-index"],
            "unknown",
          ],
          customGroups: [
            {
              groupName: "react",
              elementNamePattern: ["^react$", "^react-.+"],
            },
          ],
          newlinesBetween: 1, // Deja un espacio entre grupos para mayor legibilidad
        },
      ],

      // 🏷️ ESTÉTICA DE COMPONENTES (JSX Props)
      // Ordena las props de los componentes (ej. <button className="" onClick="" />)
      // ¡Mucho más fácil encontrar una prop en componentes grandes!
      "perfectionist/sort-jsx-props": [
        "error",
        {
          type: "alphabetical",
          order: "asc",
          ignoreCase: true,
        },
      ],

      // 📤 ORDEN DE EXPORTACIONES
      "perfectionist/sort-exports": [
        "error",
        { type: "alphabetical", order: "asc" },
      ],

      // 📦 ORDEN DE IMPORTACIONES NOMBRADAS
      // Ej: import { Button, Card, Input } from './components'
      "perfectionist/sort-named-imports": [
        "error",
        { type: "alphabetical", order: "asc" },
      ],

      // 🧹 LIMPIEZA DE CÓDIGO (Smart Unused Vars)
      "no-unused-vars": "off", // Apagamos la de JS porque choca con TS
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_", // Ignora argumentos que empiecen con _ (ej. _req)
          varsIgnorePattern: "^_", // Ignora variables que empiecen con _
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // 🚨 SEGURIDAD Y LOGS
      "no-console": ["warn", { allow: ["warn", "error"] }], // Evita dejar console.log en producción
    },
  },
];
