"use client";

import { useMemo, useState } from "react";
import { Icon } from "@iconify/react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Badge,
  Button,
  Spinner,
} from "@/shared/ui";
import { Form, NumberField, SelectField, TextField, useAppForm } from "@/shared/form";
import { useCatedras } from "@/entities/catedra";

import { useEstudiantes } from "../hooks/useEstudiantes";
import { useInscribirEstudianteCatedra } from "../hooks/useInscribirEstudianteCatedra";
import {
  asignarCursoEstudianteFormSchema,
  buildAsignarCursoEstudiantePayload,
  DIA_COBRO_OPCIONES,
  getAsignarCursoEstudianteFormDefaults,
  type IAsignarCursoEstudianteFormValues,
} from "../model/AsignarCursoEstudianteForm.config";
import type { IAsignarCursoEstudianteDialogProps } from "./AsignarCursoEstudianteDialog.types";

export default function AsignarCursoEstudianteDialog({
  estudianteId: initialEstudianteId,
  estudianteNombre: initialEstudianteNombre,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  onSuccess,
}: IAsignarCursoEstudianteDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = setControlledOpen ?? setInternalOpen;

  const { data: estudiantesList } = useEstudiantes();
  const { data: catedrasList } = useCatedras();
  const inscribirMutation = useInscribirEstudianteCatedra();

  const form = useAppForm<IAsignarCursoEstudianteFormValues>({
    schema: asignarCursoEstudianteFormSchema,
    values: getAsignarCursoEstudianteFormDefaults(initialEstudianteId),
    resetOptions: { keepDirtyValues: false, keepErrors: false },
  });

  const catedraId = form.watch("catedraId");
  const estudianteId = form.watch("estudianteId");

  const estudianteOpciones = useMemo(
    () =>
      (estudiantesList ?? []).map((est) => ({
        value: est.id,
        label: est.cedula ? `${est.nombreCompleto} — C.I. ${est.cedula}` : est.nombreCompleto,
      })),
    [estudiantesList]
  );

  const catedraOpciones = useMemo(
    () =>
      (catedrasList ?? [])
        .filter((c) => c.estado === "planificada" || c.estado === "en_curso")
        .map((cat) => ({
          value: cat.id,
          label: `${cat.curso} (${cat.codigo}) — Docente: ${cat.docente ?? "Por asignar"} (${cat.activos}/${cat.cupoMaximo} cupos)`,
        })),
    [catedrasList]
  );

  const selectedCatedra = (catedrasList ?? []).find((c) => c.id === catedraId);
  const selectedStudent = (estudiantesList ?? []).find((e) => e.id === estudianteId);
  const displayName = initialEstudianteNombre ?? selectedStudent?.nombreCompleto ?? "el estudiante";

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      form.reset(getAsignarCursoEstudianteFormDefaults(initialEstudianteId));
    }
  };

  const onSubmit = (values: IAsignarCursoEstudianteFormValues) => {
    inscribirMutation.mutate(buildAsignarCursoEstudiantePayload(values), {
      onSuccess: () => {
        setOpen(false);
        if (onSuccess) onSuccess();
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      {controlledOpen === undefined && (
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Icon icon="ph:chalkboard-teacher" width={16} height={16} aria-hidden="true" />
            Asignar Curso / Cátedra
          </Button>
        </AlertDialogTrigger>
      )}

      <AlertDialogContent className="w-full max-w-2xl sm:max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 text-primary">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <Icon icon="ph:chalkboard-teacher" width={24} height={24} />
            </div>
            <div>
              <AlertDialogTitle className="text-xl font-bold">Asignar Curso y Cátedra a Estudiante</AlertDialogTitle>
              <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Inscriba a <strong>{displayName}</strong> en una cátedra activa con su docente asignado y plan de pago.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <Form form={form} onSubmit={onSubmit} id="asignar-curso-estudiante" className="flex flex-col gap-5">
          {!initialEstudianteId && (
            <SelectField
              name="estudianteId"
              label="Seleccionar estudiante"
              required
              placeholder="Buscar estudiante activo por nombre o cédula..."
              options={estudianteOpciones}
            />
          )}

          <SelectField
            name="catedraId"
            label="Cátedra y docente responsable"
            required
            placeholder="Seleccione el curso, cátedra y docente..."
            options={catedraOpciones}
          />

          {selectedCatedra && (
            <div className="space-y-3 rounded-2xl border border-border/80 bg-background/70 p-4 shadow-xs sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-foreground">{selectedCatedra.curso}</span>
                  <Badge variant="outline" className="font-mono text-xs">
                    {selectedCatedra.codigo}
                  </Badge>
                </div>
                <Badge variant="default" className="text-xs capitalize">
                  {selectedCatedra.modalidad}
                </Badge>
              </div>
              <div className="grid grid-cols-1 gap-3 border-t border-border/40 pt-1 text-xs sm:grid-cols-3">
                <div className="space-y-0.5">
                  <span className="block text-[11px] text-muted-foreground">Profesor / Docente</span>
                  <strong className="text-sm font-semibold text-foreground">
                    {selectedCatedra.docente ?? "Por asignar"}
                  </strong>
                </div>
                <div className="space-y-0.5">
                  <span className="block text-[11px] text-muted-foreground">Aula / Salón</span>
                  <strong className="text-sm font-semibold text-foreground">
                    {selectedCatedra.aula ?? "Principal"}
                  </strong>
                </div>
                <div className="space-y-0.5">
                  <span className="block text-[11px] text-muted-foreground">Disponibilidad</span>
                  <strong className="text-sm font-semibold text-foreground">
                    {selectedCatedra.activos} inscritos de {selectedCatedra.cupoMaximo} cupos
                  </strong>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4 rounded-2xl border border-border/60 bg-muted/30 p-4 sm:p-5">
            <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Condiciones del Acuerdo Financiero
            </span>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <NumberField
                name="montoMensual"
                label="Mensualidad pactada ($ USD)"
                required
                asNumber
                integerOnly={false}
                startIcon={<Icon icon="ph:currency-dollar" className="size-4" aria-hidden="true" />}
              />
              <SelectField name="diaCobro" label="Día límite de cobro" options={DIA_COBRO_OPCIONES} />
              <div className="sm:col-span-2">
                <TextField
                  name="motivoAjuste"
                  label="Observación / nota del acuerdo"
                  placeholder="Ej. Tarifa regular / Descuento por hermano / Beca..."
                />
              </div>
            </div>
          </div>
        </Form>

        <AlertDialogFooter className="pt-2 gap-3">
          <AlertDialogCancel type="button" disabled={inscribirMutation.isPending} className="h-10 px-5">
            Cancelar
          </AlertDialogCancel>
          <Button
            form="asignar-curso-estudiante"
            type="submit"
            disabled={inscribirMutation.isPending}
            className="h-10 px-6 font-semibold"
          >
            {inscribirMutation.isPending && <Spinner className="size-4 mr-2" />}
            Asignar y Matricular
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
