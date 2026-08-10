"use client"

import { Icon } from "@iconify/react"
import Link from "next/link"
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
import { getLoginFormDefaults, loginFormSchema, type ILoginFormValues } from "../model/loginForm.config"
import type { ILoginFormProps } from "./LoginForm.types"

export default function LoginForm({ onSubmitSuccess }: ILoginFormProps) {
  const form = useAppForm<ILoginFormValues>({
    schema: loginFormSchema,
    defaultValues: getLoginFormDefaults(),
  })

  const {
    reset,
    formState: { isSubmitting },
  } = form

  const onSubmit = async () => {
    toast.success("Sesión iniciada", {
      description: "Bienvenido de vuelta al Estudio GOSMEL.",
    })
    reset()
    onSubmitSuccess?.()
  }

  return (
    <Card className="mx-auto w-full max-w-md gap-6 rounded-2xl bg-muted p-8">
      <CardHeader className="gap-1 text-center">
        <CardTitle className="text-3xl font-black uppercase tracking-wide text-primary">
          GOSMEL
        </CardTitle>
        <CardDescription className="text-xs uppercase tracking-widest">
          Acceso al Estudio
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form form={form} onSubmit={onSubmit} className="flex flex-col gap-4">
          <TextField
            name="email"
            label="Correo Electrónico"
            type="email"
            autoComplete="email"
            placeholder="tu@correo.com"
            startIcon={<Icon icon="ph:envelope" className="size-[18px]" aria-hidden="true" />}
          />
          <PasswordField
            name="password"
            label="Contraseña"
            autoComplete="current-password"
            placeholder="••••••••"
            startIcon={<Icon icon="ph:lock-key" className="size-[18px]" aria-hidden="true" />}
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
              <Icon icon="ph:sign-in" className="size-5" aria-hidden="true" />
            )}
            {isSubmitting ? "Entrando..." : "Entrar al Estudio"}
          </Button>
        </Form>
      </CardContent>

      <SocialAuthButtons
        dividerLabel="O continuar con"
        ariaLabelPrefix="Continuar con"
        className="px-4"
      />

      <CardContent>
        <p className="text-center text-xs text-muted-foreground">
          ¿No tienes una cuenta?{" "}
          <Link
            href="/register"
            className="font-semibold uppercase tracking-widest text-primary transition hover:brightness-110"
          >
            Iniciar Registro
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
