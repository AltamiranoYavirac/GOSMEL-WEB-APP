"use client";

import { useEffect } from "react";
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
import { DateField, Form, SelectField, SwitchField, TextField, useAppForm } from "@/shared/form";

import { useCatedrasParaMatricula } from "../hooks/useCatedrasParaMatricula";
import { useCrearMatricula } from "../hooks/useCrearMatricula";
import {
  crearMatriculaFormSchema,
  getCrearMatriculaFormDefaults,
  PARENTESCO_OPCIONES,
  type ICrearMatriculaFormValues,
} from "../model/CrearMatriculaForm.config";
import type { ISolicitudRow } from "../model/solicitud.types";

interface ICrearMatriculaDialogProps {
  solicitud: ISolicitudRow | null;
  onClose: () => void;
}

function buildDefaults(solicitud: ISolicitudRow): ICrearMatriculaFormValues {
  const nombreCompleto =
    solicitud.paraMenor && solicitud.estudianteNombre ? solicitud.estudianteNombre : solicitud.nombre;
  const parts = nombreCompleto.trim().split(/\s+/);
  const apellidos = parts.length > 1 ? parts.slice(-1)[0] : "";
  const nombres = parts.slice(0, -1).join(" ") || nombreCompleto.trim();

  return {
    ...getCrearMatriculaFormDefaults(),
    nombres,
    apellidos,
    fechaNacimiento: solicitud.estudianteFechaNacimiento ?? "",
    paraMenor: solicitud.paraMenor,
    parentesco: solicitud.parentesco ?? "otro",
  };
}

export default function CrearMatriculaDialog({ solicitud, onClose }: ICrearMatriculaDialogProps) {
  const open = !!solicitud;
  const options = useCatedrasParaMatricula(open);
  const mutation = useCrearMatricula();
  const form = useAppForm<ICrearMatriculaFormValues>({
    schema: crearMatriculaFormSchema,
    defaultValues: getCrearMatriculaFormDefaults(),
  });
  const paraMenor = form.watch("paraMenor");

  useEffect(() => {
    if (solicitud) {
      form.reset(buildDefaults(solicitud));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solicitud]);

  const onSubmit = (values: ICrearMatriculaFormValues) => {
    if (!solicitud) return;
    mutation.mutate(
      { solicitudId: solicitud.id, values },
      {
        onSuccess: onClose,
      }
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={(next) => (next ? undefined : onClose())}>
      <AlertDialogContent className="w-full max-w-2xl sm:max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <AlertDialogHeader>
          <AlertDialogTitle>Crear matrícula</AlertDialogTitle>
          <AlertDialogDescription>
            {solicitud ? `${solicitud.nombre} · ${solicitud.interes ?? "—"}` : ""}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form form={form} onSubmit={onSubmit} id="crear-matricula" className="flex flex-col gap-4">
          <SelectField
            name="catedraId"
            label="Cátedra"
            placeholder="Seleccione una cátedra"
            disabled={options.isPending}
            options={(options.data ?? []).map((catedra) => ({ value: catedra.id, label: catedra.label }))}
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TextField name="nombres" label="Nombres" />
            <TextField name="apellidos" label="Apellidos" />
          </div>

          <DateField name="fechaNacimiento" label="Fecha de nacimiento" />

          <SwitchField name="paraMenor" label="El estudiante es menor de edad" />

          {paraMenor ? <SelectField name="parentesco" label="Parentesco" options={PARENTESCO_OPCIONES} /> : null}
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button form="crear-matricula" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
            Crear matrícula
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}