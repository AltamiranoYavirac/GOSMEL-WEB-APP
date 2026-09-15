"use client";

import { useEffect } from "react";
import { addMonths, format, parseISO } from "date-fns";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

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
import { DateField, Form, SelectField, useAppForm } from "@/shared/form";

import { useCatedrasParaHorarios } from "../hooks/useCatedrasParaHorarios";
import { useGenerarSesionesCatedra } from "../hooks/useGenerarSesionesCatedra";
import {
  generarSesionesCatedraFormSchema,
  getGenerarSesionesCatedraFormDefaults,
  type IGenerarSesionesCatedraFormValues,
} from "../model/GenerarSesionesCatedraForm.config";
import type { IGenerarSesionesCatedraDialogProps } from "./GenerarSesionesCatedraDialog.types";

export default function GenerarSesionesCatedraDialog({
  open,
  onOpenChange,
  onSuccess,
}: IGenerarSesionesCatedraDialogProps) {
  const catedras = useCatedrasParaHorarios(open);
  const genMutation = useGenerarSesionesCatedra();

  const form = useAppForm<IGenerarSesionesCatedraFormValues>({
    schema: generarSesionesCatedraFormSchema,
    defaultValues: getGenerarSesionesCatedraFormDefaults(),
  });

  const catedraId = form.watch("catedraId");
  const fechaDesde = form.watch("fechaDesde");
  const catedra = (catedras.data ?? []).find((item) => item.id === catedraId) ?? null;
  const cicloInicio = catedra?.fechaInicio ?? "";
  const cicloFin = catedra?.fechaFin ?? "";
  const sinInscripciones = !!catedra && catedra.activos === 0 && catedra.pendientes === 0;
  const soloPendientes = !!catedra && catedra.activos === 0 && catedra.pendientes > 0;

  useEffect(() => {
    if (!catedra) return;

    const desde = form.getValues("fechaDesde");
    const hasta = form.getValues("fechaHasta");
    const dentroDelCiclo =
      desde &&
      desde >= catedra.fechaInicio &&
      (!catedra.fechaFin || hasta <= catedra.fechaFin);

    if (dentroDelCiclo) return;

    form.setValue("fechaDesde", catedra.fechaInicio);
    form.setValue("fechaHasta", catedra.fechaFin ?? format(addMonths(parseISO(catedra.fechaInicio), 4), "yyyy-MM-dd"));
  }, [catedra, form]);

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
    if (next) {
      form.reset(getGenerarSesionesCatedraFormDefaults());
    }
  };

  const onSubmit = (values: IGenerarSesionesCatedraFormValues) => {
    if (!catedra) return;

    if (sinInscripciones) {
      toast.error("La cátedra no tiene estudiantes. Matricula al menos uno antes de generar el calendario.");
      return;
    }

    if (values.fechaDesde < catedra.fechaInicio || (catedra.fechaFin && values.fechaHasta > catedra.fechaFin)) {
      toast.error("El rango debe estar dentro del ciclo de la cátedra.");
      return;
    }

    genMutation.mutate(
      { catedraId: values.catedraId, fechaDesde: values.fechaDesde, fechaHasta: values.fechaHasta },
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
      <AlertDialogContent className="w-full max-w-2xl sm:max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 text-primary">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <Icon icon="ph:calendar-check" width={24} height={24} />
            </div>
            <div>
              <AlertDialogTitle className="text-xl font-bold">Generar sesiones del ciclo</AlertDialogTitle>
              <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Se generan las clases según los días y horas del horario de la cátedra, dentro de su ciclo.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <Form form={form} onSubmit={onSubmit} id="generar-sesiones-catedra" className="flex flex-col gap-4">
          <SelectField
            name="catedraId"
            label="Cátedra"
            placeholder="Seleccionar cátedra"
            disabled={catedras.isPending}
            options={(catedras.data ?? []).map((item) => ({ value: item.id, label: item.label }))}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DateField name="fechaDesde" label="Desde" required min={cicloInicio || undefined} max={cicloFin || undefined} />
            <DateField
              name="fechaHasta"
              label="Hasta"
              required
              min={fechaDesde || cicloInicio || undefined}
              max={cicloFin || undefined}
            />
          </div>

          {sinInscripciones ? (
            <div className="flex items-center gap-3 rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-xs text-destructive">
              <Icon icon="ph:warning-circle" width={20} height={20} className="shrink-0" aria-hidden="true" />
              <span>
                Esta cátedra no tiene estudiantes. Matricula al menos uno —o espera una solicitud— antes de generar el
                calendario.
              </span>
            </div>
          ) : null}

          {soloPendientes ? (
            <div className="flex items-center gap-3 rounded-2xl border border-warning-border bg-warning-tint p-4 text-xs text-warning-fg">
              <Icon icon="ph:warning" width={20} height={20} className="shrink-0" aria-hidden="true" />
              <span>
                Esta cátedra no tiene matriculados activos, pero tiene {catedra?.pendientes}{" "}
                {catedra?.pendientes === 1 ? "solicitud" : "solicitudes"} en trámite. Puedes generar el calendario, pero
                aún no hay alumnos confirmados.
              </span>
            </div>
          ) : null}

          <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/40 p-4 text-xs text-muted-foreground">
            <Icon icon="ph:info" width={20} height={20} className="shrink-0 text-primary" />
            <span>
              {cicloInicio
                ? `Ciclo de la cátedra: ${cicloInicio}${cicloFin ? ` → ${cicloFin}` : " (sin fecha de fin)"}. Las clases que ya existan en esas fechas no se duplicarán.`
                : "Selecciona una cátedra para acotar el rango a su ciclo."}
            </span>
          </div>
        </Form>

        <AlertDialogFooter className="pt-2 gap-3">
          <AlertDialogCancel type="button" disabled={genMutation.isPending} className="h-10 px-5">
            Cancelar
          </AlertDialogCancel>
          <Button
            form="generar-sesiones-catedra"
            type="submit"
            disabled={genMutation.isPending || !catedra || sinInscripciones}
            className="h-10 px-6 font-semibold"
          >
            {genMutation.isPending && <Spinner className="size-4 mr-2" />}
            Generar calendario
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
