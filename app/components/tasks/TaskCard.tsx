import { memo, useMemo } from "react";
import { Link } from "react-router";

import { ChevronRight, Clock, GripVertical, MessageSquare } from "lucide-react";

import type { Task } from "../../@types/task";

import { getPriorityStyles } from "../../utils/theme-helpers";

interface TaskCardProps {
  task: Task;
  dragHandleProps: any;
  isDragging: boolean;
}

const PRIORITY_LABEL_COLORS: Record<Task["priority"], string> = {
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-cyan-500",
};

export const TaskCard = memo(function TaskCard({
  task,
  dragHandleProps,
  isDragging,
}: TaskCardProps) {
  const formattedDate = useMemo(() => {
    return new Date(task.createdAt).toLocaleDateString();
  }, [task.createdAt]);

  return (
    <div
      className={`group flex flex-col gap-4 rounded-2xl border bg-white p-5 pl-3 shadow-sm transition-colors duration-200 md:flex-row md:items-center md:justify-between w-full min-w-0 ${
        isDragging
          ? "border-indigo-500 shadow-xl ring-4 ring-indigo-500/5 bg-slate-50/80 dark:bg-slate-900/90 scale-[1.01]"
          : "border-slate-200 hover:border-indigo-500 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
      }`}
    >
      <div className="flex items-start gap-3 flex-1 min-w-0 w-full">
        <div
          {...dragHandleProps}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-grab active:cursor-grabbing p-1 shrink-0 mt-0.5"
          title="Arrastrar para reordenar"
        >
          <GripVertical size={20} />
        </div>

        <div
          className={`h-12 w-1.5 shrink-0 rounded-full ${PRIORITY_LABEL_COLORS[task.priority]}`}
        />

        <div className="min-w-0 flex-1 w-full">
          <div className="mb-1 flex items-center gap-3 flex-wrap">
            <span className="font-mono text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">
              ID-{task._id.slice(-6)}
            </span>
            <span
              className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase ${getPriorityStyles(task.priority)}`}
            >
              {task.priority}
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-400 wrap-break-word line-clamp-2 md:line-clamp-1">
            {task.title}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <Clock size={14} />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <MessageSquare size={14} />
              <span>{task.commentCount || 0} comentarios</span>
            </div>
          </div>
        </div>
      </div>

      <Link
        className="group/btn flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-indigo-600 hover:text-white dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-indigo-600 w-full md:w-auto shrink-0 transition-all self-stretch md:self-center"
        to={`/tasks/${task._id}`}
      >
        Ver detalle
        <ChevronRight
          className="transition-transform group-hover/btn:translate-x-1"
          size={16}
        />
      </Link>
    </div>
  );
});
