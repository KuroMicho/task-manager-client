import type { Task } from "../../types/task";

import { TaskCard } from "./TaskCard";
import { EmptyState } from "./TaskStates";

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid gap-4 animate-in fade-in duration-500">
      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} />
      ))}
    </div>
  );
}
