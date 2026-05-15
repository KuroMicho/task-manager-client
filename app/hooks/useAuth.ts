import { useMutation, useQuery } from "@tanstack/react-query";

import api from "../config/api";
import { useAuthStore } from "../store/useAuthStore";

// 1. Hook para verificar sesión (checkAuth)
export const useCheckAuth = () => {
  const setUser = useAuthStore((s) => s.setUser);
  return useQuery({
    queryKey: ["auth-me"],
    queryFn: async () => {
      const { data } = await api.get("/auth/me");
      setUser(data); // Sincronizamos con Zustand
      return data;
    },
    retry: false,
    staleTime: Infinity, // Solo lo pedimos una vez o cuando expire
  });
};

// 2. Hook para Login
export const useLoginMutation = () => {
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: (credentials: any) => api.post("/auth/login", credentials),
    onSuccess: ({ data }) => {
      setUser(data);
    },
  });
};

// 3. Hook para Registro
export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: (credentials: any) => api.post("/auth/register", credentials),
    onSuccess: ({ data }) => {
      console.log("Registro exitoso", data);
    },
  });
};

// 4. Hook para Logout
export const useLogoutMutation = () => {
  const logoutStore = useAuthStore((s) => s.logout);
  return useMutation({
    mutationFn: () => api.post("/auth/logout"),
    onSettled: () => {
      logoutStore(); // Limpiamos Zustand pase lo que pase
    },
  });
};
