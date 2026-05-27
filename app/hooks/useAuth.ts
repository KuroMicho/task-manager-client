import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import api from "../config/api";
import { useAuthStore } from "../store/useAuthStore";

interface AuthResponse {
  _id: string;
  email: string;
  name: string;
}

/**
 * 1. Hook para verificar sesión activa (checkAuth)
 * Protege las rutas e inyecta el usuario en Zustand si la cookie es válida.
 */
export const useCheckAuth = () => {
  const setUser = useAuthStore((s) => s.setUser);

  return useQuery<AuthResponse>({
    queryKey: ["auth-me"],
    queryFn: async () => {
      const { data } = await api.get<AuthResponse>("/auth/me");
      setUser(data);
      return data;
    },
    retry: false,
    gcTime: 0,
  });
};

/**
 * 2. Hook para iniciar sesión (Login)
 */
export const useLoginMutation = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["auth-login"],
    mutationFn: async (credentials: Record<string, string>) => {
      const { data } = await api.post<AuthResponse>("/auth/login", credentials);
      return data;
    },
    onSuccess: (data: AuthResponse) => {
      queryClient.setQueryData(["auth-me"], data);
      setUser(data);
    },
  });
};

/**
 * 3. Hook para registro de usuarios (Register)
 */
export const useRegisterMutation = () => {
  return useMutation({
    mutationKey: ["auth-register"],
    mutationFn: async (credentials: Record<string, string>) => {
      const { data } = await api.post("/auth/register", credentials);
      return data;
    },
    onSuccess: () => {},
  });
};

/**
 * 4. Hook para cerrar sesión (Logout)
 * Destruye de forma segura las cookies del server, el caché de TanStack y el estado de Zustand.
 */
export const useLogoutMutation = () => {
  const logoutStore = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["auth-logout"],
    mutationFn: async () => {
      const { data } = await api.post("/auth/logout");
      return data;
    },
    onSettled: () => {
      queryClient.clear();
      logoutStore();
    },
  });
};
