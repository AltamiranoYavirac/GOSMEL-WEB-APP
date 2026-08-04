"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { registerSchema } from "../model/schemas";
import type { IRegisterFormValues } from "../model/register.types";
import type { IRegisterFormProps } from "./RegisterForm.types";

const SOCIAL_PROVIDERS = [
  {
    id: "google",
    icon: "mdi:google",
    label: "Google",
  },
  {
    id: "facebook",
    icon: "mdi:facebook",
    label: "Facebook",
  },
  {
    id: "apple",
    icon: "mdi:apple",
    label: "Apple",
  },
];

export default function RegisterForm({ onSubmitSuccess }: IRegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IRegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: IRegisterFormValues) => {
    console.log("📋 Datos del formulario:", data);
    reset();
    onSubmitSuccess?.();
  };

  return (
    <div className="w-full max-w-md mx-auto bg-neutral-900/80 dark:bg-neutral-900 border border-cocoa/10 dark:border-neutral-800 rounded-2xl p-8 flex flex-col gap-6 backdrop-blur-sm">

      {/* Header */}
      <div className="text-center flex flex-col gap-1">
        <h1 className="text-3xl font-black text-ginger uppercase tracking-wide">
          ¡Regístrate!
        </h1>
        <p className="text-neutral-400 text-xs uppercase tracking-widest">
          Iniciación Artística
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

        {/* Nombre y Apellido */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-neutral-400 text-xs uppercase tracking-widest">
              Nombre
            </label>
            <input
              {...register("firstName")}
              placeholder="Tu nombre"
              className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder:text-neutral-600 text-sm focus:outline-none focus:border-ginger transition"
            />
            {errors.firstName && (
              <span className="text-red-400 text-xs">{errors.firstName.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-neutral-400 text-xs uppercase tracking-widest">
              Apellido
            </label>
            <input
              {...register("lastName")}
              placeholder="Tu apellido"
              className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder:text-neutral-600 text-sm focus:outline-none focus:border-ginger transition"
            />
            {errors.lastName && (
              <span className="text-red-400 text-xs">{errors.lastName.message}</span>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-neutral-400 text-xs uppercase tracking-widest">
            Correo Electrónico
          </label>
          <input
            {...register("email")}
            placeholder="tu@correo.com"
            type="email"
            className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder:text-neutral-600 text-sm focus:outline-none focus:border-ginger transition"
          />
          {errors.email && (
            <span className="text-red-400 text-xs">{errors.email.message}</span>
          )}
        </div>

        {/* Teléfono */}
        <div className="flex flex-col gap-1">
          <label className="text-neutral-400 text-xs uppercase tracking-widest">
            Número de Celular
          </label>
          <input
            {...register("phone")}
            placeholder="+XX XXX XXXX XXXX"
            type="tel"
            className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder:text-neutral-600 text-sm focus:outline-none focus:border-ginger transition"
          />
          {errors.phone && (
            <span className="text-red-400 text-xs">{errors.phone.message}</span>
          )}
        </div>

        {/* Contraseña */}
        <div className="flex flex-col gap-1">
          <label className="text-neutral-400 text-xs uppercase tracking-widest">
            Contraseña
          </label>
          <div className="relative">
            <input
              {...register("password")}
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder:text-neutral-600 text-sm focus:outline-none focus:border-ginger transition pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-ginger transition"
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

        {/* Botón submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-ginger text-black font-bold uppercase tracking-widest text-sm px-8 py-4 rounded-lg hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {isSubmitting ? "Procesando..." : "Unirse a la Academia"}
        </button>

      </form>

      {/* Divisor */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-neutral-800" />
        <span className="text-neutral-500 text-xs uppercase tracking-widest">
          O registrarse con
        </span>
        <div className="flex-1 h-px bg-neutral-800" />
      </div>

      {/* Botones sociales */}
      <div className="flex items-center justify-center gap-6">
        {SOCIAL_PROVIDERS.map(({ id, icon, label }) => (
          <button
            key={id}
            type="button"
            aria-label={`Registrarse con ${label}`}
            className="w-12 h-12 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-ginger hover:border-ginger transition"
          >
            <Icon icon={icon} width={22} height={22} />
          </button>
        ))}
      </div>

    </div>
  );
}