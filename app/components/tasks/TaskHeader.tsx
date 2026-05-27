import { LayoutGrid, Plus } from "lucide-react";

interface TaskHeaderProps {
  onAddTask: () => void;
}

export function TaskHeader({ onAddTask }: TaskHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <LayoutGrid className="text-indigo-600 dark:text-indigo-500" />
          Tablero
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Gestiona tus tareas y colaboraciones en tiempo real.
        </p>
      </div>

      <button
        aria-label="Agregar Tarea"
        className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-colors cursor-pointer"
        onClick={onAddTask}
        role="button"
      >
        <Plus size={20} />
        Agregar Tarea
      </button>
    </div>
  );
}
