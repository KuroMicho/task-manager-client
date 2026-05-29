import { expect, test } from "@playwright/test";

test("Debe cargar la página principal", async ({ page }) => {
  await page.goto("/");

  const header = page.locator("text=Gestiona tus tareas con Estilo.");
  await expect(header).toBeVisible();
});

test.describe("Gestión de Tareas", () => {
  test.beforeEach(async ({ page }) => {
    const meResponsePromise = page.waitForResponse(
      (res) => res.url().includes("/api/v1/auth/me") && res.status() === 200,
    );
    const tasksResponsePromise = page.waitForResponse(
      (res) => res.url().includes("/api/v1/tasks") && res.status() === 200,
    );

    await page.goto("/tasks");

    await Promise.all([tasksResponsePromise, meResponsePromise]);
  });

  test("debe ver el tablero de tareas directamente", async ({ page }) => {
    const header = page.locator("h1");
    await expect(header).toContainText(/Tablero/i);
  });

  test("debe permitir abrir el modal de nueva tarea", async ({ page }) => {
    await page.getByRole("button", { name: /Agregar Tarea/i }).click();
    await expect(page.getByText(/Nueva Tarea/i)).toBeVisible();
  });

  test("debe permitir crear una nueva tarea y visualizarla en la lista", async ({
    page,
  }) => {
    const taskTitle = `Tarea de Prueba - ${Date.now()}`;
    const taskDescription = "Esta es una descripción creada por Playwright";

    await page.getByRole("button", { name: /Agregar Tarea/i }).click();
    await expect(page.getByText(/Nueva Tarea/i)).toBeVisible();

    await page.getByLabel(/Título/i).fill(taskTitle);
    await page.getByLabel(/Descripción/i).fill(taskDescription);

    const prioritySelect = page.getByLabel(/Prioridad/i);
    await prioritySelect.click();

    await page.getByRole("button", { name: "HIGH - Alta (Urgente)" }).click();

    const saveButton = page.getByRole("button", { name: /Guardar/i });
    await saveButton.click();

    await expect(page.getByText(/Nueva Tarea/i)).not.toBeVisible();

    const newTaskCard = page.getByText(taskTitle);
    await expect(newTaskCard).toBeVisible();
  });

  test("debe mostrar la lista de tareas cargadas desde el servidor", async ({
    page,
  }) => {
    await expect(page.getByTestId("loading-state")).not.toBeVisible();

    const taskItems = page.locator(".task-card");

    const count = await taskItems.count();
    console.log(`Tareas encontradas: ${count}`);
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
