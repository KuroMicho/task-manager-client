import { useState } from "react";
import { Link, useNavigate } from "react-router";

import type { AxiosError } from "axios";

import { AlertCircle, Loader2, Lock, Mail, User, UserPlus } from "lucide-react";

import { useRegisterMutation } from "../hooks/useAuth";

export default function Register() {
  // React Router and TanStack Query hooks
  const navigate = useNavigate();
  const registerMutation = useRegisterMutation();

  // Local state hooks
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  // Computed/derived state
  const errorMessage =
    validationError ||
    (registerMutation.error
      ? (registerMutation.error as AxiosError<{ message?: string }>).response
          ?.data?.message || "Error al crear la cuenta"
      : null);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setValidationError(null);

    // 1. Validación rápida en Frontend
    if (password !== confirmPassword) {
      setValidationError("Las contraseñas no coinciden");
      return;
    }
    if (password.length < 6) {
      setValidationError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    await registerMutation.mutateAsync({ name, email, password });

    // 3. Redirigimos (dependiendo de tu flujo, puede ir directo a /tasks o al login)
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors duration-300 selection:bg-indigo-500/30">
      {/* Decoración de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/20 dark:bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-cyan-500/20 dark:bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-xl dark:shadow-2xl backdrop-blur-sm transition-all">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-50 dark:bg-indigo-600/10 rounded-xl mb-4 border border-indigo-100 dark:border-indigo-500/20">
              <UserPlus
                className="text-indigo-600 dark:text-indigo-500"
                size={32}
              />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Crear Cuenta
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Únete a Taskify Pro para organizar tus proyectos
            </p>
          </div>

          {/* Alerta de Error */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="shrink-0" size={18} />
              <p>{errorMessage}</p>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Nombre */}
            <div>
              <label
                className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300"
                htmlFor="name"
              >
                Nombre Completo
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                  size={18}
                />
                <input
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  id="name"
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Kevin Rodriguez"
                  required
                  type="text"
                  value={name}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300"
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
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
              <label
                className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300"
                htmlFor="password"
              >
                Contraseña
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                  size={18}
                />
                <input
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  type="password"
                  value={password}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300"
                htmlFor="confirmPassword"
              >
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                  size={18}
                />
                <input
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  id="confirmPassword"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  type="password"
                  value={confirmPassword}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              className="w-full py-3.5 mt-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 group"
              disabled={registerMutation.isPending}
              type="submit"
            >
              {registerMutation.isPending ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Crear Cuenta
                  <UserPlus
                    className="group-hover:translate-x-1 transition-transform"
                    size={18}
                  />
                </>
              )}
            </button>
          </form>

          {/* Footer Link back to Login */}
          <div className="mt-6 text-center pt-6 border-t border-slate-100 dark:border-slate-800">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              ¿Ya tienes una cuenta?{" "}
              <Link
                className="text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-500 transition-colors"
                to="/login"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
