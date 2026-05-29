import { defineConfig, devices } from "@playwright/test";
import path from "path";

// Ubicación de almacenamiento persistente para la sesión autenticada (State)
export const STORAGE_STATE = path.resolve("playwright/.auth/user.json");

export default defineConfig({
  // Directorio base de las pruebas
  testDir: "./tests",

  // Patrón para capturar archivos de pruebas y configuraciones globales
  testMatch: "**/*.{spec,setup}.ts",

  // Tiempo límite global estricto por cada test individual (30 segundos)
  timeout: 30000,

  // Tiempo límite para aserciones de expect() (5 segundos)
  expect: {
    timeout: 5000,
  },

  // Ejecución en paralelo nativa para reducir los tiempos del pipeline
  fullyParallel: true,

  // Detener el pipeline inmediatamente si se quedó un '.only' residual en el código (Control de CI)
  forbidOnly: !!process.env.CI,

  // Estrategia de reintentos: En local se reintenta cero; en CI hasta 2 veces para mitigar flujos "flaky"
  retries: process.env.CI ? 2 : 0,

  // Limitación de procesos concurrentes: 1 worker en CI para evitar saturar la CPU virtual; en local usa el máximo disponible
  workers: process.env.CI ? 1 : undefined,

  // Formato del reporte de salida (Línea de comandos limpia en CI, HTML interactivo para fallos)
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "html",

  use: {
    // CONMUTACIÓN INTELIGENTE DE URL BASE:
    // Evita el lag e interferencias de optimizaciones en frío provocadas por Vite Dev en el CI
    baseURL: process.env.CI ? "http://localhost:3000" : "http://localhost:5173",

    // Configuración semántica para ignorar fallos de certificados auto-firmados en local/contenedores
    ignoreHTTPSErrors: true,

    // OPTIMIZACIÓN DE DISCO Y RENDIMIENTO EXTREMO:
    // Las capturas, videos y trazas consumen valiosos ciclos de CPU y RAM.
    // Solo se generan si el test falla y entra en ciclo de REINTENTO. Si todo pasa en verde, el gasto es CERO.
    trace: "retry-with-trace",
    video: "on-first-retry",
    screenshot: "only-on-failure",
  },

  /**
   * CONFIGURACIÓN DE PROYECTOS (FLUJO SECUENCIAL DE AUTENTICACIÓN)
   */
  projects: [
    // 1. Proyecto Inicial de Configuración (Semilla de Sesión Auth)
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
    },

    // 2. Proyecto Principal de Ejecución E2E (Chromium)
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Inyecta el estado de cookies y almacenamiento de forma global antes de cada test
        storageState: STORAGE_STATE,
      },
      // Obliga a Playwright a correr y validar el 'setup' con éxito antes de disparar este proyecto
      dependencies: ["setup"],
    },
  ],

  /**
   * ORQUESTACIÓN DINÁMICA DEL SERVIDOR WEB
   * Controla el ciclo de vida de la aplicación de forma inteligente según el entorno.
   */
  webServer: {
    // Si corre en GitHub Actions (CI), compila a producción y levanta el servidor SSR nativo (React Router Serve).
    // Si corre en tu computadora local, se amarra a tu servidor de desarrollo en caliente (Vite dev).
    command: process.env.CI ? "npm run build && npm run start" : "npm run dev",

    // Mapeo dinámico del puerto de escucha según el entorno
    url: process.env.CI ? "http://localhost:3000" : "http://localhost:5173",

    // Reutilizar instancias activas en local para evitar levantar servidores duplicados en cada ejecución
    reuseExistingServer: !process.env.CI,

    // Captura de flujos de salida estándares para depuración avanzada en los logs del pipeline
    stdout: "pipe",
    stderr: "pipe",

    // Tiempo límite extendido (2 minutos) para dar espacio a la compilación en frío dentro de GitHub Actions
    timeout: 120000,
  },
});
