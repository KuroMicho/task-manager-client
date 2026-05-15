import "@testing-library/jest-dom";
import { TextDecoder, TextEncoder } from "node:util";

// 🚀 1. Polyfills de Node para el navegador (JSDOM)
Object.defineProperties(global, {
  TextEncoder: { value: TextEncoder },
  TextDecoder: { value: TextDecoder },
});