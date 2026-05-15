import {
  index,
  layout,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  // 1. Index
  index("routes/home.tsx"),

  // 2. Ruta de Login
  route("login", "routes/login.tsx"),

  // 3. Ruta de Registro
  route("register", "routes/register.tsx"),

  // 4. Rutas Protegidas y Anidadas (Usando un layout)
  layout("layouts/dashboard-layout.tsx", [
    route("tasks", "routes/tasks.tsx"),
    // Parámetros de ruta (:id)
    route("tasks/:id", "routes/task-detail.tsx"),
  ]),

  // 5. Búsqueda (Para practicar useSearchParams)
  route("search", "routes/search.tsx"),
] satisfies RouteConfig;
