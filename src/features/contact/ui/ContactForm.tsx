"use client";

import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { Button, Spinner } from "@/shared/ui";
import { Form, SelectField, TextareaField, TextField, useAppForm } from "@/shared/form";
import {
  contactFormSchema,
  getContactFormDefaults,
  type IContactFormValues,
} from "../model/contactForm.config";
import type { IContactFormProps } from "./ContactForm.types";
import { INSTRUMENTS } from "./ContactForm.constants";

export default function ContactForm({ onSubmitSuccess }: IContactFormProps) {
  const form = useAppForm<IContactFormValues>({
    schema: contactFormSchema,
    defaultValues: getContactFormDefaults(),
  });

  const {
    reset,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async () => {
    toast.success("Solicitud enviada con éxito", {
      description: "Un asesor pedagógico de GOSMEL se pondrá en contacto contigo en menos de 24 horas.",
    });
    reset();
    onSubmitSuccess?.();
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-background border border-white/60 dark:border-white/5 shadow-[-8px_-8px_20px_rgba(255,255,255,0.9),8px_8px_20px_rgba(169,146,125,0.22)] dark:shadow-[-8px_-8px_20px_rgba(255,255,255,0.04),8px_8px_22px_rgba(0,0,0,0.65)] p-8 sm:p-12 flex flex-col gap-10">
      <div className="relative z-10 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-background border border-white/60 dark:border-white/5 shadow-[-2px_-2px_5px_rgba(255,255,255,0.8),2px_2px_5px_rgba(169,146,125,0.18)] dark:shadow-[-2px_-2px_5px_rgba(255,255,255,0.03),2px_2px_5px_rgba(0,0,0,0.5)] text-primary text-xs uppercase tracking-widest font-bold">
            <Icon icon="ph:sparkle-fill" className="size-3.5" aria-hidden="true" />
            <span>Admisiones & Asesoría</span>
          </div>
          <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
            Paso 1 de 1 · Rápido
          </span>
        </div>

        <div className="space-y-2">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
            Inicia tu Formación Musical
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
            Completa tus datos para enviarte los programas de estudio, costos mensuales y opciones de horarios personalizadas.
          </p>
        </div>
      </div>

      <Form form={form} onSubmit={onSubmit} className="relative z-10 flex flex-col gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-2 border-b border-border/80">
            <span className="flex size-7 items-center justify-center rounded-xl bg-background border border-white/40 dark:border-white/5 shadow-[inset_-2px_-2px_5px_rgba(255,255,255,0.9),inset_2px_2px_5px_rgba(169,146,125,0.22)] dark:shadow-[inset_-2px_-2px_5px_rgba(255,255,255,0.04),inset_2px_2px_5px_rgba(0,0,0,0.6)] font-mono text-xs font-bold text-primary">
              01
            </span>
            <span className="text-xs uppercase tracking-widest font-bold text-foreground">
              Datos Personales
            </span>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <TextField
              name="fullName"
              label="Nombre Completo"
              placeholder="Ej. Martín Zambrano"
            />
            <TextField
              name="email"
              label="Correo Electrónico"
              type="email"
              placeholder="martin@ejemplo.com"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-2 border-b border-border/80">
            <span className="flex size-7 items-center justify-center rounded-xl bg-background border border-white/40 dark:border-white/5 shadow-[inset_-2px_-2px_5px_rgba(255,255,255,0.9),inset_2px_2px_5px_rgba(169,146,125,0.22)] dark:shadow-[inset_-2px_-2px_5px_rgba(255,255,255,0.04),inset_2px_2px_5px_rgba(0,0,0,0.6)] font-mono text-xs font-bold text-primary">
              02
            </span>
            <span className="text-xs uppercase tracking-widest font-bold text-foreground">
              Disciplina o Instrumento
            </span>
          </div>
          <SelectField
            name="instrument"
            label="Área de Estudio"
            placeholder="Selecciona el instrumento de tu interés"
            options={INSTRUMENTS}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-2 border-b border-border/80">
            <span className="flex size-7 items-center justify-center rounded-xl bg-background border border-white/40 dark:border-white/5 shadow-[inset_-2px_-2px_5px_rgba(255,255,255,0.9),inset_2px_2px_5px_rgba(169,146,125,0.22)] dark:shadow-[inset_-2px_-2px_5px_rgba(255,255,255,0.04),inset_2px_2px_5px_rgba(0,0,0,0.6)] font-mono text-xs font-bold text-primary">
              03
            </span>
            <span className="text-xs uppercase tracking-widest font-bold text-foreground">
              Detalles o Metas
            </span>
          </div>
          <TextareaField
            name="message"
            label="Cuéntanos tus expectativas"
            placeholder="Indícanos si comienzas desde cero, tus horarios disponibles o si te interesa preparar una audición..."
            rows={5}
          />
        </div>

        <div className="space-y-5 pt-2">
          <Button
            type="submit"
            size="2xl"
            disabled={isSubmitting}
            className="w-full gap-3 text-xs uppercase tracking-widest font-bold shadow-2xl shadow-primary/30 hover:scale-[1.01] transition-all h-14"
          >
            {isSubmitting ? (
              <Spinner className="size-4" />
            ) : (
              <Icon icon="ph:paper-plane-right-fill" className="size-4" aria-hidden="true" />
            )}
            {isSubmitting ? "Enviando solicitud..." : "Enviar Solicitud de Información"}
          </Button>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-center text-xs text-muted-foreground font-light">
            <div className="flex items-center justify-center gap-2 p-2.5 rounded-2xl bg-background border border-white/60 dark:border-white/5 shadow-[-2px_-2px_5px_rgba(255,255,255,0.8),2px_2px_5px_rgba(169,146,125,0.18)] dark:shadow-[-2px_-2px_5px_rgba(255,255,255,0.03),2px_2px_5px_rgba(0,0,0,0.5)]">
              <Icon icon="ph:shield-check-fill" className="size-4 text-primary shrink-0" aria-hidden="true" />
              <span>Privacidad 100%</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-2.5 rounded-2xl bg-background border border-white/60 dark:border-white/5 shadow-[-2px_-2px_5px_rgba(255,255,255,0.8),2px_2px_5px_rgba(169,146,125,0.18)] dark:shadow-[-2px_-2px_5px_rgba(255,255,255,0.03),2px_2px_5px_rgba(0,0,0,0.5)]">
              <Icon icon="ph:clock-countdown-fill" className="size-4 text-primary shrink-0" aria-hidden="true" />
              <span>Respuesta &lt; 24h</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-2.5 rounded-2xl bg-background border border-white/60 dark:border-white/5 shadow-[-2px_-2px_5px_rgba(255,255,255,0.8),2px_2px_5px_rgba(169,146,125,0.18)] dark:shadow-[-2px_-2px_5px_rgba(255,255,255,0.03),2px_2px_5px_rgba(0,0,0,0.5)]">
              <Icon icon="ph:hands-clapping-fill" className="size-4 text-primary shrink-0" aria-hidden="true" />
              <span>Sin compromiso</span>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}
