import { expect, test as setup } from "@playwright/test";

const authFile = "playwright/.auth/user.json";

setup("register and then login", async ({ page }) => {
  const uniqueId = Date.now();
  const userEmail = `estudiante.${uniqueId}@itp.edu.co`;
  const userPassword = "Password123!";

  // Interceptamos cualquier petición que vaya hacia tu API de Render para simular la respuesta
  await page.route("**/api/v1/auth/register", async (route) => {
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        message: "Usuario creado con éxito",
        success: true,
      }),
    });
  });

  await page.route("**/api/v1/auth/login", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        token: "token-falso-de-prueba-playwright",
        user: { name: "Kevin Rodriguez", email: userEmail },
      }),
    });
  });

  // --- PASO 1: REGISTRO ---
  await page.goto("/register");

  await page.getByLabel(/Nombre/i).fill("Kevin Rodriguez");
  await page.getByLabel(/Correo/i).fill(userEmail);
  await page.locator("#password").fill(userPassword);
  await page.locator("#confirmPassword").fill(userPassword);

  await page.getByRole("button", { name: /Crear Cuenta/i }).click();

  // Ahora esto se ejecutará INSTANTÁNEAMENTE porque la API responde en 0 milisegundos
  await page.waitForURL("/login", { timeout: 10000 });

  // --- PASO 2: LOGIN ---
  await page.getByLabel(/Correo/i).fill(userEmail);
  await page.locator("#password").fill(userPassword);

  await page.getByRole("button", { name: /Acceder al Tablero/i }).click();

  await page.waitForURL("/tasks", { timeout: 10000 });
  await expect(page).toHaveURL(/\/tasks/);

  await page.context().storageState({ path: authFile });
});
