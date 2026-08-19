"use client"

import { useState } from "react"
import { Icon } from "@iconify/react"
import Link from "next/link"
import { toast } from "sonner"

import { AuthCard, Button, SocialAuthButtons, Spinner } from "@/shared/ui"
import { CheckboxField, Form, PasswordField, TextField, useAppForm } from "@/shared/form"
import { useLogin } from "../hooks/useLogin"
import { getLoginFormDefaults, loginFormSchema, type ILoginFormValues } from "../model/loginForm.config"
import type { ILoginFormProps } from "./LoginForm.types"

const handleForgotPassword = () => {
  toast.info("Próximamente", {
    description: "La recuperación de contraseña estará disponible muy pronto.",
  })
}

export default function LoginForm({ onSubmitSuccess }: ILoginFormProps) {
  const [serverError, setServerError] = useState<string>()
  const form = useAppForm<ILoginFormValues>({
    schema: loginFormSchema,
    defaultValues: getLoginFormDefaults(),
  })
  const login = useLogin()

  const onSubmit = async (values: ILoginFormValues) => {
    setServerError(undefined)
    try {
      await login.mutateAsync(values)
      onSubmitSuccess?.()
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "No pudimos iniciar sesión. Intenta de nuevo.")
    }
  }

  return (
    <AuthCard
      icon="ph:music-notes"
      title="Bienvenido de vuelta"
      subtitle="Accede a tu Estudio GOSMEL"
      footer={
        <p className="text-center text-sm text-muted-foreground">
          ¿No tienes una cuenta?{" "}
          <Link
            href="/register"
            className="font-semibold uppercase tracking-widest text-primary transition hover:brightness-110"
          >
            Iniciar Registro
          </Link>
        </p>
      }
    >
      <Form form={form} onSubmit={onSubmit} className="flex flex-col gap-5">
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
          externalError={serverError}
          onValueChange={() => setServerError(undefined)}
        />

        <div className="-mt-1 flex items-center justify-between">
          <CheckboxField name="rememberMe" label="Recordarme" />
          <button
            type="button"
            onClick={handleForgotPassword}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition hover:brightness-110"
          >
            <Icon icon="ph:key" className="size-3.5" aria-hidden="true" />
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <Button
          type="submit"
          size="2xl"
          disabled={login.isPending}
          className="mt-1 w-full gap-2 text-sm uppercase tracking-widest"
        >
          {login.isPending ? (
            <Spinner className="size-4" />
          ) : (
            <Icon icon="ph:sign-in" className="size-5" aria-hidden="true" />
          )}
          {login.isPending ? "Entrando..." : "Entrar al Estudio"}
        </Button>
      </Form>

      <SocialAuthButtons
        dividerLabel="O continuar con"
        ariaLabelPrefix="Continuar con"
        className="mt-8 !gap-4"
      />
    </AuthCard>
  )
}
