export const getStorageItem = (key: string) => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key);
};

export const setStorageItem = (key: string, value: string) => {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, value);
    }
  } catch (_) {
    return;
  }
};

export const THEME_KEY = "theme";