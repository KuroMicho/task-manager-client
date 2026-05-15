import { jest } from "@jest/globals";

import {
  getStorageItem,
  setStorageItem,
  THEME_KEY,
} from "../utils/local-storage";
import {
  applyTheme,
  getPriorityStyles,
  getSystemTheme,
} from "../utils/theme-helpers";

// Mantenemos el mock de matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe("theme-helpers coverage", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  test("getPriorityStyles: debe retornar las clases correctas", () => {
    expect(getPriorityStyles("high")).toContain("red-600");
    expect(getPriorityStyles("medium")).toContain("amber-600");
    expect(getPriorityStyles("low")).toContain("cyan-600");
  });

  test("applyTheme: debe persistir el tema en el DOM y en localStorage", () => {
    // ENFOQUE ESM: Verificamos el efecto final, no el espía
    applyTheme("dark");

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");

    const savedTheme = localStorage.getItem(THEME_KEY);
    expect(savedTheme).toBe("dark");
  });

  test("getSystemTheme: debe retornar 'light' si el tema del sistema es 'light'", () => {
    (window.matchMedia as jest.Mock).mockReturnValueOnce({ matches: false });
    expect(getSystemTheme()).toBe("light");
  });

  test("getSystemTheme: debe detectar preferencia del sistema", () => {
    (window.matchMedia as jest.Mock).mockReturnValueOnce({ matches: true });
    expect(getSystemTheme()).toBe("dark");
  });

  test("getStorageItem: debe retornar el valor almacenado correctamente", () => {
    setStorageItem("any-key", "stored-value");
    expect(getStorageItem("any-key")).toBe("stored-value");
  });

  test("setStorageItem: debe entrar al catch si localStorage lanza error", () => {
    // Simulamos que el storage está lleno o bloqueado
    const spy = jest
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("QuotaExceededError");
      });

    // Esto forzará la ejecución del bloque 'catch'
    expect(() => setStorageItem("test", "data")).not.toThrow();

    spy.mockRestore();
  });
});
