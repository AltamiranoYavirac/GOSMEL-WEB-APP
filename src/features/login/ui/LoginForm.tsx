"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"

import { Button, SocialAuthButtons, Spinner } from "@/shared/ui"
import { CheckboxField, Form, PasswordField, TextField, useAppForm } from "@/shared/form"
import { useSocialLogin, type TAuthProvider } from "@/shared/auth"
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
  const socialLogin = useSocialLogin()

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
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-20">
      <div className="w-full max-w-[400px]">
        <h1 className="text-[36px] font-semibold leading-[1.1] tracking-[-0.03em]">
          Bienvenido de nuevo.
        </h1>
        <p className="mt-3 text-[15px] leading-[1.55] text-muted-foreground">
          Inicia sesión para continuar con tu formación musical.
        </p>

        <SocialAuthButtons
          dividerLabel="O con tu correo"
          ariaLabelPrefix="Continuar con"
          layout="stacked"
          onProviderSelect={(provider) => socialLogin.mutate(provider.id as TAuthProvider)}
          disabledProviders={["apple"]}
          isPending={socialLogin.isPending}
          className="mt-8"
        />

        <Form form={form} onSubmit={onSubmit} className="mt-7 flex flex-col gap-5">
          <TextField
            name="email"
            label="Correo electrónico"
            type="email"
            autoComplete="email"
            placeholder="tucorreo@ejemplo.com"
          />
          <PasswordField
            name="password"
            label="Contraseña"
            autoComplete="current-password"
            placeholder="••••••••"
            externalError={serverError}
            onValueChange={() => setServerError(undefined)}
          />

          <div className="-mt-1 flex items-center justify-between">
            <CheckboxField name="rememberMe" label="Recordarme" />
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-[13.5px] font-medium text-primary transition hover:brightness-110"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <Button
            type="submit"
            disabled={login.isPending}
            className="mt-1 h-[52px] w-full gap-2 rounded-full text-[15px] font-semibold"
          >
            {login.isPending ? <Spinner className="size-4" /> : null}
            {login.isPending ? "Entrando…" : "Iniciar sesión"}
          </Button>
        </Form>

        <p className="mt-7 text-center text-sm text-muted-foreground">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="font-semibold text-primary transition hover:brightness-110">
            Crear cuenta
          </Link>
        </p>
      </div>
    </div>
  )
}
