import { useState } from "react";
import { useSearchParams } from "react-router";

import { Search, SlidersHorizontal, X } from "lucide-react";

// ==========================================
// CONSTANTES DE DISEÑO
// ==========================================
const INPUT_STYLES =
  "w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm transition-all placeholder:text-slate-400";

const BADGE_CONTAINER_STYLES =
  "flex gap-1 bg-slate-50 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800/40 w-full lg:w-auto";

const BADGE_LABEL_STYLES =
  "font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-[10px] select-none shrink-0";

// ==========================================
// INTERFACES
// ==========================================
interface FilterSelectorsProps {
  currentPriority: string;
  currentCompleted: string;
  onUpdate: (key: string, value: string) => void;
}

export function TaskFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Estado derivado de la URL
  const search = searchParams.get("q") || "";
  const priority = searchParams.get("priority") || "all";
  const completed = searchParams.get("completed") || "all";
  const hasActiveFilters =
    search !== "" || priority !== "all" || completed !== "all";

  // Mutador de filtros declarativo
  const handleUpdateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === "all") {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const handleClearFilters = () => setSearchParams({});
  const handleTogglePersiana = () => setShowMobileFilters((prev) => !prev);

  return (
    <div className="mb-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-4 transition-all duration-300">
      {/* 1. BARRA DE CONTROL SUPERIOR */}
      <div className="flex gap-2.5 w-full items-center">
        <div className="relative flex-1 group">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none"
            size={16}
          />
          <input
            className={INPUT_STYLES}
            onChange={(e) => handleUpdateFilter("q", e.target.value)}
            placeholder="Filtrar por título..."
            type="text"
            value={search}
          />
        </div>

        {hasActiveFilters && (
          <button
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/5 justify-center transition-all cursor-pointer shrink-0 animate-in fade-in duration-200"
            onClick={handleClearFilters}
          >
            <X size={14} />
            <span className="hidden sm:inline">Limpiar</span>
          </button>
        )}

        {/* Botón Gatillo (Visible únicamente en pantallas menores a LG) */}
        <button
          className={`lg:hidden flex items-center justify-center p-2.5 rounded-xl border transition-all cursor-pointer ${
            showMobileFilters
              ? "bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/30 dark:border-indigo-800/60 dark:text-indigo-400"
              : "bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400"
          }`}
          onClick={handleTogglePersiana}
        >
          <SlidersHorizontal size={14} />
        </button>
      </div>

      {/* 2. PERSIANA VERTICAL EN MÓVILES Y TABLETS (< lg) */}
      {showMobileFilters && (
        <div className="lg:hidden flex flex-col gap-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-[11px] animate-in slide-in-from-top-2 duration-200">
          <FilterSelectors
            currentCompleted={completed}
            currentPriority={priority}
            onUpdate={handleUpdateFilter}
          />
        </div>
      )}

      {/* 3. DISTRIBUCIÓN HORIZONTAL EN PANTALLAS GRANDES (lg+) */}
      <div className="hidden lg:flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800/60 text-[11px]">
        <FilterSelectors
          currentCompleted={completed}
          currentPriority={priority}
          onUpdate={handleUpdateFilter}
        />
      </div>
    </div>
  );
}

// ==========================================
// SUB-COMPONENTE ATÓMICO (REUTILIZABLE)
// ==========================================
function FilterSelectors({
  currentPriority,
  currentCompleted,
  onUpdate,
}: FilterSelectorsProps) {
  const priorities = ["all", "high", "medium", "low"];
  const completedOptions = [
    { id: "all", label: "Todas" },
    { id: "false", label: "Pendientes" },
    { id: "true", label: "Completas" },
  ];

  const getBadgeClass = (isActive: boolean) =>
    `px-2.5 py-1 rounded-lg font-black uppercase tracking-wider text-[10px] transition-all cursor-pointer flex-1 lg:flex-initial text-center ${
      isActive
        ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs"
        : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
    }`;

  return (
    <>
      {/* Grupo Prioridad */}
      <div className="flex flex-col items-start gap-2 w-full lg:w-auto lg:flex-row lg:items-center">
        <span className={BADGE_LABEL_STYLES}>Prioridad</span>
        <div className={BADGE_CONTAINER_STYLES}>
          {priorities.map((p) => (
            <button
              className={getBadgeClass(currentPriority === p)}
              key={p}
              onClick={() => onUpdate("priority", p)}
            >
              {p === "all" ? "Todas" : p}
            </button>
          ))}
        </div>
      </div>

      {/* Grupo Estado */}
      <div className="flex flex-col items-start gap-2 w-full lg:w-auto lg:flex-row lg:items-center">
        <span className={BADGE_LABEL_STYLES}>Estado</span>
        <div className={BADGE_CONTAINER_STYLES}>
          {completedOptions.map((s) => (
            <button
              className={getBadgeClass(currentCompleted === s.id)}
              key={s.id}
              onClick={() => onUpdate("completed", s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
