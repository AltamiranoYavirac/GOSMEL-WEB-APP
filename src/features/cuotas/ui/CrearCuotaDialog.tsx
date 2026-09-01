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
import { DateField, Form, NumberField, SelectField, useAppForm } from "@/shared/form";
import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import { useCrearCuota } from "../hooks/useCrearCuota";
import { getMonthOptions } from "../model/GenerarCuotasForm.config";

const crearCuotaSchema = z.object({
  estudianteId: z.string().min(1, "Selecciona un estudiante"),
  monto: z.coerce.number().positive("Ingresa un monto válido"),
  periodo: z.string().min(1, "Selecciona el período"),
  fechaVencimiento: z.string().min(1, "Selecciona la fecha de vencimiento"),
});

type TCrearCuotaValues = z.infer<typeof crearCuotaSchema>;

export default function CrearCuotaDialog() {
  const [open, setOpen] = useState(false);
  const [estudiantes, setEstudiantes] = useState<{ value: string; label: string }[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const mutation = useCrearCuota();

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const defaultDueDate = new Date(now.getFullYear(), now.getMonth(), 5).toISOString().slice(0, 10);

  const form = useAppForm<TCrearCuotaValues>({
    schema: crearCuotaSchema,
    values: {
      estudianteId: "",
      monto: 35,
      periodo: currentMonth,
      fechaVencimiento: defaultDueDate,
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

  const onSubmit = (values: TCrearCuotaValues) => {
    mutation.mutate(values, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <Icon icon="ph:receipt-bold" aria-hidden="true" />
          Nueva cuota manual
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-full max-w-xl sm:max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <AlertDialogHeader>
          <AlertDialogTitle>Crear cuota manual / extraordinaria</AlertDialogTitle>
          <AlertDialogDescription>
            Registra una cuota individual para un estudiante (ej. mensualidad especial, matrícula tardía o materiales).
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form form={form} onSubmit={onSubmit} id="crear-cuota-manual" className="flex flex-col gap-4">
          <SelectField
            name="estudianteId"
            label="Estudiante"
            placeholder={loadingOptions ? "Cargando estudiantes..." : "Selecciona un estudiante"}
            options={estudiantes}
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <NumberField
              name="monto"
              label="Monto a cobrar ($)"
              asNumber
              integerOnly={false}
              startIcon={<Icon icon="ph:currency-dollar" className="size-4" aria-hidden="true" />}
            />
            <SelectField
              name="periodo"
              label="Período"
              options={getMonthOptions()}
            />
          </div>

          <DateField name="fechaVencimiento" label="Fecha de vencimiento" />
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button form="crear-cuota-manual" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
            Crear cuota
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
