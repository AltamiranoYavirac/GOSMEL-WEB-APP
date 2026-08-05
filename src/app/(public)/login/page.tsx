import { LoginForm } from "@/features/login";
import { Icon } from "@iconify/react";
import Link from "next/link";

export const metadata = {
  title: "Iniciar Sesión | GOSMEL Academia de Música",
  description: "Accede a tu estudio en GOSMEL Academia de Música.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#f8f6ef] dark:bg-neutral-950 flex flex-col">

      {/* Botón volver al inicio */}
      <div className="px-6 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-cocoa/50 dark:text-neutral-500 text-xs uppercase tracking-widest hover:text-ginger dark:hover:text-ginger transition"
        >
          <Icon icon="mdi:arrow-left" width={16} height={16} />
          Volver al inicio
        </Link>
      </div>

      {/* Formulario centrado */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <LoginForm />
      </div>

    </main>
  );
}