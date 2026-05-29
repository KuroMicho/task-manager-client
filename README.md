# ⚡ Taskify

Una plataforma de gestión y automatización de flujos de trabajo full-stack de alto rendimiento, diseñada bajo una arquitectura modular, renderizado eficiente y un ecosistema de pruebas automatizadas multicapa.

---

## 🚀 Arquitectura y Stack Tecnológico

### Frontend Core

- **Framework & Routing:** React 19 + React Router 7 (Framework Mode con SSR/Single-Page soporte y Typesafe Routing mediante `typegen`).
- **Data Fetching & State:** TanStack Query v5 (Manejo asíncrono y mutaciones optimistas) y Zustand v5 (Estado global atómico y desacoplado).
- **Estilos & UI:** Tailwind CSS v4 (Compilación nativa ultra veloz mediante Vite plugin) y Lucide React para iconografía semántica.
- **Real-Time:** Socket.io-client para la sincronización asíncrona bidireccional basada en eventos.

### Ecosistema de Testing & Calidad

- **E2E Testing (End-to-End):** Playwright v1.60 para la simulación de flujos de usuario reales en entornos multi-navegador aislados.
- **Unit & Integration Testing:** Jest + React Testing Library + Jest-DOM para la verificación de lógica de negocio, hooks personalizados y comportamiento de componentes aislados.
- **Estructura de Código:** ESLint 9 + TypeScript 5 con tipado estricto y ordenamiento declarativo mediante `eslint-plugin-perfectionist`.

---

## 📁 Estructura General del Proyecto

```text
├── src/                  # Código fuente de la aplicación (React + React Router)
│   ├── @types/           # Contratos de interfaces y tipados globales de dominio
│   ├── components/       # Arquitectura de componentes atómicos, modulares y accesibles
│   ├── hooks/            # Capa de abstracción de datos (Queries, Mutations y Sockets)
│   ├── pages/            # Módulos de páginas y layouts de la aplicación
│   └── store/            # Almacenes globales de Zustand (Auth, Tareas, UI)
├── tests/                # Suite de pruebas de caja negra E2E (Playwright)
├── playwright.config.ts  # Configuración del motor de automatización web
├── jest.config.ts        # Configuración del entorno de pruebas unitarias (JSDOM)
└── package.json          # Manifesto de dependencias y scripts del ciclo de vida

```

---

## ⚙️ Scripts del Ciclo de Vida

### Desarrollo y Compilación

Ejecuta el entorno de desarrollo local con recarga rápida (HMR):

```bash
npm run dev

```

Valida el tipado estricto de la aplicación junto con el generador de tipos dinámicos de React Router:

```bash
npm run typecheck

```

Compila y optimiza la aplicación para entornos de producción:

```bash
npm run build

```

### Suite de Pruebas (Testing)

**Pruebas Unitarias y de Integración (Jest):**

```bash
# Ejecutar todas las pruebas del proyecto
npm run test

# Ejecutar pruebas con reporte de cobertura de código (Coverage)
npm run test:coverage

```

**Pruebas de Extremo a Extremo (Playwright E2E):**

```bash
# Ejecución en consola estándar
npm run test:e2e

# Ejecución interactiva mediante interfaz gráfica (Modo UI)
npm run test:e2e:ui

```

### Calidad de Código (Linting)

Audita el estilo y consistencia del código frente a las reglas del linter:

```bash
npm run lint

```

Corrige automáticamente desviaciones de formato u ordenamiento:

```bash
npm run lint:fix

```
