import { expect, test as setup } from "@playwright/test";

const authFile = "playwright/.auth/user.json";

setup("register and then login", async ({ page }) => {
  const uniqueId = Date.now();
  const userEmail = `estudiante.${uniqueId}@itp.edu.co`;
  const userPassword = "Password123!";

  // --- PASO 1: REGISTRO ---
  await page.goto("/register");

  // Rellenar datos de registro
  await page.getByLabel(/Nombre/i).fill("Kevin Rodriguez");
  await page.getByLabel(/Correo/i).fill(userEmail);

  // Apuntamos directo a los IDs del DOM para fulminar la violación de modo estricto
  await page.locator("#password").fill(userPassword);
  await page.locator("#confirmPassword").fill(userPassword);

  // Disparamos el clic de envío del formulario
  await page.getByRole("button", { name: /Crear Cuenta/i }).click();

  // Le damos un margen holgado por la latencia de la API de Render en el CI
  await page.waitForURL("/login", { timeout: 20000 });

  // --- PASO 2: LOGIN ---
  // Ahora que estamos seguros por URL de que estamos en la pantalla de Login:
  await page.getByLabel(/Correo/i).fill(userEmail);
  await page.locator("#password").fill(userPassword);

  // Hacer clic para iniciar sesión
  await page.getByRole("button", { name: /Acceder al Tablero/i }).click();

  await page.waitForURL("/tasks", { timeout: 20000 });

  // Verificación final del estado de la URL
  await expect(page).toHaveURL(/\/tasks/);

  // Guardamos el estado de autenticación (cookies y localStorage) de forma exitosa
  await page.context().storageState({ path: authFile });
});
