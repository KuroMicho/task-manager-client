import { useEffect } from "react";
import { Link, Navigate, Outlet, useLocation } from "react-router";

import {
  ChevronRight,
  HelpCircle,
  LayoutDashboard,
  Loader2,
  Search,
  Settings,
} from "lucide-react";

import { socket } from "../config/socket";
import { useCheckAuth } from "../hooks/useAuth";
import { useAuthStore } from "../store/useAuthStore";

export default function DashboardLayout() {
  // Zustand global state hooks
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  // React Router and TanStack Query hooks
  const location = useLocation();
  const { isLoading: isCheckingAuth } = useCheckAuth();

  // Computed/derived state
  const isCheckingSession = isCheckingAuth && !user;
  const navItems = [
    { label: "Tablero", href: "/tasks", icon: LayoutDashboard },
    { label: "Buscar", href: "/search", icon: Search },
  ];

  useEffect(() => {
    if (isAuthenticated) {
      socket.connect();
    }
    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated]);

  if (isCheckingSession) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
        <p className="text-slate-500 font-medium animate-pulse">
          Verificando credenciales...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  return (
    <div className="flex h-full w-full bg-slate-50 dark:bg-slate-950 duration-300">
      {/* SIDEBAR RESPONSIVO */}
      <aside className="w-16 lg:w-50 py-2 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col shadow-sm transition-all duration-300">
        {/* Navegación */}
        <nav className="flex-1 px-2 lg:px-4 py-4 flex flex-col gap-1">
          {/* Título del menú oculto en mobile */}
          <p className="hidden lg:block px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">
            Menú Principal
          </p>

          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                className={`flex items-center justify-center lg:justify-between px-3 lg:px-4 py-3 rounded-xl font-bold group transition-colors ${
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-600/10 text-indigo-600 dark:text-indigo-400"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
                }`}
                key={item.href}
                title={
                  item.label
                } /* Tooltip nativo útil para la barra colapsada */
                to={item.href}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    className={
                      isActive ? "text-indigo-600 dark:text-indigo-400" : ""
                    }
                    size={20}
                  />
                  {/* Texto oculto en mobile */}
                  <span className="hidden lg:block">{item.label}</span>
                </div>

                {/* Chevron oculto en mobile */}
                {isActive && (
                  <ChevronRight
                    className="hidden lg:block animate-in slide-in-from-left-2"
                    size={16}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer / User Profile Adaptivo */}
        <div className="p-2 lg:p-4 border-t border-slate-100 dark:border-slate-800">
          <div className="bg-slate-50 dark:bg-slate-800/40 p-2 lg:p-4 rounded-2xl flex items-center justify-center lg:justify-start gap-3">
            {/* El avatar se mantiene visible y centrado en mobile */}
            <div className="w-10 h-10 shrink-0 rounded-full bg-linear-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-black shadow-inner">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            {/* Datos del usuario ocultos en mobile */}
            <div className="hidden lg:block flex-1 min-w-0">
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
        {/* Header superior */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md flex items-center justify-end px-4">
          <div className="flex flex-1 justify-between gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-500 transition-colors cursor-pointer">
              <Settings size={20} />
            </button>
            <button className="p-2 bg-slate-200 dark:bg-slate-800 text-slate-400 hover:text-slate-500 transition-colors rounded-lg cursor-pointer">
              <HelpCircle size={20} />
            </button>
          </div>
        </header>

        {/* Contenido principal con padding ajustado para pantallas pequeñas */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
