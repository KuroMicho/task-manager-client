import { Link, useSearchParams } from "react-router";

import {
  AlertCircle,
  ArrowRight,
  Inbox,
  Loader2,
  SearchIcon,
} from "lucide-react";

import { useTasksQuery } from "../hooks/useTask";

export default function Search() {
  // 1. Obtenemos los parámetros de la URL (?q=...)
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  // 2. Consumimos los datos desde TanStack Query
  const { data: tasks = [], isLoading, isError } = useTasksQuery();

  // 3. Filtramos localmente (aprovechando la caché de TanStack)
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <header className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center justify-center md:justify-start gap-3">
          <SearchIcon className="text-indigo-600" size={32} />
          Buscador
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
          Encuentra cualquier tarea indexada en el sistema.
        </p>
      </header>

      {/* Input de búsqueda */}
      <div className="relative mb-10 group">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
          <SearchIcon size={20} />
        </div>
        <input
          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-lg"
          onChange={(e) => setSearchParams({ q: e.target.value })}
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
            <>
              <div className="flex justify-between items-center mb-6 px-2">
                <span className="text-sm font-bold uppercase tracking-widest text-slate-400">
                  Resultados encontrados: {filteredTasks.length}
                </span>
              </div>

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
                          task.priority === "high"
                            ? "bg-red-500"
                            : "bg-cyan-500"
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
            </>
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
