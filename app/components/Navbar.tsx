import { Link, useLocation, useNavigate } from "react-router";

import {
  ClipboardList,
  LogOut,
  Moon,
  Sun,
  User as UserIcon,
} from "lucide-react";

import { useTheme } from "../context/ThemeContext";
import { useLogoutMutation } from "../hooks/useAuth";
import { useAuthStore } from "../store/useAuthStore";

export default function Navbar() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // Mutación de TanStack para cerrar sesión
  const logoutMutation = useLogoutMutation();

  const handleLogout = async () => {
    try {
      // 1. Llama al endpoint /logout (borra cookie)
      // 2. Ejecuta logout() de Zustand (borra localStorage)
      await logoutMutation.mutateAsync();

      // 3. Redirigimos al login
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión");
    }
  };

  const isTasksPage = location.pathname === "/tasks";

  return (
    <nav className="flex items-center justify-between p-4 border-b border-(--border) bg-(--card) text-(--foreground) shadow-sm">
      <div className="flex items-center gap-6">
        {/* Branding / Logo */}
        <Link className="flex items-center gap-3 group leading-none" to="/">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110">
            <ClipboardList className="text-white" size={24} />
          </div>
          {/* Agregué h-fit para que el texto no herede alturas raras */}
          <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight h-fit">
            Taskify <span className="text-indigo-600">Pro</span>
          </span>
        </Link>

        {/* Navegación Principal */}
        {!isTasksPage && isAuthenticated && (
          <div className="hidden md:flex items-center gap-4 text-sm font-medium leading-none">
            <Link
              className="opacity-70 hover:opacity-100 hover:text-indigo-500"
              to="/tasks"
            >
              Tareas
            </Link>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Toggle de Tema con Lucide Icons */}
        <button
          aria-label="Toggle Theme"
          className="p-2 rounded-lg bg-(--background) border border-(--border) hover:ring-2 ring-indigo-500 cursor-pointer"
          onClick={toggleTheme}
        >
          {theme === "light" ? (
            <Moon className="text-slate-600" size={20} />
          ) : (
            <Sun className="text-amber-400" size={20} />
          )}
        </button>

        {user ? (
          <div className="flex items-center gap-3">
            {/* Badge de Usuario */}
            <span className="flex items-center gap-2 text-sm font-semibold py-1 px-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-full border border-indigo-100 dark:border-indigo-800">
              <UserIcon size={16} />
              <span className="hidden sm:inline">{user.name}</span>
            </span>

            {/* Botón Logout (A la derecha) */}
            <button
              className="flex items-center gap-2 text-sm font-bold py-2 px-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              <span className="hidden md:inline">Cerrar Sesión</span>
            </button>
          </div>
        ) : (
          <Link
            className="text-sm font-bold py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md shadow-indigo-500/20"
            to="/login"
          >
            Iniciar Sesión
          </Link>
        )}
      </div>
    </nav>
  );
}
