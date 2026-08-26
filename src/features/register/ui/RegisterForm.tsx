"use client"

import { Icon } from "@iconify/react"
import Link from "next/link"
import { toast } from "sonner"

import { AuthCard, Button, SocialAuthButtons, Spinner } from "@/shared/ui"
import { CheckboxField, Form, PasswordField, TextField, useAppForm } from "@/shared/form"
import { useSocialLogin, type TAuthProvider } from "@/shared/auth"
import { useRegister } from "../hooks/useRegister"
import { getRegisterErrorMessage } from "../model/auth-errors"
import {
  getRegisterFormDefaults,
  registerFormSchema,
  type IRegisterFormValues,
} from "../model/registerForm.config"
import PasswordStrengthMeter from "./PasswordStrengthMeter"
import type { IRegisterFormProps } from "./RegisterForm.types"

export default function RegisterForm({ onSubmitSuccess }: IRegisterFormProps) {
  const form = useAppForm<IRegisterFormValues>({
    schema: registerFormSchema,
    defaultValues: getRegisterFormDefaults(),
  })
  const register = useRegister()
  const socialLogin = useSocialLogin()

  const { watch } = form

  const password = watch("password")

  const onSubmit = async (values: IRegisterFormValues) => {
    try {
      await register.mutateAsync({
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
      })
      toast.success("Revisa tu correo", {
        description: "Te enviamos un enlace para confirmar tu cuenta.",
      })
      onSubmitSuccess?.()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : getRegisterErrorMessage("unknown_error")
      )
    }
  }

  return (
    <AuthCard
      icon="ph:piano-keys"
      title="¡Crea tu cuenta!"
      subtitle="Iniciación Artística en el Estudio GOSMEL"
      footer={
        <p className="text-center text-sm text-muted-foreground">
          ¿Ya tienes una cuenta?{" "}
          <Link
            href="/login"
            className="font-semibold uppercase tracking-widest text-primary transition hover:brightness-110"
          >
            Iniciar Sesión
          </Link>
        </p>
      }
    >
      <Form form={form} onSubmit={onSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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

        <div className="flex flex-col gap-2">
          <PasswordField
            name="password"
            label="Contraseña"
            autoComplete="new-password"
            placeholder="••••••••"
          />
          <PasswordStrengthMeter value={password} />
        </div>

        <CheckboxField
          name="acceptTerms"
          label={
            <>
              Acepto los{" "}
              <Link href="/terms" className="text-primary underline underline-offset-2">
                términos y condiciones
              </Link>
            </>
          }
        />

        <Button
          type="submit"
          size="2xl"
          disabled={register.isPending}
          className="mt-1 w-full gap-2 text-sm uppercase tracking-widest"
        >
          {register.isPending ? (
            <Spinner className="size-4" />
          ) : (
            <Icon icon="ph:user-plus" className="size-5" aria-hidden="true" />
          )}
          {register.isPending ? "Procesando..." : "Unirse a la Academia"}
        </Button>
      </Form>

      <SocialAuthButtons
        dividerLabel="O registrarse con"
        ariaLabelPrefix="Registrarse con"
        onProviderSelect={(provider) => socialLogin.mutate(provider.id as TAuthProvider)}
        disabledProviders={["apple"]}
        isPending={socialLogin.isPending}
        layout="compact"
        className="mt-8 !gap-4"
      />
    </AuthCard>
  )
}
