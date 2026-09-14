"use client";

import { Icon } from "@iconify/react";

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
import { DateField, Form, NumberField, SelectField, TextField, useAppForm } from "@/shared/form";

import { useCatedraOptions } from "../hooks/useCatedraOptions";
import { useUpdateCatedra } from "../hooks/useUpdateCatedra";
import {
  editarCatedraFormSchema,
  ESTADO_CATEDRA_OPCIONES,
  getEditarCatedraFormDefaults,
  MODALIDAD_OPCIONES,
  type IEditarCatedraFormValues,
} from "../model/EditarCatedraForm.config";
import type { IEditarCatedraDialogProps } from "./EditarCatedraDialog.types";

export default function EditarCatedraDialog({
  catedra,
  open,
  onOpenChange,
  onSuccess,
}: IEditarCatedraDialogProps) {
  const { data: options, isPending: optionsPending } = useCatedraOptions(open);
  const updateMutation = useUpdateCatedra();

  const form = useAppForm<IEditarCatedraFormValues>({
    schema: editarCatedraFormSchema,
    values: getEditarCatedraFormDefaults({
      codigo: catedra?.codigo ?? "",
      cursoId: catedra?.cursoId ?? "",
      docenteId: catedra?.docenteId ?? "",
      modalidad: catedra?.modalidad ?? "presencial",
      aula: catedra?.aula ?? "",
      cupoMaximo: catedra?.cupoMaximo ?? 15,
      fechaInicio: catedra?.fechaInicio ?? "",
      fechaFin: catedra?.fechaFin ?? "",
      estado: catedra?.estado ?? "planificada",
    }),
    resetOptions: { keepDirtyValues: false, keepErrors: false },
  });

  if (!catedra) return null;

  const onSubmit = (values: IEditarCatedraFormValues) => {
    updateMutation.mutate(
      {
        id: catedra.id,
        codigo: values.codigo,
        curso_id: values.cursoId,
        docente_id: values.docenteId,
        cupo_maximo: values.cupoMaximo,
        aula: values.aula?.trim() || null,
        modalidad: values.modalidad,
        estado: values.estado,
        fecha_inicio: values.fechaInicio,
        fecha_fin: values.fechaFin || null,
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
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-full max-w-2xl sm:max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 text-primary">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <Icon icon="ph:chalkboard" width={24} height={24} />
            </div>
            <div>
              <AlertDialogTitle className="text-xl font-bold">
                Editar Cátedra {catedra.codigo}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Modifique los datos de la cátedra. Todos los campos requeridos deben estar completos.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <Form form={form} onSubmit={onSubmit} id="editar-catedra" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1">
            <TextField name="codigo" label="Código" placeholder="Ej. CAT-2026-01" />

            <SelectField
              name="cursoId"
              label="Curso"
              placeholder="Seleccione un curso"
              disabled={optionsPending}
              options={(options?.cursos ?? []).map((curso) => ({ value: curso.id, label: curso.nombre }))}
            />

            <div className="sm:col-span-2">
              <SelectField
                name="docenteId"
                label="Docente Asignado"
                placeholder="Seleccione docente responsable..."
                disabled={optionsPending}
                options={(options?.docentes ?? []).map((d) => ({ value: d.id, label: d.nombre }))}
              />
            </div>

            <NumberField name="cupoMaximo" label="Cupo Máximo" placeholder="15" asNumber />

            <TextField name="aula" label="Aula / Salón" placeholder="Ej. Aula 201, Sala de Piano..." />

            <SelectField name="modalidad" label="Modalidad" options={MODALIDAD_OPCIONES} />

            <SelectField name="estado" label="Estado Operativo" options={ESTADO_CATEDRA_OPCIONES} />

            <DateField name="fechaInicio" label="Inicio" />

            <DateField name="fechaFin" label="Fin (opcional)" />
          </div>
        </Form>

        <AlertDialogFooter className="pt-2 gap-3">
          <AlertDialogCancel type="button" disabled={updateMutation.isPending} className="h-10 px-5">
            Cancelar
          </AlertDialogCancel>
          <Button form="editar-catedra" type="submit" disabled={updateMutation.isPending} className="h-10 px-6 font-semibold">
            {updateMutation.isPending && <Spinner className="size-4 mr-2" />}
            Guardar Cambios
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
