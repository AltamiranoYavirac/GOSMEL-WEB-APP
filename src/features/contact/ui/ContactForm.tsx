"use client"

import { Icon } from "@iconify/react"
import { toast } from "sonner"

import { useInstrumentoOptions } from "@/entities/instrument"
import { CheckboxField, Form, SelectField, TextareaField, TextField, useAppForm } from "@/shared/form"
import { Button, Spinner } from "@/shared/ui"

import { useEnviarSolicitud } from "../hooks/useEnviarSolicitud"
import {
  CONTACT_TIPO_OPCIONES,
  contactFormSchema,
  getContactFormDefaults,
  type IContactFormValues,
} from "../model/contactForm.config"
import type { IContactFormProps } from "./ContactForm.types"

export default function ContactForm({ onSubmitSuccess }: IContactFormProps) {
  const form = useAppForm<IContactFormValues>({
    schema: contactFormSchema,
    defaultValues: getContactFormDefaults(),
  })

  const { reset } = form

  const mutation = useEnviarSolicitud()
  const { data: instrumentos, isPending: instrumentosPending } = useInstrumentoOptions()

  const onSubmit = (values: IContactFormValues) => {
    mutation.mutate(
      { ...values, origenUrl: typeof window !== "undefined" ? window.location.href : "" },
      {
        onSuccess: () => {
          toast.success("Mensaje enviado", {
            description: "Gracias por contactarnos. Te responderemos pronto.",
          })
          reset()
          onSubmitSuccess?.()
        },
      }
    )
  }

  return (
    <div className="rounded-[18px] border border-border bg-card p-6 md:rounded-[20px] md:p-9">
      <h2 className="text-[23px] font-semibold tracking-[-0.03em] md:text-[26px]">
        Envíanos un mensaje
      </h2>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Te responderemos en menos de 24 horas.
      </p>

      <Form form={form} onSubmit={onSubmit} className="mt-7 flex flex-col gap-5">
        <TextField name="fullName" label="Nombre completo" placeholder="Tu nombre" />
        <TextField
          name="email"
          label="Correo electrónico"
          type="email"
          placeholder="tucorreo@ejemplo.com"
        />
        <TextField
          name="phone"
          label="Teléfono (opcional)"
          type="tel"
          placeholder="+593 98 000 0000"
        />
        <SelectField name="tipo" label="Tipo de solicitud" options={CONTACT_TIPO_OPCIONES} />
        <SelectField
          name="instrumentoId"
          label="Instrumento de interés"
          placeholder="Selecciona un instrumento (opcional)"
          options={(instrumentos ?? []).map((instrumento) => ({
            value: instrumento.id,
            label: instrumento.nombre,
          }))}
          disabled={instrumentosPending}
        />
        <TextareaField
          name="message"
          label="Mensaje"
          placeholder="Cuéntanos qué te gustaría aprender…"
          rows={5}
        />
        <CheckboxField
          name="consent"
          label={
            <>
              Autorizo el tratamiento de mis datos según la{" "}
              <a href="/privacy" className="underline underline-offset-2">
                Política de Privacidad
              </a>
            </>
          }
        />

        <Button
          type="submit"
          disabled={mutation.isPending}
          className="h-[52px] w-full gap-2 rounded-full text-[15px] font-semibold"
        >
          {mutation.isPending ? (
            <Spinner className="size-4" />
          ) : (
            <Icon icon="ph:paper-plane-right" className="size-5" aria-hidden="true" />
          )}
          {mutation.isPending ? "Enviando…" : "Enviar mensaje"}
        </Button>
      </Form>
    </div>
  )
}
