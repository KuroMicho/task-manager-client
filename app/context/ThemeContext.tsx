import React, { createContext, useContext, useEffect, useState } from "react";

import { getStorageItem, THEME_KEY } from "../utils/local-storage";
import { applyTheme, getSystemTheme } from "../utils/theme-helpers";

type Theme = "light" | "dark";

const ThemeContext = createContext<
  { theme: Theme; toggleTheme: () => void } | undefined
>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Lazy Initializer: Determinamos el tema antes del primer renderizado.
  const [theme, setTheme] = useState<Theme>(() => {
    // Si estamos en el servidor (SSR), usamos un valor por defecto.
    if (typeof window === "undefined") return "light";

    const saved = getStorageItem(THEME_KEY) as Theme;
    return saved || getSystemTheme();
  });

  // Este efecto solo se encarga de sincronizar el atributo del DOM
  // cuando el estado del tema cambia.
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    applyTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme debe usarse dentro de ThemeProvider");
  return context;
};
