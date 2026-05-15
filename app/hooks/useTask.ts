import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import api from "../config/api";
import { sleep } from "../utils/sleep";

export interface Task {
  _id: string;
  user?: {
    _id: string;
    name: string;
    email?: string;
  };
  team?: {
    _id: string;
    name: string;
    email?: string;
  }[];
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  commentCount?: number;
  comments?: any[];
  createdAt: string;
}

export const useTasksQuery = () => {
  return useQuery<Task[]>({
    queryKey: ["tasks"], // Nombre de la caché
    queryFn: async () => {
      const { data } = await api.get("/tasks");
      return data;
    },
  });
};

// Fetch de una tarea por ID
export const useTaskDetailQuery = (id: string) => {
  return useQuery({
    queryKey: ["task", id],
    queryFn: async () => {
      await sleep(1000);
      const { data } = await api.get(`/tasks/${id}`);
      return data;
    },
    enabled: !!id, // Solo se ejecuta si hay un ID
  });
};

// ---------------------------------------------------------
// MUTATIONS (Modificación de datos)
// ---------------------------------------------------------

/** Crear una nueva tarea desde el modal */
export const useCreateTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createTask"],
    mutationFn: (taskData: Partial<Task>) => api.post("/tasks", taskData),
    onSuccess: () => {
      // Forzamos a la lista general a actualizarse
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

/** Eliminar una tarea por completo */
export const useDeleteTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteTask"],
    mutationFn: (id: string) => api.delete(`/tasks/${id}`),
    onSuccess: () => {
      // Al borrar, la lista del tablero debe refrescarse
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

/** Agregar comentario con refresco de caché */
export const useAddCommentMutation = (taskId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["addComment", taskId],
    mutationFn: (content: string) =>
      api.post(`/tasks/${taskId}/comments`, { content, taskId }),
    onSuccess: () => {
      // Refrescamos la tarea específica y la lista (por el commentCount)
      // queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

/** Borrar comentario con refresco de caché */
export const useDeleteCommentMutation = (taskId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteComment", taskId],
    mutationFn: (commentId: string) =>
      api.delete(`/tasks/${taskId}/comments/${commentId}`),
    onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

/** Invitar colaborador a una tarea */
export const useInviteMemberMutation = (taskId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["inviteMember", taskId],
    mutationFn: (email: string) =>
      api.post(`/tasks/${taskId}/invite`, { email }),
    onSuccess: () => {
      // Invalidamos para que la lista de miembros se actualice si la muestras en TaskDetail
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
    },
  });
};
