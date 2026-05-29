import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import api from "../config/api";
import { useToastStore } from "../store/useToastStore";
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
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data } = await api.get("/tasks");
      return data;
    },
  });
};

export const useTaskDetailQuery = (id: string) => {
  return useQuery({
    queryKey: ["task", id],
    queryFn: async () => {
      await sleep(1000);
      const { data } = await api.get(`/tasks/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

/** Crear una nueva tarea desde el modal */
export const useCreateTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createTask"],
    mutationFn: (taskData: Partial<Task>) => api.post("/tasks", taskData),
    onSuccess: () => {
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
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

/** Drag and drop tareas */
export const useReorderTasksMutation = () => {
  const addToast = useToastStore((state) => state.addToast);
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["tasks-reorder"],
    mutationFn: async (reorderedTasks: Task[]) => {
      const idsOrder = reorderedTasks.map((task) => task._id);
      const { data } = await api.post("/tasks/reorder", { idsOrder });
      return data;
    },
    onMutate: async (reorderedTasks) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

      queryClient.setQueryData(["tasks"], () => reorderedTasks);

      return { previousTasks };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
        addToast("Error al reordenar", "error");
      }
    },
    onSuccess: (data, reorderedTasks) => {
      queryClient.setQueryData(["tasks"], () => reorderedTasks);
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
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
    },
  });
};
