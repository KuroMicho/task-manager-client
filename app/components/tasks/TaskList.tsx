import type { DropResult } from "@hello-pangea/dnd";

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

import type { Task } from "../../@types/task";

import { TaskCard } from "./TaskCard";
import { EmptyState } from "./TaskStates";

interface TaskListProps {
  tasks: Task[];
  onDragEnd: (result: DropResult) => void;
}

export function TaskList({ tasks, onDragEnd }: TaskListProps) {
  if (tasks.length === 0) {
    return <EmptyState />;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="tasks-list">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex flex-col gap-4 rounded-2xl transition-colors duration-200 ${
              snapshot.isDraggingOver
                ? "bg-slate-100/60 dark:bg-slate-900/40"
                : ""
            }`}
          >
            {tasks.map((task, index) => (
              <Draggable draggableId={task._id} index={index} key={task._id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="select-none"
                    style={provided.draggableProps.style}
                  >
                    <TaskCard
                      dragHandleProps={provided.dragHandleProps}
                      isDragging={snapshot.isDragging}
                      task={task}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
