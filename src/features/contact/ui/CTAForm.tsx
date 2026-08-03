"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";

import { Button, Input } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";
import { useSubmitLead } from "../hooks/useSubmitLead";
import { contactLeadSchema } from "../model/schemas";
import type { TContactLeadValues } from "../model/contact.types";
import type { ICTAFormProps } from "./CTAForm.types";

export default function CTAForm({ className }: ICTAFormProps) {
  const submitLead = useSubmitLead();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TContactLeadValues>({
    resolver: zodResolver(contactLeadSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (values: TContactLeadValues) =>
    submitLead.mutate(values, { onSuccess: () => reset() });

  if (submitLead.isSuccess) {
    return (
      <p className={cn("max-w-md mx-auto text-center text-ginger", className)}>
        ¡Gracias! Te contactaremos pronto.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className={cn("max-w-md mx-auto flex flex-col gap-4", className)}
    >
      <Input
        type="email"
        placeholder="Tu correo electrónico"
        icon={<Icon icon="ph:envelope" aria-hidden="true" />}
        error={!!errors.email}
        {...register("email")}
      />
      {errors.email && (
        <span className="text-sm text-red-400">{errors.email.message}</span>
      )}
      <Button
        type="submit"
        disabled={submitLead.isPending}
        className="w-full bg-ginger hover:bg-burnt text-cream h-auto px-8 py-4 font-bold uppercase tracking-wider rounded-lg"
      >
        {submitLead.isPending ? "Enviando..." : "Solicitar Info"}
      </Button>
    </form>
  );
}
