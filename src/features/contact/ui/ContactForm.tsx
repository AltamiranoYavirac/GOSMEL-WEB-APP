"use client"

import { Icon } from "@iconify/react"
import { toast } from "sonner"

import { Button, Card, Spinner } from "@/shared/ui"
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
    <Card className="h-full rounded-2xl p-8">
      <Form form={form} onSubmit={onSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            name="fullName"
            label="Nombre Completo"
            placeholder="Ej. Ana García"
          />
          <TextField
            name="email"
            label="Correo Electrónico"
            type="email"
            placeholder="ana@ejemplo.com"
          />
        </div>

        <SelectField
          name="instrument"
          label="Instrumento de Interés"
          placeholder="Selecciona un instrumento"
          options={INSTRUMENTS}
        />

        <TextareaField
          name="message"
          label="Mensaje"
          placeholder="Cuéntanos sobre tus metas musicales..."
          rows={6}
        />

        <Button
          type="submit"
          size="2xl"
          disabled={isSubmitting}
          className="self-start gap-2 text-sm uppercase tracking-widest"
        >
          {isSubmitting ? (
            <Spinner className="size-4" />
          ) : (
            <Icon icon="ph:paper-plane-right" className="size-4" aria-hidden="true" />
          )}
          {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
        </Button>
      </Form>
    </Card>
  )
}
