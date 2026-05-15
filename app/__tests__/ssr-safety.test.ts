/**
 * @jest-environment node
 */
// Jest no cargará JSDOM.
// window y document serán 'undefined' naturalmente.

import { getStorageItem, setStorageItem } from "../utils/local-storage";
import { applyTheme, getSystemTheme } from "../utils/theme-helpers";

describe("SSR Safety (Entorno de Servidor)", () => {
  test("getSystemTheme: debe retornar 'light' cuando no hay window", () => {
    // Al no haber window, debe entrar al primer IF y retornar 'light'
    expect(getSystemTheme()).toBe("light");
  });

  test("applyTheme: no debe fallar si document es undefined", () => {
    expect(() => applyTheme("dark")).not.toThrow();
  });

  test("getStorageItem: debe retornar null si window es undefined", () => {
    expect(getStorageItem("any-key")).toBeNull();
  });

  test("setStorageItem: no debe fallar si window es undefined", () => {
    expect(() => setStorageItem("any-key", "value")).not.toThrow();
  });
});
