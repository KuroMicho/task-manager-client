import { useState } from "react";

import { Loader2, Plus, X } from "lucide-react";

import type { SelectOption } from "../ui/Select";

import { useCreateTaskMutation } from "../../hooks/useTask";
import { useTaskStore } from "../../store/useTaskStore";
import { useToastStore } from "../../store/useToastStore";
import Select from "../ui/Select";

export function TaskModal() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");

  // Definimos el arreglo de opciones para la prioridad
  const priorityOptions: SelectOption[] = [
    { value: "low", label: "LOW - Baja (Opcional)" },
    { value: "medium", label: "MID - Media (Semana actual)" },
    { value: "high", label: "HIGH - Alta (Urgente)" },
  ];

  // Sincronización con Zustand
  const isTaskModalOpen = useTaskStore((state) => state.isTaskModalOpen);
  const setTaskModal = useTaskStore((state) => state.setTaskModal);
  const addToast = useToastStore((state) => state.addToast);

  // Mutación de TanStack
  const createTaskMutation = useCreateTaskMutation();

  // Si el store dice que está cerrado, no renderizamos nada
  if (!isTaskModalOpen) return null;

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      // Usamos mutateAsync para esperar el resultado y manejar el cierre/limpieza
      await createTaskMutation.mutateAsync({
        title,
        description,
        priority: priority as any,
      });

      // Limpiar y cerrar
      setTitle("");
      setDescription("");
      setPriority("medium");
      setTaskModal(false);

      addToast("Tarea creada exitosamente", "success");
    } catch (_) {
      addToast("Error al intentar guardar la tarea", "error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-visible animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Plus className="text-indigo-600 dark:text-indigo-500" size={20} />
            Nueva Tarea
          </h2>
          <button
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            onClick={() => setTaskModal(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Formulario */}
        <form className="p-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300"
              htmlFor="task-title"
            >
              Título
            </label>
            <input
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              id="task-title"
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Calificar Laboratorio 1"
              required
              type="text"
              value={title}
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300"
              htmlFor="task-description"
            >
              Descripción
            </label>
            <textarea
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none h-24"
              id="task-description"
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalles de la actividad..."
              value={description}
            />
          </div>

          <Select
            label="Prioridad"
            onChange={(val) => setPriority(val)}
            options={priorityOptions}
            value={priority}
          />

          <div className="flex gap-3 pt-4">
            <button
              className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => setTaskModal(false)}
              type="button"
            >
              Cancelar
            </button>
            <button
              className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 disabled:opacity-70 transition-all flex items-center justify-center gap-2"
              // 💡 Usamos .isPending de la mutación directamente
              disabled={createTaskMutation.isPending}
              type="submit"
            >
              {createTaskMutation.isPending ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Guardar Tarea"
              )}
            </button>
          </div>

          {/* Mostrar error de la mutación */}
          {createTaskMutation.isError && (
            <p className="text-center text-xs text-red-500 font-bold">
              Hubo un error al intentar crear la tarea. Inténtalo de nuevo.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
