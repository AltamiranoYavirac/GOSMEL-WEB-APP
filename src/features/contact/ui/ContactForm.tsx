"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { contactSchema } from "../model/schemas";
import type { IContactFormValues, TInstrumentOption } from "../model/contact.types";
import type { IContactFormProps } from "./ContactForm.types";

const INSTRUMENTS: TInstrumentOption[] = [
  { label: "Guitarra", value: "guitarra" },
  { label: "Piano", value: "piano" },
  { label: "Violín", value: "violin" },
  { label: "Batería", value: "bateria" },
  { label: "Canto", value: "canto" },
  { label: "Bajo", value: "bajo" },
  { label: "Flauta", value: "flauta" },
];

export default function ContactForm({ onSubmitSuccess }: IContactFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: IContactFormValues) => {
    console.log(data);
    reset();
    onSubmitSuccess?.();
  };

  return (
    <div className="bg-cream/60 dark:bg-neutral-900 border border-cocoa/10 dark:border-neutral-800 rounded-2xl p-8 h-full">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-ginger text-sm font-medium">
              Nombre Completo
            </label>
            <input
              {...register("fullName")}
              placeholder="Ej. Ana García"
              className="bg-white/80 dark:bg-neutral-800 border border-cocoa/20 dark:border-neutral-700 rounded-lg px-4 py-3 text-cocoa dark:text-white placeholder:text-cocoa/30 dark:placeholder:text-neutral-500 text-sm focus:outline-none focus:border-ginger transition"
            />
            {errors.fullName && (
              <span className="text-red-400 text-xs">{errors.fullName.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-ginger text-sm font-medium">
              Correo Electrónico
            </label>
            <input
              {...register("email")}
              placeholder="ana@ejemplo.com"
              type="email"
              className="bg-white/80 dark:bg-neutral-800 border border-cocoa/20 dark:border-neutral-700 rounded-lg px-4 py-3 text-cocoa dark:text-white placeholder:text-cocoa/30 dark:placeholder:text-neutral-500 text-sm focus:outline-none focus:border-ginger transition"
            />
            {errors.email && (
              <span className="text-red-400 text-xs">{errors.email.message}</span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-ginger text-sm font-medium">
            Instrumento de Interés
          </label>
          <select
            {...register("instrument")}
            className="bg-white/80 dark:bg-neutral-800 border border-cocoa/20 dark:border-neutral-700 rounded-lg px-4 py-3 text-cocoa/70 dark:text-neutral-300 text-sm focus:outline-none focus:border-ginger transition appearance-none cursor-pointer"
          >
            <option value="">Selecciona un instrumento</option>
            {INSTRUMENTS.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errors.instrument && (
            <span className="text-red-400 text-xs">{errors.instrument.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-ginger text-sm font-medium">Mensaje</label>
          <textarea
            {...register("message")}
            placeholder="Cuéntanos sobre tus metas musicales..."
            rows={6}
            className="bg-white/80 dark:bg-neutral-800 border border-cocoa/20 dark:border-neutral-700 rounded-lg px-4 py-3 text-cocoa dark:text-white placeholder:text-cocoa/30 dark:placeholder:text-neutral-500 text-sm focus:outline-none focus:border-ginger transition resize-none"
          />
          {errors.message && (
            <span className="text-red-400 text-xs">{errors.message.message}</span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="self-start flex items-center gap-2 bg-ginger text-white dark:text-black font-semibold uppercase tracking-widest text-sm px-8 py-4 rounded-lg hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
          <Icon icon="mdi:send" width={16} height={16} />
        </button>

      </form>
    </div>
  );
}