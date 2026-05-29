import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";

import { type DropResult } from "@hello-pangea/dnd";

import {
  ErrorState,
  LoadingState,
  TaskHeader,
  TaskList,
  TaskModal,
} from "../components/tasks";
import { TaskFilters } from "../components/tasks/TaskFilters";
import { useReorderTasksMutation, useTasksQuery } from "../hooks/useTask";
import { useTaskStore } from "../store/useTaskStore";

export default function TasksPage() {
  const setTaskModal = useTaskStore((state) => state.setTaskModal);
  const [searchParams] = useSearchParams();

  const { data: tasks = [], isError, isLoading, refetch } = useTasksQuery();
  const reorderMutation = useReorderTasksMutation();

  const [localTasks, setLocalTasks] = useState<any[] | null>(null);

  const currentTasks = localTasks !== null ? localTasks : tasks;

  if (
    localTasks !== null &&
    tasks.length !== localTasks.length &&
    !reorderMutation.isPending
  ) {
    setLocalTasks(null);
  }

  const filterQuery = searchParams.get("q")?.toLowerCase() || "";
  const filterPriority = searchParams.get("priority") || "all";
  const rawCompleted = searchParams.get("completed");

  const filterCompleted: boolean | "all" =
    rawCompleted === "true" ? true : rawCompleted === "false" ? false : "all";

  const filteredTasks = useMemo(() => {
    return currentTasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(filterQuery);
      const matchesPriority =
        filterPriority === "all" || task.priority === filterPriority;
      const matchesCompleted =
        filterCompleted === "all" || task.completed === filterCompleted;

      return matchesSearch && matchesPriority && matchesCompleted;
    });
  }, [currentTasks, filterQuery, filterPriority, filterCompleted]);

  const shouldShowTaskList = !isLoading && !isError;

  const handleAddTask = () => setTaskModal(true);

  const handleRetry = () => {
    setLocalTasks(null);
    refetch();
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    if (!destination || destination.index === source.index) {
      return;
    }

    const totalTasks = Array.from(currentTasks);
    const movedTask = filteredTasks[source.index];
    const targetTask = filteredTasks[destination.index];

    const sourceIndexInTotal = totalTasks.findIndex(
      (t) => t._id === movedTask._id,
    );
    const destinationIndexInTotal = totalTasks.findIndex(
      (t) => t._id === targetTask._id,
    );

    const [removed] = totalTasks.splice(sourceIndexInTotal, 1);
    totalTasks.splice(destinationIndexInTotal, 0, removed);

    setLocalTasks(totalTasks);

    reorderMutation.mutate(totalTasks, {
      onError: () => {
        setLocalTasks(null);
      },
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <TaskHeader onAddTask={handleAddTask} />

      {shouldShowTaskList && <TaskFilters />}

      {isLoading && <LoadingState />}
      {isError && <ErrorState onRetry={handleRetry} />}
      {shouldShowTaskList && (
        <TaskList onDragEnd={onDragEnd} tasks={filteredTasks} />
      )}

      <TaskModal />
    </div>
  );
}
