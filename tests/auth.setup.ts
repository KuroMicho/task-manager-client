import { expect, test as setup } from "@playwright/test";

const authFile = "playwright/.auth/user.json";

setup("register and then login", async ({ page }) => {
  const uniqueId = Date.now();
  const userEmail = `estudiante.${uniqueId}@itp.edu.co`;
  const userPassword = "Password123!";

  // --- PASO 1: REGISTRO ---
  await page.goto("/register");

  await page.getByLabel(/Nombre/i).fill("Kevin Rodriguez");
  await page.getByLabel(/Correo/i).fill(userEmail);
  await page.getByLabel(/^Contraseña$/i).fill(userPassword);
  await page.getByLabel(/Confirmar Contraseña/i).fill(userPassword);

  // Disparamos el clic pero no navegamos manualmente todavía
  await page.getByRole("button", { name: /Crear Cuenta/i }).click();

  // ESPERA DE SEGURIDAD:
  await page.waitForURL("**/login", { timeout: 10000 });

  // --- PASO 2: LOGIN ---
  // Ahora que estamos seguros de que la cuenta existe y estamos en la página de login:
  await page.getByLabel(/Correo/i).fill(userEmail);
  await page.getByLabel(/Contraseña/i).fill(userPassword);

  await page.getByRole("button", { name: /Acceder al Tablero/i }).click();

  // Esperamos a llegar al dashboard
  await page.waitForURL("**/tasks");
  await expect(page).toHaveURL(/.*tasks/);

  // Guardamos el estado
  await page.context().storageState({ path: authFile });
});
