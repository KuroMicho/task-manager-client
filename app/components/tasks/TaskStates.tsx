import { AlertCircle, Loader2 } from "lucide-react";

export const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-500">
    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
    <p className="font-medium animate-pulse">
      Sincronizando con TanStack Query...
    </p>
  </div>
);

export const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div className="text-center py-20 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-200 dark:border-red-800/20">
    <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
    <h3 className="text-lg font-bold text-red-900 dark:text-red-400">
      Error de conexión
    </h3>
    <button
      className="mt-4 text-sm font-bold text-indigo-600 underline"
      onClick={onRetry}
    >
      Reintentar
    </button>
  </div>
);

export const EmptyState = () => (
  <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
    <AlertCircle className="mx-auto text-slate-400 mb-4" size={48} />
    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
      No hay tareas aún
    </h3>
  </div>
);
