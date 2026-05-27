import type React from "react";
import { MemoryRouter } from "react-router";

import type { DropResult } from "@hello-pangea/dnd";

import { jest } from "@jest/globals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { Task } from "../@types/task";

import {
  EmptyState,
  ErrorState,
  LoadingState,
  TaskCard,
  TaskHeader,
  TaskList,
} from "../components/tasks";

// Setup para componentes que usen Hooks de Query
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>,
  );
};

const createMockTask = (overrides: Partial<Task> = {}): Task => ({
  _id: "1",
  title: "Tarea de prueba",
  priority: "low",
  createdAt: new Date().toISOString(),
  commentCount: 0,
  ...overrides,
});

describe("Task Components - Full Coverage", () => {
  // 1. Cobertura para TaskHeader
  test("TaskHeader: debe mostrar el título y el contador correctamente", () => {
    render(<TaskHeader onAddTask={() => {}} />);
    expect(screen.getByText("Tablero")).toBeInTheDocument();
    expect(
      screen.getByText("Gestiona tus tareas y colaboraciones en tiempo real."),
    ).toBeInTheDocument();
  });

  // 2. Cobertura para TaskList
  test('TaskList: debe mostrar el mensaje de "No hay tareas aún" cuando el array está vacío', () => {
    renderWithProviders(
      <TaskList
        onDragEnd={function (_: DropResult): void {
          throw new Error("Function not implemented.");
        }}
        tasks={[]}
      />,
    );
    expect(screen.getByText(/No hay tareas aún/i)).toBeInTheDocument();
  });

  test("Debe mostrar la lista de tareas correctamente", async () => {
    const mockTasks: Task[] = [
      {
        _id: "123456",
        title: "Aprender Testing",
        priority: "high",
        createdAt: new Date().toISOString(),
        commentCount: 0,
      },
    ];

    renderWithProviders(
      <TaskList
        onDragEnd={function (_: DropResult): void {
          throw new Error("Function not implemented.");
        }}
        tasks={mockTasks}
      />,
    );

    // Esto imprimirá el HTML actual en la terminal
    // screen.debug();

    // Verificamos que se renderice el título
    const taskTitle = await screen.findByText(/Aprender Testing/i);
    expect(taskTitle).toBeInTheDocument();
  });

  // 2. Cobertura para TaskCard
  // 2. Usamos test.each para probar múltiples casos sin duplicar lógica
  test.each([
    { priority: "high", expectedClass: "text-red-600", title: "Tarea Urgente" },
    {
      priority: "medium",
      expectedClass: "text-amber-600",
      title: "Tarea Media",
    },
    { priority: "low", expectedClass: "text-cyan-600", title: "Tarea Normal" },
  ] as const)(
    "Debe aplicar el estilo correcto para la prioridad: $priority",
    ({ priority, expectedClass, title }) => {
      const task = createMockTask({ title, priority });

      renderWithProviders(
        <TaskCard dragHandleProps={undefined} isDragging={false} task={task} />,
      );

      expect(screen.getByText(title)).toBeInTheDocument();

      // Si tu TaskCard tiene un badge que muestra la prioridad, es mejor buscarlo así:
      const badge = screen.getByText(new RegExp(priority, "i"));

      expect(badge).toHaveClass(expectedClass);
    },
  );

  // 3. Cobertura para TaskStates
  test("TaskStates: debe renderizar todos los estados posibles", () => {
    const { rerender } = render(<EmptyState />);
    expect(screen.getByText(/No hay tareas aún/i)).toBeInTheDocument();

    rerender(<LoadingState />);
    expect(
      screen.getByText(/Sincronizando con TanStack Query.../i),
    ).toBeInTheDocument();

    rerender(<ErrorState onRetry={() => {}} />);

    expect(screen.getByText(/Error de conexión/i)).toBeInTheDocument();
  });
});

describe("TaskHeader - Modal Interaction", () => {
  test("debe ejecutar onAddTask al hacer clic en el botón de agregar", async () => {
    // 1. Configuramos el actor (el usuario)
    const user = userEvent.setup();

    // 1. Creamos una función espía (mock)
    const mockOnAddTask = jest.fn();

    // 2. Renderizamos solo el Header, pasándole nuestro espía
    render(<TaskHeader onAddTask={mockOnAddTask} />);

    // 3. Hacemos clic
    const addButton = screen.getByRole("button", { name: /Agregar Tarea/i });
    await user.click(addButton);

    // 4. Verificamos que el espía fue llamado exactamente 1 vez
    expect(mockOnAddTask).toHaveBeenCalledTimes(1);
  });
});
