import { defineConfig } from "jest";

export default defineConfig({
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "jest-environment-jsdom",
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  moduleNameMapper: {
    // Maneja los alias de React Router (~/)
    "^~/(.*)$": "<rootDir>/app/$1",
    // Ignora los estilos para que no rompan el test
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    // Maneja imports con extensión .js en archivos TS
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
  // Este archivo es el que llevará los polyfills y extensiones de matchers
  setupFilesAfterEnv: ["<rootDir>/app/jest-setup.ts"],

  // LIMITACIÓN ESTRICTA
  roots: ["<rootDir>/app"],

  // Solo busca dentro de carpetas __tests__
  // Eliminamos la coincidencia genérica de *.spec o *.test
  testMatch: ["**/__tests__/**/*.[jt]s?(x)"],

  // Ignora explícitamente la carpeta de Playwright
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/tests/"],
});
