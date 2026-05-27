import { useSearchParams } from "react-router";

import { type DropResult } from "@hello-pangea/dnd";

import { TaskModal } from "../components/tasks";
import {
  ErrorState,
  LoadingState,
  TaskHeader,
  TaskList,
} from "../components/tasks";
import { TaskFilters } from "../components/tasks/TaskFilters";
import { useReorderTasksMutation, useTasksQuery } from "../hooks/useTask";
import { useTaskStore } from "../store/useTaskStore";

export default function TasksPage() {
  // Zustand global state hooks
  const setTaskModal = useTaskStore((state) => state.setTaskModal);
  const [searchParams] = useSearchParams(); // Hook para escuchar los cambios de los filtros

  // TanStack Query hooks
  const { data: tasks = [], isError, isLoading, refetch } = useTasksQuery();
  const reorderMutation = useReorderTasksMutation();

  const filterQuery = searchParams.get("q")?.toLowerCase() || "";
  const filterPriority = searchParams.get("priority") || "all";
  const rawCompleted = searchParams.get("completed");

  const filterCompleted: boolean | "all" =
    rawCompleted === "true" ? true : rawCompleted === "false" ? false : "all";

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(filterQuery);
    const matchesPriority =
      filterPriority === "all" || task.priority === filterPriority;
    const matchesCompleted =
      filterCompleted === "all" || task.completed === filterCompleted;

    return matchesSearch && matchesPriority && matchesCompleted;
  });

  // Computed/derived state
  const shouldShowTaskList = !isLoading && !isError;

  // Event handlers
  const handleAddTask = () => {
    setTaskModal(true);
  };

  const handleRetry = () => {
    refetch();
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!destination || destination.index === source.index) {
      return;
    }
    const reorderedItems = Array.from(filteredTasks);
    const [removed] = reorderedItems.splice(source.index, 1);
    reorderedItems.splice(destination.index, 0, removed);
    reorderMutation.mutate(reorderedItems);
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
