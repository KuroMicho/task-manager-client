import React from "react";

import { type ToastType, useToastStore } from "../../store/useToastStore";

const loFiStyles: Record<ToastType, string> = {
  success:
    "border-indigo-500 bg-indigo-50/90 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200",
  error:
    "border-red-500 bg-slate-50/90 dark:bg-slate-900/40 text-red-700 dark:text-red-400",
  warning:
    "border-amber-500 bg-amber-50/90 dark:bg-slate-900/40 text-amber-800 dark:text-amber-300",
  info: "border-slate-400 bg-slate-50/90 dark:bg-slate-900/40 text-slate-800 dark:text-slate-300",
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="assertive"
      className="fixed z-50 flex flex-col gap-3 w-full max-w-sm p-4
                 top-0 left-1/2 -translate-x-1/2             /* Mobile: Arriba y centrado */
                 sm:top-auto sm:bottom-5 sm:right-5 sm:left-auto sm:translate-x-0 /* Desktop: Abajo a la derecha */"
      role="live"
    >
      {toasts.map((toast) => (
        <div
          className={`flex items-start justify-between p-3.5 
                     border-2 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)]
                     backdrop-blur-sm transition-all duration-300 transform translate-y-0 
                     animate-fade-in ${loFiStyles[toast.type]}`}
          data-testid={`toast-${toast.type}`}
          key={toast.id}
        >
          <div className="flex gap-2">
            <span className="font-bold text-slate-400 dark:text-slate-600"></span>
            <span className="text-sm font-medium tracking-tight">
              {toast.message}
            </span>
          </div>

          <button
            aria-label="Cerrar notificación"
            className="ml-4 text-xs font-mono tracking-widest uppercase opacity-60 hover:opacity-100 transition-opacity focus:outline-none border border-current px-1.5 py-0.5 rounded"
            onClick={() => removeToast(toast.id)}
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};
