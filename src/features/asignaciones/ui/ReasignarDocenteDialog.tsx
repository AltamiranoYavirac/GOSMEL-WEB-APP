"use client";

import { useMemo } from "react";
import { Icon } from "@iconify/react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Badge,
  Button,
  Spinner,
} from "@/shared/ui";
import { Form, SelectField, useAppForm } from "@/shared/form";

import { useReasignarCatedras } from "../hooks/useReasignarCatedras";
import { docentesCompatibles, instrumentosRequeridos } from "../model/compatibilidad";
import {
  getReasignarDocenteFormDefaults,
  reasignarDocenteFormSchema,
  type IReasignarDocenteFormValues,
} from "../model/ReasignarDocenteForm.config";
import type { IReasignarDocenteDialogProps } from "./ReasignarDocenteDialog.types";

export default function ReasignarDocenteDialog({
  catedras,
  docentes,
  docenteSugerido,
  open,
  onOpenChange,
  onSuccess,
}: IReasignarDocenteDialogProps) {
  const mutation = useReasignarCatedras();

  const requeridos = useMemo(() => instrumentosRequeridos(catedras), [catedras]);
  const candidatos = useMemo(() => docentesCompatibles(docentes, requeridos), [docentes, requeridos]);

  const docenteInicial = useMemo(() => {
    if (docenteSugerido && candidatos.some((docente) => docente.id === docenteSugerido)) {
      return docenteSugerido;
    }
    return "";
  }, [candidatos, docenteSugerido]);

  const form = useAppForm<IReasignarDocenteFormValues>({
    schema: reasignarDocenteFormSchema,
    values: getReasignarDocenteFormDefaults(docenteInicial),
    resetOptions: { keepDirtyValues: false, keepErrors: false },
  });

  const totalActivos = catedras.reduce((acc, catedra) => acc + catedra.estudiantesActivos, 0);
  const totalSesiones = catedras.reduce((acc, catedra) => acc + catedra.sesiones, 0);
  const sinCandidatos = candidatos.length === 0;

  const onSubmit = (values: IReasignarDocenteFormValues) => {
    mutation.mutate(
      { catedraIds: catedras.map((catedra) => catedra.catedraId), docenteId: values.docenteId },
      {
        onSuccess: () => {
          onOpenChange(false);
          if (onSuccess) onSuccess();
        },
      }
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 text-primary">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <Icon icon="ph:arrows-left-right" width={24} height={24} />
            </div>
            <div>
              <AlertDialogTitle className="text-xl font-bold">
                {catedras.length === 1 ? "Reasignar cátedra" : `Reasignar ${catedras.length} cátedras`}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                El docente elegido pasará a ver estudiantes, notas, asistencia y materiales de estas cátedras.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {catedras.map((catedra) => (
              <Badge key={catedra.catedraId} variant="secondary">
                {catedra.codigo}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 rounded-xl border border-border/60 bg-muted/30 p-4 text-center">
            <div>
              <p className="font-mono text-lg font-bold text-foreground">{catedras.length}</p>
              <p className="text-xs text-muted-foreground">Cátedras</p>
            </div>
            <div>
              <p className="font-mono text-lg font-bold text-foreground">{totalActivos}</p>
              <p className="text-xs text-muted-foreground">Estudiantes activos</p>
            </div>
            <div>
              <p className="font-mono text-lg font-bold text-foreground">{totalSesiones}</p>
              <p className="text-xs text-muted-foreground">Sesiones registradas</p>
            </div>
          </div>

          {totalActivos > 0 ? (
            <p className="flex items-start gap-2 rounded-lg border border-warning-border bg-warning-tint px-3 py-2 text-xs text-warning-fg">
              <Icon icon="ph:warning" className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              Hay estudiantes matriculados: el docente anterior dejará de ver sus notas y asistencias.
            </p>
          ) : null}

          {sinCandidatos ? (
            <p className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/15 px-3 py-2 text-xs text-destructive">
              <Icon icon="ph:prohibit" className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              No hay docentes que enseñen {requeridos.length === 1 ? "el instrumento" : "los instrumentos"} de
              {catedras.length === 1 ? " esta cátedra" : " estas cátedras"}. Agrega el instrumento al docente en su
              ficha antes de reasignar.
            </p>
          ) : (
            <Form form={form} onSubmit={onSubmit} id="reasignar-docente">
              <SelectField
                name="docenteId"
                label="Nuevo docente"
                required
                placeholder="Seleccione un docente..."
                options={candidatos.map((docente) => ({ value: docente.id, label: docente.nombre }))}
              />
            </Form>
          )}
        </div>

        <AlertDialogFooter className="pt-2 gap-3">
          <AlertDialogCancel type="button" disabled={mutation.isPending} className="h-10 px-5">
            Cancelar
          </AlertDialogCancel>
          <Button
            form="reasignar-docente"
            type="submit"
            disabled={mutation.isPending || sinCandidatos}
            className="h-10 px-6 font-semibold"
          >
            {mutation.isPending && <Spinner className="size-4 mr-2" />}
            Reasignar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
