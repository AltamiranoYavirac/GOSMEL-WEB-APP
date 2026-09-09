"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Spinner,
} from "@/shared/ui";
import { CheckboxField, Form, TextareaField, useAppForm } from "@/shared/form";

import { useDarDeBajaEstudiante } from "../hooks/useDarDeBajaEstudiante";
import {
  bajaEstudianteFormSchema,
  getBajaEstudianteFormDefaults,
  type IBajaEstudianteFormValues,
} from "../model/BajaEstudianteForm.config";
import type { IBajaEstudianteDialogProps } from "./BajaEstudianteDialog.types";

export default function BajaEstudianteDialog({
  inscripcionId,
  estudianteNombre,
  open,
  onOpenChange,
  onSuccess,
}: IBajaEstudianteDialogProps) {
  const bajaMutation = useDarDeBajaEstudiante();

  const form = useAppForm<IBajaEstudianteFormValues>({
    schema: bajaEstudianteFormSchema,
    values: getBajaEstudianteFormDefaults(),
    resetOptions: { keepDirtyValues: false, keepErrors: false },
  });

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
    if (next) {
      form.reset(getBajaEstudianteFormDefaults());
    }
  };

  const onSubmit = (values: IBajaEstudianteFormValues) => {
    bajaMutation.mutate(
      {
        inscripcionId,
        motivo: values.motivo ?? "",
        condonarCuotasPendientes: values.condonarCuotasPendientes,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          if (onSuccess) onSuccess();
        },
      }
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="w-full max-w-xl sm:max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">Tramitar Baja Administrativa</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Está seguro de tramitar el retiro de <strong>{estudianteNombre}</strong>? Esta acción finalizará su
            matrícula y su acuerdo de pago activo.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form form={form} onSubmit={onSubmit} id="baja-estudiante" className="flex flex-col gap-4">
          <TextareaField
            name="motivo"
            label="Motivo del retiro"
            rows={3}
            placeholder="Ej. Cambio de ciudad, incompatibilidad de horarios..."
          />

          <div className="pt-2 border-t border-border/40">
            <CheckboxField
              name="condonarCuotasPendientes"
              label={
                <span className="grid gap-1 leading-none">
                  <span className="text-xs font-semibold">Condonar cuotas impagas pendientes</span>
                  <span className="text-[11px] font-normal text-muted-foreground">
                    Si se marca, las cuotas pendientes del acuerdo pasarán a estado condonado para no generar cartera
                    vencida.
                  </span>
                </span>
              }
            />
          </div>
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel type="button" disabled={bajaMutation.isPending}>
            Cancelar
          </AlertDialogCancel>
          <Button form="baja-estudiante" variant="destructive" type="submit" disabled={bajaMutation.isPending}>
            {bajaMutation.isPending && <Spinner className="size-4 mr-2" />}
            Confirmar Retiro
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
