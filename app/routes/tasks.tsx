import { Link } from "react-router";

import {
  AlertCircle,
  ChevronRight,
  Clock,
  LayoutGrid,
  Loader2,
  MessageSquare,
  Plus,
} from "lucide-react";

import AddTaskModal from "../components/AddTaskModal";
import { useTasksQuery } from "../hooks/useTask";
import { useTaskStore } from "../store/useTaskStore";
import { getPriorityStyles } from "../utils/theme-helpers";

export default function Tasks() {
  // 1. Estados de Datos (TanStack)
  const { data: tasks = [], isLoading, isError, refetch } = useTasksQuery();

  // 2. Estados de UI (Zustand)
  const setAddTaskModal = useTaskStore((state) => state.setAddTaskModal);

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header de la sección */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <LayoutGrid className="text-indigo-600 dark:text-indigo-500" />
            Tablero de Proyectos
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Gestiona tus tareas y colaboraciones en tiempo real.
          </p>
        </div>

        <button
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none"
          onClick={() => setAddTaskModal(true)}
        >
          <Plus size={20} />
          Nueva Tarea
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-500">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <p className="font-medium animate-pulse">
            Sincronizando con TanStack Query...
          </p>
        </div>
      ) : isError ? (
        <div className="text-center py-20 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-200 dark:border-red-800/20">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h3 className="text-lg font-bold text-red-900 dark:text-red-400">
            Error de conexión
          </h3>
          <button
            className="mt-4 text-sm font-bold text-indigo-600 underline"
            onClick={() => refetch()}
          >
            Reintentar
          </button>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
          <AlertCircle className="mx-auto text-slate-400 mb-4" size={48} />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No hay tareas aún
          </h3>
        </div>
      ) : (
        <div className="grid gap-4 animate-in fade-in duration-500">
          {tasks.map((t) => (
            <div
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-indigo-500 shadow-sm hover:shadow-md"
              key={t._id}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-1.5 h-12 rounded-full ${t.priority === "high" ? "bg-red-500" : t.priority === "medium" ? "bg-amber-500" : "bg-cyan-500"}`}
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      ID-{t._id.slice(-6)}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-md ${getPriorityStyles(t.priority)}`}
                    >
                      {t.priority}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {t.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm">
                      <Clock size={14} />
                      <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm">
                      <MessageSquare size={14} />
                      <span>{t.commentCount || 0} comentarios</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 self-end md:self-center">
                <Link
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-bold hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 group/btn"
                  to={`/tasks/${t._id}`}
                >
                  Ver detalle
                  <ChevronRight
                    className="group-hover/btn:translate-x-1 transition-transform"
                    size={16}
                  />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      <AddTaskModal />
    </div>
  );
}
