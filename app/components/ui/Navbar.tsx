import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";

import {
  ChevronDown,
  ClipboardList,
  LogOut,
  Moon,
  Sun,
  User as UserIcon,
} from "lucide-react";

import { useTheme } from "../../context/ThemeContext";
import { useLogoutMutation } from "../../hooks/useAuth";
import { useAuthStore } from "../../store/useAuthStore";
import { useToastStore } from "../../store/useToastStore";

export default function Navbar() {
  // 1. Hooks de Estado Global y Servidores
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const addToast = useToastStore((state) => state.addToast);
  const logoutMutation = useLogoutMutation();

  // 2. Hooks de Enrutamiento y Contexto
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // 3. Estados Locales y Refs
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 4. Estado derivado (Variables calculadas)
  const isTasksPage = location.pathname === "/tasks";

  // Cierra el menú si se hace clic afuera del componente
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 5. Manejadores de eventos (Handlers)
  const handleLogout = async () => {
    try {
      setMenuOpen(false);
      await logoutMutation.mutateAsync();
      navigate("/login");
    } catch (_) {
      addToast("Error al cerrar sesión", "error");
    }
  };

  return (
    <nav className="flex items-center justify-between p-4 border-b-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm relative z-40">
      <div className="flex items-center gap-6">
        {/* Branding / Logo */}
        <Link className="flex items-center gap-3 group leading-none" to="/">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
            <ClipboardList className="text-white" size={22} />
          </div>
          <span className="text-xl font-black tracking-tight h-fit font-mono">
            Taskify<span className="text-indigo-600"></span>
          </span>
        </Link>

        {/* Navegación Principal */}
        {!isTasksPage && isAuthenticated && (
          <div className="flex items-center gap-4 text-sm font-bold font-mono">
            <Link
              className="text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
              to="/tasks"
            >
              // Tareas
            </Link>
          </div>
        )}
      </div>

      {/* SECCIÓN DERECHA: MENÚ CONTEXTUAL RESPONSIVO */}
      <div className="flex items-center gap-4" ref={menuRef}>
        {user ? (
          <div className="relative">
            {/* Botón Disparador del Menú (Trigger) */}
            <button
              aria-label="Abrir menú de usuario"
              className="flex items-center gap-2 px-3 py-2 border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-lg font-bold text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <UserIcon className="text-indigo-500" size={16} />
              <span className="hidden sm:inline max-w-30 truncate">
                {user.name}
              </span>
              <ChevronDown
                className={`transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}
                size={14}
              />
            </button>

            {/* Menú Contextual Desplegable */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] py-1.5 animate-in fade-in zoom-in-95 duration-100 overflow-hidden">
                {/* Info de Usuario (Header del menú) */}
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-mono uppercase tracking-widest text-[9px]">
                    Usuario
                  </p>
                  <p className="text-sm font-bold truncate text-slate-800 dark:text-slate-200">
                    {user.name}
                  </p>
                </div>

                {/* Opción 1: Toggle de Tema (Item interno) */}
                <button
                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors text-left cursor-pointer"
                  onClick={toggleTheme}
                >
                  <div className="flex items-center gap-2.5">
                    {theme === "light" ? (
                      <Moon className="text-slate-500" size={16} />
                    ) : (
                      <Sun className="text-amber-400" size={16} />
                    )}
                    <span>Modo {theme === "light" ? "Oscuro" : "Claro"}</span>
                  </div>
                  <span className="text-[10px] font-mono opacity-50 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded uppercase">
                    {theme}
                  </span>
                </button>

                {/* Separador estético */}
                <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                {/* Opción 2: Cerrar Sesión */}
                <button
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-left cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Botón de Login si no hay sesión iniciada */
          <Link
            className="text-sm font-bold py-2 px-4 bg-indigo-600 text-white rounded-lg font-mono"
            to="/login"
          >
            Iniciar Sesión
          </Link>
        )}
      </div>
    </nav>
  );
}
