"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  SocialAuthButtons,
  Spinner,
} from "@/shared/ui";

import { registerSchema } from "../model/schemas";
import type { IRegisterFormValues } from "../model/register.types";
import type { IRegisterFormProps } from "./RegisterForm.types";

export default function RegisterForm({ onSubmitSuccess }: IRegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<IRegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const {
    reset,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async () => {
    toast.success("Registro exitoso", {
      description: "Tu cuenta fue creada. Revisa tu correo para continuar.",
    });
    reset();
    onSubmitSuccess?.();
  };

  return (
    <Card className="w-full max-w-md mx-auto rounded-2xl bg-muted p-8 gap-6">
      <CardHeader className="text-center gap-1">
        <CardTitle className="text-3xl font-black text-primary uppercase tracking-wide">
          ¡Regístrate!
        </CardTitle>
        <CardDescription className="text-xs uppercase tracking-widest">
          Iniciación Artística
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-xs uppercase tracking-widest">
                      Nombre
                    </FormLabel>
                    <FormControl>
                      <Input size="lg" placeholder="Tu nombre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-xs uppercase tracking-widest">
                      Apellido
                    </FormLabel>
                    <FormControl>
                      <Input size="lg" placeholder="Tu apellido" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground text-xs uppercase tracking-widest">
                    Correo Electrónico
                  </FormLabel>
                  <FormControl>
                    <Input size="lg" type="email" placeholder="tu@correo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground text-xs uppercase tracking-widest">
                    Número de Celular
                  </FormLabel>
                  <FormControl>
                    <Input size="lg" type="tel" placeholder="+XX XXX XXXX XXXX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground text-xs uppercase tracking-widest">
                    Contraseña
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        size="lg"
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        className="pr-12"
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                    >
                      <Icon
                        icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
                        width={18}
                        height={18}
                        aria-hidden="true"
                      />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              size="2xl"
              disabled={isSubmitting}
              className="w-full gap-2 uppercase tracking-widest text-sm mt-2"
            >
              {isSubmitting ? (
                <Spinner className="size-4" />
              ) : (
                <Icon icon="mdi:account-plus" width={20} height={20} aria-hidden="true" />
              )}
              {isSubmitting ? "Procesando..." : "Unirse a la Academia"}
            </Button>
          </form>
        </Form>
      </CardContent>

      <SocialAuthButtons
        dividerLabel="O registrarse con"
        ariaLabelPrefix="Registrarse con"
        layout="compact"
        className="px-4"
      />
    </Card>
  );
}
