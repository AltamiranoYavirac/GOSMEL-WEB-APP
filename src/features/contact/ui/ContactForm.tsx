"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import {
  Button,
  Card,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spinner,
  Textarea,
} from "@/shared/ui";

import { contactSchema } from "../model/schemas";
import type { IContactFormValues } from "../model/contact.types";
import type { IContactFormProps } from "./ContactForm.types";
import { INSTRUMENTS } from "./ContactForm.constants";

export default function ContactForm({ onSubmitSuccess }: IContactFormProps) {
  const form = useForm<IContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const {
    reset,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async () => {
    toast.success("Mensaje enviado", {
      description: "Gracias por contactarnos. Te responderemos pronto.",
    });
    reset();
    onSubmitSuccess?.();
  };

  return (
    <Card className="h-full rounded-2xl p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary text-sm font-medium">Nombre Completo</FormLabel>
                  <FormControl>
                    <Input size="lg" placeholder="Ej. Ana García" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary text-sm font-medium">Correo Electrónico</FormLabel>
                  <FormControl>
                    <Input size="lg" type="email" placeholder="ana@ejemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="instrument"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary text-sm font-medium">Instrumento de Interés</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger size="lg" className="w-full">
                      <SelectValue placeholder="Selecciona un instrumento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {INSTRUMENTS.map(({ label, value }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary text-sm font-medium">Mensaje</FormLabel>
                <FormControl>
                  <Textarea
                    className="px-4 py-3"
                    placeholder="Cuéntanos sobre tus metas musicales..."
                    rows={6}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            size="2xl"
            disabled={isSubmitting}
            className="self-start gap-2 uppercase tracking-widest text-sm"
          >
            {isSubmitting ? (
              <Spinner className="size-4" />
            ) : (
              <Icon icon="mdi:send" width={16} height={16} aria-hidden="true" />
            )}
            {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
          </Button>
        </form>
      </Form>
    </Card>
  );
}
