"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import Link from "next/link";
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

import { loginSchema } from "../model/schemas";
import type { ILoginFormValues } from "../model/login.types";
import type { ILoginFormProps } from "./LoginForm.types";

export default function LoginForm({ onSubmitSuccess }: ILoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<ILoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const {
    reset,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async () => {
    toast.success("Sesión iniciada", {
      description: "Bienvenido de vuelta al Estudio GOSMEL.",
    });
    reset();
    onSubmitSuccess?.();
  };

  return (
    <Card className="w-full max-w-md mx-auto rounded-2xl bg-muted p-8 gap-6">
      <CardHeader className="text-center gap-1">
        <CardTitle className="text-3xl font-black text-primary uppercase tracking-wide">
          GOSMEL
        </CardTitle>
        <CardDescription className="text-xs uppercase tracking-widest">
          Acceso al Estudio
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground text-xs uppercase tracking-widest">
                    Correo Electrónico
                  </FormLabel>
                  <FormControl>
                    <Input
                      size="lg"
                      icon={
                        <Icon icon="mdi:email-outline" width={18} height={18} aria-hidden="true" />
                      }
                      iconPosition="start"
                      placeholder="tu@correo.com"
                      type="email"
                      {...field}
                    />
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
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-muted-foreground text-xs uppercase tracking-widest">
                      Contraseña
                    </FormLabel>
                    <span className="text-primary text-xs uppercase tracking-widest font-semibold cursor-pointer hover:brightness-110 transition">
                      ¿Olvidaste?
                    </span>
                  </div>
                  <div className="relative">
                    <FormControl>
                      <Input
                        size="lg"
                        icon={
                          <Icon icon="mdi:lock-outline" width={18} height={18} aria-hidden="true" />
                        }
                        iconPosition="start"
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
                <Icon icon="mdi:login" width={20} height={20} aria-hidden="true" />
              )}
              {isSubmitting ? "Entrando..." : "Entrar al Estudio"}
            </Button>
          </form>
        </Form>
      </CardContent>

      <SocialAuthButtons
        dividerLabel="O continuar con"
        ariaLabelPrefix="Continuar con"
        className="px-4"
      />

      <CardContent>
        <p className="text-center text-muted-foreground text-xs">
          ¿No tienes una cuenta?{" "}
          <Link
            href="/register"
            className="text-primary font-semibold uppercase tracking-widest hover:brightness-110 transition"
          >
            Iniciar Registro
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
