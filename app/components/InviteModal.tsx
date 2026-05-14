import { useState } from "react";

import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Mail,
  Send,
  X,
} from "lucide-react";

import { useInviteMemberMutation } from "../hooks/useTask";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
}

export default function InviteModal({ isOpen, onClose, taskId }: Props) {
  const [email, setEmail] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // Usamos la mutación
  const inviteMutation = useInviteMemberMutation(taskId);

  if (!isOpen) return null;

  const handleInvite = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      await inviteMutation.mutateAsync(email);

      // Manejo de éxito local para el feedback visual
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setEmail("");
        onClose();
        inviteMutation.reset(); // Limpia los estados de error de la mutación
      }, 2000);
    } catch (error) {
      // El error lo maneja automáticamente TanStack Query en inviteMutation.error
      console.error("Error al invitar colaborador");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
            <Mail className="text-indigo-500" size={20} /> Invitar Colaborador
          </h2>
          <button
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <form className="p-6 space-y-4" onSubmit={handleInvite}>
          <p className="text-sm text-slate-500 leading-relaxed">
            Ingresa el correo del estudiante o colega para que pueda colaborar
            en esta tarea.
          </p>

          {/* Feedback de Éxito */}
          {showSuccess && (
            <div className="p-4 bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20 rounded-xl flex items-center gap-3 text-green-600 dark:text-green-400 animate-in slide-in-from-top-2">
              <CheckCircle2 size={18} />
              <p className="text-sm font-bold">
                ¡Invitación enviada con éxito!
              </p>
            </div>
          )}

          {/* Feedback de Error (Desde TanStack) */}
          {inviteMutation.isError && !showSuccess && (
            <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 animate-in slide-in-from-top-2">
              <AlertCircle size={18} />
              <p className="text-sm font-bold">
                {(inviteMutation.error as any)?.response?.data?.message ||
                  "Error al invitar"}
              </p>
            </div>
          )}

          <div className="relative">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-50"
              disabled={inviteMutation.isPending || showSuccess}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@itp.edu.co"
              required
              type="email"
              value={email}
            />
          </div>

          <button
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
            disabled={inviteMutation.isPending || showSuccess}
          >
            {inviteMutation.isPending ? (
              <Loader2 className="animate-spin" size={20} />
            ) : showSuccess ? (
              "Enviado..."
            ) : (
              <>
                <Send size={18} /> Enviar Invitación
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
