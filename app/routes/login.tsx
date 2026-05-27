import { useState } from "react";
import { Link, useNavigate } from "react-router";

import type { AxiosError } from "axios";

import {
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LogIn,
  Mail,
} from "lucide-react";

import { useLoginMutation } from "../hooks/useAuth";

export default function Login() {
  // React Router and TanStack Query hooks
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();

  // Local state hooks
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar la visibilidad

  // Computed/derived state
  const errorMessage = loginMutation.error
    ? (loginMutation.error as AxiosError<{ message?: string }>).response?.data
        ?.message || "Error al iniciar sesión"
    : null;

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // Usamos mutateAsync para esperar la respuesta antes de navegar
    await loginMutation.mutateAsync({ email, password });
    navigate("/tasks");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors duration-300 selection:bg-indigo-500/30">
      {/* Decoración de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/20 dark:bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-cyan-500/20 dark:bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-xl dark:shadow-2xl backdrop-blur-sm transition-all">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-50 dark:bg-indigo-600/10 rounded-xl mb-4 border border-indigo-100 dark:border-indigo-500/20">
              <LogIn
                className="text-indigo-600 dark:text-indigo-500"
                size={32}
              />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Bienvenido
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Ingresa a Taskify Pro para gestionar tus clases
            </p>
          </div>

          {/* Alerta de Error (Ahora viene de TanStack) */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="shrink-0" size={18} />
              <p>{errorMessage}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label
                className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300"
                htmlFor="email"
              >
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                  size={18}
                />
                <input
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@itp.edu.co"
                  required
                  type="email"
                  value={email}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between mb-2">
                <label
                  className="text-sm font-medium text-slate-700 dark:text-slate-300"
                  htmlFor="password"
                >
                  Contraseña
                </label>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 cursor-pointer">
                  ¿La olvidaste?
                </span>
              </div>

              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                  size={18}
                />

                <input
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  type={showPassword ? "text" : "password"} // Cambia dinámicamente el tipo
                  value={password}
                />

                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 transition-colors focus:outline-none cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button (Usamos isPending de TanStack) */}
            <button
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 group"
              disabled={loginMutation.isPending}
              type="submit"
            >
              {loginMutation.isPending ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Acceder al Tablero
                  <LogIn
                    className="group-hover:translate-x-1 transition-transform"
                    size={18}
                  />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center pt-6 border-t border-slate-100 dark:border-slate-800">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              ¿No tienes cuenta?{" "}
              <Link
                className="text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-500 transition-colors"
                to="/register"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
