import { Link, type MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [
    { title: "Taskify - Gestiona tus tareas con estilo" },
    {
      name: "description",
      content: "La mejor plataforma para organizar tus tareas.",
    },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
  ];
};

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center bg-(--background) text-(--foreground) px-4 transition-colors duration-300">
      {/* Decoración de fondo (Blur) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/20 dark:bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-cyan-500/20 dark:bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          Gestiona tus tareas con{" "}
          <span className="text-indigo-600">Estilo.</span>
        </h1>

        <p className="text-lg opacity-80">
          Proyecto: Implementando React Router v7, Zustand y Context API.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold shadow-lg shadow-indigo-500/30 hover:scale-105"
            to="/login"
          >
            Empezar ahora
          </Link>

          <a
            className="px-8 py-3 bg-(--card) border border-slate-200 dark:border-slate-800 rounded-full font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
            href="https://github.com"
            target="_blank"
          >
            Ver código
          </a>
        </div>
      </div>
    </div>
  );
}
