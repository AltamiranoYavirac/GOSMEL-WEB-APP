"use client"

import { Icon } from "@iconify/react"
import { toast } from "sonner"

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  SocialAuthButtons,
  Spinner,
} from "@/shared/ui"
import { Form, PasswordField, TextField, useAppForm } from "@/shared/form"
import {
  getRegisterFormDefaults,
  registerFormSchema,
  type IRegisterFormValues,
} from "../model/registerForm.config"
import type { IRegisterFormProps } from "./RegisterForm.types"

export default function RegisterForm({ onSubmitSuccess }: IRegisterFormProps) {
  const form = useAppForm<IRegisterFormValues>({
    schema: registerFormSchema,
    defaultValues: getRegisterFormDefaults(),
  })

  const {
    reset,
    formState: { isSubmitting },
  } = form

  const onSubmit = async () => {
    toast.success("Registro exitoso", {
      description: "Tu cuenta fue creada. Revisa tu correo para continuar.",
    })
    reset()
    onSubmitSuccess?.()
  }

  return (
    <Card className="mx-auto w-full max-w-md gap-6 rounded-2xl bg-muted p-8">
      <CardHeader className="gap-1 text-center">
        <CardTitle className="text-3xl font-black uppercase tracking-wide text-primary">
          ¡Regístrate!
        </CardTitle>
        <CardDescription className="text-xs uppercase tracking-widest">
          Iniciación Artística
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form form={form} onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField
              name="firstName"
              label="Nombre"
              autoComplete="given-name"
              placeholder="Tu nombre"
            />
            <TextField
              name="lastName"
              label="Apellido"
              autoComplete="family-name"
              placeholder="Tu apellido"
            />
          </div>

          <TextField
            name="email"
            label="Correo Electrónico"
            type="email"
            autoComplete="email"
            placeholder="tu@correo.com"
          />

          <TextField
            name="phone"
            label="Número de Celular"
            type="tel"
            autoComplete="tel"
            placeholder="+XX XXX XXXX XXXX"
          />

          <PasswordField
            name="password"
            label="Contraseña"
            autoComplete="new-password"
            placeholder="••••••••"
          />

          <Button
            type="submit"
            size="2xl"
            disabled={isSubmitting}
            className="mt-2 w-full gap-2 text-sm uppercase tracking-widest"
          >
            {isSubmitting ? (
              <Spinner className="size-4" />
            ) : (
              <Icon icon="ph:user-plus" className="size-5" aria-hidden="true" />
            )}
            {isSubmitting ? "Procesando..." : "Unirse a la Academia"}
          </Button>
        </Form>
      </CardContent>

      <SocialAuthButtons
        dividerLabel="O registrarse con"
        ariaLabelPrefix="Registrarse con"
        layout="compact"
        className="px-4"
      />
    </Card>
  )
}
