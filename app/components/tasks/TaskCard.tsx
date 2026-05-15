import { Link } from "react-router";

import { ChevronRight, Clock, MessageSquare } from "lucide-react";

import type { Task } from "../../types/task";

import { getPriorityStyles } from "../../utils/theme-helpers";

interface TaskCardProps {
  task: Task;
}

function getLabelColor(priority: Task["priority"]) {
  switch (priority) {
    case "high":
      return "bg-red-500";
    case "medium":
      return "bg-amber-500";
    case "low":
      return "bg-cyan-500";
  }
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <div className="group flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-indigo-500 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center">
      <div className="flex items-start gap-4">
        {/* Barra lateral de prioridad */}
        <div
          className={`h-12 w-1.5 rounded-full ${getLabelColor(task.priority)}`}
        />

        <div className="flex flex-col">
          <div className="mb-1 flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">
              ID-{task._id.slice(-6)}
            </span>
            <span
              className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase ${getPriorityStyles(
                task.priority,
              )}`}
            >
              {task.priority}
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-400">
            {task.title}
          </h3>

          <div className="mt-2 flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
              <Clock size={14} />
              <span>{new Date(task.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
              <MessageSquare size={14} />
              <span>{task.commentCount || 0} comentarios</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 self-end md:self-center">
        <Link
          className="group/btn flex items-center gap-2 rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-indigo-600 hover:text-white dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-indigo-600"
          to={`/tasks/${task._id}`}
        >
          Ver detalle
          <ChevronRight
            className="transition-transform group-hover/btn:translate-x-1"
            size={16}
          />
        </Link>
      </div>
    </div>
  );
}
