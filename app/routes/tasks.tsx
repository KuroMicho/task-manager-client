import AddTaskModal from "../components/AddTaskModal";
import {
  ErrorState,
  LoadingState,
  TaskHeader,
  TaskList,
} from "../components/tasks";
import { useTasksQuery } from "../hooks/useTask";
import { useTaskStore } from "../store/useTaskStore";

export default function TasksPage() {
  const { data: tasks = [], isError, isLoading, refetch } = useTasksQuery();
  const setAddTaskModal = useTaskStore((state) => state.setAddTaskModal);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <TaskHeader onAddTask={() => setAddTaskModal(true)} />

      {isLoading && <LoadingState />}
      {isError && <ErrorState onRetry={() => refetch()} />}
      {!isLoading && !isError && <TaskList tasks={tasks} />}

      <AddTaskModal />
    </div>
  );
}
