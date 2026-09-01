"use client"

import Link from "next/link"
import { toast } from "sonner"

import { Button, SocialAuthButtons, Spinner } from "@/shared/ui"
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

  const password = form.watch("password")

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
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-20">
      <div className="w-full max-w-[400px]">
        <h1 className="text-[36px] font-semibold leading-[1.1] tracking-[-0.03em]">
          Crea tu cuenta.
        </h1>
        <p className="mt-3 text-[15px] leading-[1.55] text-muted-foreground">
          Únete a GOSMEL y empieza tu camino musical.
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
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <TextField name="firstName" label="Nombre" autoComplete="given-name" placeholder="Tu nombre" />
            <TextField name="lastName" label="Apellido" autoComplete="family-name" placeholder="Tu apellido" />
          </div>

          <TextField
            name="email"
            label="Correo electrónico"
            type="email"
            autoComplete="email"
            placeholder="tucorreo@ejemplo.com"
          />

          <TextField
            name="phone"
            label="Teléfono"
            type="tel"
            autoComplete="tel"
            placeholder="+593 99 999 9999"
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

          <PasswordField
            name="confirmPassword"
            label="Confirmar contraseña"
            autoComplete="new-password"
            placeholder="••••••••"
          />

          <CheckboxField
            name="acceptTerms"
            label={
              <>
                Acepto los{" "}
                <Link href="/terms" className="text-primary underline underline-offset-2">
                  términos y condiciones
                </Link>{" "}
                y la{" "}
                <Link href="/privacy" className="text-primary underline underline-offset-2">
                  política de privacidad
                </Link>
              </>
            }
          />

          <Button
            type="submit"
            disabled={register.isPending}
            className="mt-1 h-[52px] w-full gap-2 rounded-full text-[15px] font-semibold"
          >
            {register.isPending ? <Spinner className="size-4" /> : null}
            {register.isPending ? "Procesando…" : "Crear cuenta"}
          </Button>
        </Form>

        <p className="mt-7 text-center text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-semibold text-primary transition hover:brightness-110">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
