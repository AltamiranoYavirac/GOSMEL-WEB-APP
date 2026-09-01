"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { z } from "zod";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Spinner,
} from "@/shared/ui";
import { DateField, Form, NumberField, SelectField, TextareaField, TextField, useAppForm } from "@/shared/form";
import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import { useCrearAcuerdo } from "../hooks/useCrearAcuerdo";

const crearAcuerdoSchema = z.object({
  estudianteId: z.string().min(1, "Selecciona un estudiante"),
  montoMensual: z.coerce.number().positive("Ingresa una mensualidad válida"),
  diaCobro: z.coerce.number().min(1).max(28, "Día entre 1 y 28"),
  fechaInicio: z.string().min(1, "Selecciona la fecha de inicio"),
  fechaFin: z.string().optional(),
  motivoAjuste: z.string().optional(),
  observaciones: z.string().optional(),
});

type TCrearAcuerdoValues = z.infer<typeof crearAcuerdoSchema>;

export default function CrearAcuerdoDialog() {
  const [open, setOpen] = useState(false);
  const [estudiantes, setEstudiantes] = useState<{ value: string; label: string }[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const mutation = useCrearAcuerdo();

  const today = new Date().toISOString().slice(0, 10);

  const form = useAppForm<TCrearAcuerdoValues>({
    schema: crearAcuerdoSchema,
    values: {
      estudianteId: "",
      montoMensual: 35,
      diaCobro: 5,
      fechaInicio: today,
      fechaFin: "",
      motivoAjuste: "",
      observaciones: "",
    },
    resetOptions: { keepDirtyValues: false, keepErrors: false },
  });

  useEffect(() => {
    if (!open) return;
    const fetchEstudiantes = async () => {
      setLoadingOptions(true);
      const supabase = createSupabaseBrowserClient();
      const { data } = await supabase
        .from("estudiantes")
        .select("id, nombres, apellidos")
        .eq("activo", true)
        .order("nombres", { ascending: true })
        .limit(500);

      setEstudiantes(
        (data ?? []).map((e) => ({
          value: e.id,
          label: `${e.nombres} ${e.apellidos}`.trim(),
        }))
      );
      setLoadingOptions(false);
    };

    fetchEstudiantes();
  }, [open]);

  const onSubmit = (values: TCrearAcuerdoValues) => {
    mutation.mutate(values, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button>
          <Icon icon="ph:plus" aria-hidden="true" />
          Nuevo acuerdo
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-full max-w-2xl sm:max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <AlertDialogHeader>
          <AlertDialogTitle>Nuevo acuerdo de pago</AlertDialogTitle>
          <AlertDialogDescription>
            Pacta una mensualidad personalizada y condiciones de cobro para un estudiante.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form form={form} onSubmit={onSubmit} id="crear-acuerdo" className="flex flex-col gap-4">
          <SelectField
            name="estudianteId"
            label="Estudiante"
            placeholder={loadingOptions ? "Cargando estudiantes..." : "Selecciona un estudiante"}
            options={estudiantes}
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <NumberField
              name="montoMensual"
              label="Mensualidad acordada ($)"
              asNumber
              integerOnly={false}
              startIcon={<Icon icon="ph:currency-dollar" className="size-4" aria-hidden="true" />}
            />
            <NumberField name="diaCobro" label="Día de cobro (1–28)" asNumber />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <DateField name="fechaInicio" label="Fecha de inicio" />
            <DateField name="fechaFin" label="Fecha fin (opcional)" />
          </div>

          <TextField
            name="motivoAjuste"
            label="Motivo de ajuste / beca (Confidencial Admin)"
            placeholder="Ej. Beca parcial 20%, descuento de hermanos, etc."
          />
          <TextareaField name="observaciones" label="Observaciones administrativas (opcional)" rows={2} />
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button form="crear-acuerdo" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
            Guardar acuerdo
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
