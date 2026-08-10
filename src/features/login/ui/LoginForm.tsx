"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { loginSchema } from "../model/schemas";
import type { ILoginFormValues } from "../model/login.types";
import type { ILoginFormProps } from "./LoginForm.types";
import { SOCIAL_PROVIDERS } from "./Login.constants";

export default function LoginForm({ onSubmitSuccess }: ILoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ILoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: ILoginFormValues) => {
    console.log("📋 Datos del formulario:", data);
    reset();
    onSubmitSuccess?.();
  };

  return (
    <div className="w-full max-w-md mx-auto bg-sand dark:bg-neutral-900/80 border border-cocoa/10 dark:border-neutral-800 rounded-2xl p-8 flex flex-col gap-6 backdrop-blur-sm">

      <div className="text-center flex flex-col gap-1">
        <h1 className="text-3xl font-black text-ginger uppercase tracking-wide">
          GOSMEL
        </h1>
        <p className="text-cocoa/50 dark:text-neutral-400 text-xs uppercase tracking-widest">
          Acceso al Estudio
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

        <div className="flex flex-col gap-1">
          <label className="text-cocoa/50 dark:text-neutral-400 text-xs uppercase tracking-widest">
            Correo Electrónico
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cocoa/40 dark:text-neutral-500">
              <Icon icon="mdi:email-outline" width={18} height={18} />
            </span>
            <input
              {...register("email")}
              placeholder="tu@correo.com"
              type="email"
              className="w-full bg-white/80 dark:bg-neutral-800 border border-cocoa/20 dark:border-neutral-700 rounded-lg pl-10 pr-4 py-3 text-cocoa dark:text-white placeholder:text-cocoa/30 dark:placeholder:text-neutral-600 text-sm focus:outline-none focus:border-ginger transition"
            />
          </div>
          {errors.email && (
            <span className="text-red-400 text-xs">{errors.email.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label className="text-cocoa/50 dark:text-neutral-400 text-xs uppercase tracking-widest">
              Contraseña
            </label>
            <span className="text-ginger text-xs uppercase tracking-widest font-semibold cursor-pointer hover:brightness-110 transition">
              ¿Olvidaste?
            </span>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cocoa/40 dark:text-neutral-500">
              <Icon icon="mdi:lock-outline" width={18} height={18} />
            </span>
            <input
              {...register("password")}
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              className="w-full bg-white/80 dark:bg-neutral-800 border border-cocoa/20 dark:border-neutral-700 rounded-lg pl-10 pr-12 py-3 text-cocoa dark:text-white placeholder:text-cocoa/30 dark:placeholder:text-neutral-600 text-sm focus:outline-none focus:border-ginger transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-cocoa/40 dark:text-neutral-500 hover:text-ginger transition"
            >
              <Icon
                icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
                width={18}
                height={18}
              />
            </button>
          </div>
          {errors.password && (
            <span className="text-red-400 text-xs">{errors.password.message}</span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-ginger text-white dark:text-black font-bold uppercase tracking-widest text-sm px-8 py-4 rounded-lg hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          <Icon icon="mdi:login" width={20} height={20} />
          {isSubmitting ? "Entrando..." : "Entrar al Estudio"}
        </button>

      </form>

      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-cocoa/10 dark:bg-neutral-800" />
        <span className="text-cocoa/40 dark:text-neutral-500 text-xs uppercase tracking-widest">
          O continuar con
        </span>
        <div className="flex-1 h-px bg-cocoa/10 dark:bg-neutral-800" />
      </div>

      <div className="flex items-center justify-center gap-4">
        {SOCIAL_PROVIDERS.map(({ id, icon, label }) => (
          <button
            key={id}
            type="button"
            aria-label={`Continuar con ${label}`}
            className="flex-1 h-12 rounded-xl bg-white/80 dark:bg-neutral-800 border border-cocoa/20 dark:border-neutral-700 flex items-center justify-center text-cocoa/40 dark:text-neutral-400 hover:text-ginger dark:hover:text-ginger hover:border-ginger transition"
          >
            <Icon icon={icon} width={22} height={22} />
          </button>
        ))}
      </div>

      <p className="text-center text-cocoa/40 dark:text-neutral-500 text-xs">
        ¿No tienes una cuenta?{" "}
        <Link
          href="/register"
          className="text-ginger font-semibold uppercase tracking-widest hover:brightness-110 transition"
        >
          Iniciar Registro
        </Link>
      </p>

    </div>
  );
}