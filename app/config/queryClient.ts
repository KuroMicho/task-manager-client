import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Los datos se consideran "frescos" por 5 minutos
      retry: 1,
      refetchOnWindowFocus: false, // Evita peticiones extra al volver a la pestaña
    },
  },
});