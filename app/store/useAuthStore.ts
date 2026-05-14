import { create } from "zustand";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null,
  isAuthenticated:
    typeof window !== "undefined" ? !!localStorage.getItem("user") : false,

  setUser: (user) => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      set({ user, isAuthenticated: true });
    } else {
      localStorage.removeItem("user");
      set({ user: null, isAuthenticated: false });
    }
  },

  logout: () => {
    localStorage.removeItem("user");
    set({ user: null, isAuthenticated: false });
  },
}));
