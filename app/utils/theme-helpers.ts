import { setStorageItem, THEME_KEY } from "./local-storage";

export function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function applyTheme(theme: "light" | "dark") {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", theme);
    setStorageItem(THEME_KEY, theme);
  }
}

// Función auxiliar para los colores de prioridad
export const getPriorityStyles = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400";
    case "medium":
      return "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400";
    default:
      return "bg-cyan-100 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400";
  }
};
