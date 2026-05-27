import { Link, useSearchParams } from "react-router";

import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Inbox,
  Loader2,
  SearchIcon,
  TrendingUp,
  Zap,
} from "lucide-react";
import { create } from "zustand";

import { useTasksQuery } from "../hooks/useTask";

interface TaskUIState {
  isTaskModalOpen: boolean;
  searchQuery: string;
  setTaskModal: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
}

export const useTaskStore = create<TaskUIState>((set) => ({
  isTaskModalOpen: false,
  searchQuery: "",
  setTaskModal: (open) => set({ isTaskModalOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));

export default function Search() {
  // React Router and TanStack Query hooks
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: tasks = [], isLoading, isError } = useTasksQuery();

  // Computed/derived state
  const query = searchParams.get("q") || "";
  const normalizedQuery = query.toLowerCase();

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(normalizedQuery),
  );

  // Métricas para los KPIs calculadas dinámicamente en memoria
  const totalTasks = tasks.length;
  const highPriorityCount = tasks.filter(
    (task) => task.priority === "high",
  ).length;
  const matchedCount = query === "" ? 0 : filteredTasks.length;

  const handleQueryChange = (value: string) => {
    setSearchParams(value ? { q: value } : {});
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-10 text-left">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <SearchIcon className="text-indigo-600 dark:text-indigo-500" />
          Buscador
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Encuentra cualquier tarea indexada en el sistema.
        </p>
      </header>

      {/* NUEVO: SECCIÓN DE KPIS (Deshabilitados visualmente en estado de carga o error) */}
      {!isError && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* KPI 1: Total Global */}
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-4 shadow-xs">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400">
              <BarChart3 size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Tareas
              </p>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">
                {isLoading ? "..." : totalTasks}
              </h3>
            </div>
          </div>

          {/* KPI 2: Prioridad Alta */}
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-4 shadow-xs">
            <div className="p-3 bg-red-50 dark:bg-red-500/10 rounded-xl text-red-500 dark:text-red-400">
              <Zap size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Prioridad{" "}
                <TrendingUp className="inline-block ml-0.5 mb-0.5" size={16} />
              </p>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">
                {isLoading ? "..." : highPriorityCount}
              </h3>
            </div>
          </div>

          {/* KPI 3: Coincidencias en Tiempo Real */}
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-4 shadow-xs transition-all duration-300">
            <div
              className={`p-3 rounded-xl transition-colors ${matchedCount > 0 ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-slate-50 dark:bg-slate-800 text-slate-400"}`}
            >
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Coincidencias
              </p>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">
                {isLoading ? "..." : matchedCount}
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* Input de búsqueda */}
      <div className="relative mb-10 group">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
          <SearchIcon size={20} />
        </div>
        <input
          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-lg"
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="¿Qué tarea estás buscando hoy?"
          type="text"
          value={query}
        />
      </div>

      {/* Estado de Carga */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-500">
          <Loader2 className="animate-spin text-indigo-500" size={40} />
          <p className="font-medium animate-pulse">
            Buscando en la base de datos...
          </p>
        </div>
      )}

      {/* Error de Conexión */}
      {isError && (
        <div className="p-6 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-800/20 rounded-2xl flex items-center gap-4 text-red-600 dark:text-red-400">
          <AlertCircle size={24} />
          <p className="font-bold">Hubo un error al sincronizar las tareas.</p>
        </div>
      )}

      {/* Resultados */}
      {!isLoading && !isError && (
        <section className="space-y-3">
          {query === "" ? (
            <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
              <Inbox
                className="mx-auto text-slate-300 dark:text-slate-700 mb-4"
                size={48}
              />
              <p className="text-slate-500 dark:text-slate-400 font-medium italic">
                La barra de búsqueda está esperando tus comandos...
              </p>
            </div>
          ) : filteredTasks.length > 0 ? (
            <div className="grid gap-3">
              {filteredTasks.map((task) => (
                <Link
                  className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex justify-between items-center group hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/5 transition-all"
                  key={task._id}
                  to={`/tasks/${task._id}`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        task.priority === "high" ? "bg-red-500" : "bg-cyan-500"
                      }`}
                    />
                    <span className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {task.title}
                    </span>
                  </div>
                  <ArrowRight
                    className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all"
                    size={20}
                  />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-100/50 dark:bg-slate-800/20 rounded-3xl">
              <p className="text-xl font-bold text-slate-400">
                No hay coincidencias para "
                <span className="text-slate-900 dark:text-white">{query}</span>"
              </p>
              <p className="text-slate-500 text-sm mt-2">
                Intenta con otras palabras clave.
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
