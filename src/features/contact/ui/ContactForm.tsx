"use client"

import { Icon } from "@iconify/react"
import { toast } from "sonner"

import { Button, Spinner } from "@/shared/ui"
import { Form, SelectField, TextareaField, TextField, useAppForm } from "@/shared/form"
import {
  contactFormSchema,
  getContactFormDefaults,
  type IContactFormValues,
} from "../model/contactForm.config"
import type { IContactFormProps } from "./ContactForm.types"
import { INSTRUMENTS } from "./ContactForm.constants"

export default function ContactForm({ onSubmitSuccess }: IContactFormProps) {
  const form = useAppForm<IContactFormValues>({
    schema: contactFormSchema,
    defaultValues: getContactFormDefaults(),
  })

  const {
    reset,
    formState: { isSubmitting },
  } = form

  const onSubmit = async () => {
    toast.success("Mensaje enviado", {
      description: "Gracias por contactarnos. Te responderemos pronto.",
    })
    reset()
    onSubmitSuccess?.()
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
        <SelectField
          name="instrument"
          label="Instrumento de interés"
          placeholder="Selecciona un instrumento"
          options={INSTRUMENTS}
        />
        <TextareaField
          name="message"
          label="Mensaje"
          placeholder="Cuéntanos qué te gustaría aprender…"
          rows={5}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-[52px] w-full gap-2 rounded-full text-[15px] font-semibold"
        >
          {isSubmitting ? (
            <Spinner className="size-4" />
          ) : (
            <Icon icon="ph:paper-plane-right" className="size-5" aria-hidden="true" />
          )}
          {isSubmitting ? "Enviando…" : "Enviar mensaje"}
        </Button>
      </Form>
    </div>
  )
}
