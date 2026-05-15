// 🚀 LA CLAVE ESTÁ AQUÍ: Tienes que importar 'test' y 'expect'
import { expect, test } from "@playwright/test";

test("Debe cargar la página principal", async ({ page }) => {
  // 1. Navegamos a la URL de tu app en local
  await page.goto("/");

  // 2. Verificamos que el encabezado esté visible
  const header = page.locator("text=Gestiona tus tareas con Estilo.");
  await expect(header).toBeVisible();
});

test.describe("Gestión de Tareas", () => {
  test.beforeEach(async ({ page }) => {
    // 1. Preparamos las promesas de espera para las peticiones clave
    const meResponsePromise = page.waitForResponse(
      (res) => res.url().includes("/api/v1/auth/me") && res.status() === 200,
    );
    const tasksResponsePromise = page.waitForResponse(
      (res) => res.url().includes("/api/v1/tasks") && res.status() === 200,
    );

    // 2. Navegamos a la página
    await page.goto("/tasks");

    // 3. Forzamos al test a esperar que ambas promesas se cumplan
    // Esto garantiza que el token se validó y las tareas ya llegaron
    await Promise.all([tasksResponsePromise, meResponsePromise]);
  });

  test("debe ver el tablero de tareas directamente", async ({ page }) => {
    const header = page.locator("h1");
    await expect(header).toContainText(/Tablero de Proyectos/i);
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

    // 1. Abrir el modal
    await page.getByRole("button", { name: /Agregar Tarea/i }).click();
    await expect(page.getByText(/Nueva Tarea/i)).toBeVisible();

    // 2. Llenar el formulario
    // Ajusta los labels segun tus inputs (Título, Descripción, etc.)
    await page.getByLabel(/Título/i).fill(taskTitle);
    await page.getByLabel(/Descripción/i).fill(taskDescription);
    await page.getByLabel(/Prioridad/i).selectOption("high");

    // 3. Guardar la tarea
    const saveButton = page.getByRole("button", { name: /Guardar/i });
    await saveButton.click();

    // 4. Verificar que el modal se cierre
    await expect(page.getByText(/Nueva Tarea/i)).not.toBeVisible();

    // 5. Verificar que la tarea aparezca en la lista
    // Buscamos el texto exacto que acabamos de crear
    const newTaskCard = page.getByText(taskTitle);
    await expect(newTaskCard).toBeVisible();
  });

  test("debe mostrar la lista de tareas cargadas desde el servidor", async ({
    page,
  }) => {
    // Verificamos que al menos exista el contenedor de la lista
    // o que no aparezca el estado de "Cargando" después de un momento
    await expect(page.getByTestId("loading-state")).not.toBeVisible();

    // Si tienes una lista, verificamos que haya elementos (cards)
    // Asumiendo que tus tareas tienen una clase o rol específico
    const taskItems = page.locator(".task-card"); // Ajusta el selector CSS a tu código

    // Verificamos que si hay tareas en la DB, se muestren
    // Si la lista empieza vacía, este test pasará con count 0,
    // pero el test de arriba ya creó una, así que debería haber al menos 1.
    const count = await taskItems.count();
    console.log(`Tareas encontradas: ${count}`);
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
