import { useEffect } from "react";
import { Link, Navigate, Outlet, useLocation } from "react-router";

import {
  ChevronRight,
  LayoutDashboard,
  Loader2,
  Search,
  Settings,
  User,
} from "lucide-react";

import { socket } from "../config/socket";
import { useCheckAuth } from "../hooks/useAuth";
import { useAuthStore } from "../store/useAuthStore";

export default function DashboardLayout() {
  // De manera individual, extraemos solo lo que necesitamos del store para evitar renders innecesarios
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  const location = useLocation();

  // VALIDACIÓN DE SESIÓN (TanStack Query)
  // Al ejecutarse aquí, protege todas las rutas hijas del Dashboard
  const { isLoading: isCheckingAuth } = useCheckAuth();

  useEffect(() => {
    if (isAuthenticated) {
      socket.connect();
    }
    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated]);

  // Mientras verifica la cookie por primera vez, mostramos un splash screen
  // Esto evita que la app redireccione al login por error mientras la API responde
  if (isCheckingAuth && !user) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
        <p className="text-slate-500 font-medium animate-pulse">
          Verificando credenciales...
        </p>
      </div>
    );
  }

  // Si terminó de cargar y no estamos autenticados, al login.
  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  const navItems = [
    { label: "Tablero", href: "/tasks", icon: LayoutDashboard },
    { label: "Buscar", href: "/search", icon: Search },
  ];

  return (
    <div className="flex h-full w-full bg-slate-50 dark:bg-slate-950 duration-300">
      {/* SIDEBAR */}
      <aside className="w-72 py-2 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col shadow-sm">
        {/* Navegación */}
        <nav className="flex-1 px-4 py-4">
          <p className="px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">
            Menú Principal
          </p>

          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                className={`flex items-center justify-between px-4 py-3 rounded-xl font-bold group ${
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-600/10 text-indigo-600 dark:text-indigo-400"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
                }`}
                key={item.href}
                to={item.href}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    className={
                      isActive ? "text-indigo-600 dark:text-indigo-400" : ""
                    }
                    size={20}
                  />
                  {item.label}
                </div>
                {isActive && (
                  <ChevronRight
                    className="animate-in slide-in-from-left-2"
                    size={16}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer / User Profile */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-black shadow-inner">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {user?.name || "Instructor"}
              </p>
              <p className="text-[10px] text-slate-500 truncate uppercase tracking-tighter">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header de la página actual (Opcional pero recomendado) */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md flex items-center justify-end px-8">
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-indigo-500">
              <Settings size={20} />
            </button>
            <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
              <User className="text-slate-500" size={18} />
            </div>
          </div>
        </header>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-5xl mx-auto p-6 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
