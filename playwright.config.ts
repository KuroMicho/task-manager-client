import { defineConfig, devices } from "@playwright/test";
import path from "path";

// Esto apuntará a la raíz del proyecto directamente
export const STORAGE_STATE = path.resolve("playwright/.auth/user.json");

export default defineConfig({
  // Localización de los archivos de prueba
  testDir: "./tests",

  // Solo reconoce archivos que terminen en .spec.ts o .setup.ts
  testMatch: "**/*.{spec,setup}.ts",

  // Ejecución en paralelo para mayor velocidad
  fullyParallel: true,

  // Fallar si accidentalmente dejamos un .only en el código (útil para CI)
  forbidOnly: !!process.env.CI,

  // Reintentos en caso de fallo (solo en CI)
  retries: process.env.CI ? 2 : 0,

  // Reporte visual de resultados
  reporter: "html",

  use: {
    // URL base para evitar escribirla en cada 'goto'
    baseURL: "http://localhost:5173",

    // Captura trazas en el primer reintento de un test fallido
    trace: "on-first-retry",

    // Captura video si el test falla (muy útil para depurar)
    video: "on-first-retry",
  },

  /**
   * CONFIGURACIÓN DE PROYECTOS
   * Aquí definimos la dependencia: setup -> chromium
   */
  projects: [
    // PROYECTO DE CONFIGURACIÓN (Auth)
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/, // Solo ejecuta el archivo de registro/login
    },

    // PROYECTO PRINCIPAL (Navegador)
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Inyecta la sesión guardada automáticamente
        storageState: STORAGE_STATE,
      },
      // Obliga a que el proyecto 'setup' se ejecute con éxito antes
      dependencies: ["setup"],
    },

    // Opcional: Puedes añadir Firefox o Safari con la misma dependencia
    /*
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        storageState: STORAGE_STATE 
      },
      dependencies: ['setup'],
    },
    */
  ],

  /**
   * SERVIDOR WEB
   * Playwright encenderá tu app automáticamente antes de correr los tests.
   */
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    stdout: "pipe",
    stderr: "pipe",
  },
});
