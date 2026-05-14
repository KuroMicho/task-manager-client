import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowLeft,
  Clock,
  Loader2,
  MessageSquare,
  Send,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";

import InviteModal from "../components/InviteModal";
import { socket } from "../config/socket"; // Importamos el singleton del socket
import {
  useAddCommentMutation,
  useDeleteCommentMutation,
  useDeleteTaskMutation,
  useTaskDetailQuery,
} from "../hooks/useTask";
import { getPriorityStyles } from "../utils/theme-helpers";

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState("");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // 🚀 TANSTACK QUERIES & MUTATIONS
  const { data: task, isLoading, isError } = useTaskDetailQuery(id!);
  const deleteTaskMutation = useDeleteTaskMutation();
  const addCommentMutation = useAddCommentMutation(id!);
  const deleteCommentMutation = useDeleteCommentMutation(id!);

  // 🔌 LÓGICA DE SOCKETS (Sincronización con la caché de TanStack)
  useEffect(() => {
    if (id) {
      socket.connect();
      socket.emit("join_task", id);

      // Cuando llega un comentario: Actualizamos la caché manualmente
      socket.on("receive_comment", (newComment) => {
        queryClient.setQueryData(["task", id], (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            comments: [...(oldData.comments || []), newComment],
          };
        });
      });

      // Cuando se borra un comentario: Filtramos la caché manualmente
      socket.on("comment_deleted", (commentId) => {
        queryClient.setQueryData(["task", id], (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            comments: oldData.comments.filter((c: any) => c._id !== commentId),
          };
        });
      });

      return () => {
        socket.off("receive_comment");
        socket.off("comment_deleted");
        socket.emit("leave_task", id);
        socket.disconnect();
      };
    }
  }, [id, queryClient]);

  // Manejadores de acciones
  const handleSendComment = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await addCommentMutation.mutateAsync(commentText);
      setCommentText("");
    } catch (error) {
      console.error("Error al enviar comentario");
    }
  };

  const handleDeleteTask = async () => {
    if (!window.confirm("¿Estás seguro de eliminar esta tarea?")) return;

    try {
      await deleteTaskMutation.mutateAsync(id!);
      navigate("/tasks");
    } catch (error) {
      alert("Error al eliminar la tarea");
    }
  };

  // ESTADOS DE CARGA Y ERROR
  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-500">
        <Loader2 className="animate-spin text-indigo-500" size={40} />
        <p className="animate-pulse font-medium">
          Sincronizando detalles del proyecto...
        </p>
      </div>
    );

  if (isError || !task)
    return (
      <div className="text-center py-20">
        <AlertTriangle className="mx-auto text-amber-500 mb-4" size={48} />
        <h2 className="text-2xl font-bold dark:text-white">
          Tarea no encontrada
        </h2>
        <button
          className="text-indigo-500 mt-4 font-bold"
          onClick={() => navigate("/tasks")}
        >
          ← Volver al tablero
        </button>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
      {/* Navegación y Acciones */}
      <div className="flex justify-between items-center mb-8">
        <button
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 group"
          onClick={() => navigate("/tasks")}
        >
          <ArrowLeft
            className="group-hover:-translate-x-1 transition-transform"
            size={18}
          />
          Volver al tablero
        </button>

        <div className="flex gap-2">
          <button
            className="flex items-center gap-2 text-sm font-bold bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-all"
            onClick={() => setIsInviteModalOpen(true)}
          >
            <UserPlus size={18} /> Invitar
          </button>

          <button
            className="flex items-center gap-2 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 px-4 py-2 rounded-xl transition-all disabled:opacity-50"
            disabled={deleteTaskMutation.isPending}
            onClick={handleDeleteTask}
          >
            {deleteTaskMutation.isPending ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Trash2 size={18} />
            )}
            Eliminar
          </button>
        </div>
      </div>

      {/* Card Principal */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mb-8">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getPriorityStyles(task.priority)}`}
            >
              PRIORIDAD {task.priority}
            </span>
            <span className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
              <Clock size={14} /> Creado el{" "}
              {new Date(task.createdAt).toLocaleDateString()}
            </span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">
            {task.title}
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
              {task.description || "Sin descripción proporcionada."}
            </p>
          </div>
        </div>
      </div>

      {/* MIEMBROS DEL EQUIPO */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
          <Users className="text-indigo-500" /> Miembros del Equipo
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {/* Dueño de la tarea */}
          <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
            <div className="w-10 h-10 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/20">
              {task.user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate flex items-center gap-1">
                {task.user?.name}
                <ShieldCheck className="text-indigo-500" size={14} />
              </p>
              <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-tighter">
                Owner
              </p>
            </div>
          </div>

          {/* Colaboradores invitados */}
          {task.team?.map((member: any) => (
            <div
              className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800"
              key={member._id}
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-sm border border-slate-200 dark:border-slate-700">
                {member.name?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {member.name}
                </p>
                <p className="text-[10px] text-slate-400 font-medium uppercase">
                  Colaborador
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECCIÓN DE COMENTARIOS */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="text-indigo-500" /> Discusión del Equipo
        </h3>

        <div className="space-y-4">
          {task.comments && task.comments.length > 0 ? (
            task.comments.map((comment: any) => (
              <div
                className="group bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex justify-between items-start"
                key={comment._id}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-indigo-600 text-sm">
                      {comment.user?.name}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase">
                      {new Date(comment.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-sm">
                    {comment.content}
                  </p>
                </div>

                <button
                  className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 rounded-lg transition-all"
                  onClick={() => deleteCommentMutation.mutate(comment._id)}
                >
                  {deleteCommentMutation.isPending ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <X size={16} />
                  )}
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400">
              No hay comentarios todavía. ¡Sé el primero en escribir!
            </div>
          )}
        </div>

        {/* Formulario de Comentario */}
        <form className="relative mt-6" onSubmit={handleSendComment}>
          <input
            className="w-full pl-6 pr-14 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
            disabled={addCommentMutation.isPending}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={
              addCommentMutation.isPending
                ? "Enviando..."
                : "Escribe un mensaje al equipo..."
            }
            type="text"
            value={commentText}
          />
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 disabled:opacity-50"
            disabled={addCommentMutation.isPending}
            type="submit"
          >
            {addCommentMutation.isPending ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Send size={20} />
            )}
          </button>
        </form>
      </div>

      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        taskId={id!}
      />
    </div>
  );
}
