"use client";

import { useState } from "react";
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
import { cn } from "@/shared/lib/utils";
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
import type { ICrearMatriculaDialogProps } from "./CrearMatriculaDialog.types";

function buildValues(solicitud: ISolicitudRow | null): ICrearMatriculaFormValues {
  if (!solicitud) return getCrearMatriculaFormDefaults();

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

const STEPS = ["Elegir cátedra", "Confirmar datos"] as const;

export default function CrearMatriculaDialog({ solicitud, onClose }: ICrearMatriculaDialogProps) {
  const open = solicitud !== null;
  const options = useCatedrasParaMatricula(open);
  const mutation = useCrearMatricula();
  const [step, setStep] = useState<0 | 1>(0);

  const form = useAppForm<ICrearMatriculaFormValues>({
    schema: crearMatriculaFormSchema,
    values: buildValues(solicitud),
    resetOptions: { keepDirtyValues: false, keepErrors: false },
  });
  const paraMenor = form.watch("paraMenor");

  const handleClose = () => {
    setStep(0);
    onClose();
  };

  const handleContinue = async () => {
    const ok = await form.trigger("catedraId");
    if (ok) setStep(1);
  };

  const onSubmit = (values: ICrearMatriculaFormValues) => {
    if (!solicitud) return;
    mutation.mutate({ solicitudId: solicitud.id, values }, { onSuccess: handleClose });
  };

  return (
    <AlertDialog open={open} onOpenChange={(next) => (next ? null : handleClose())}>
      <AlertDialogContent className="max-h-[90vh] w-full max-w-xl overflow-y-auto p-6 sm:p-7">
        <AlertDialogHeader>
          <AlertDialogTitle>Convertir solicitud a matrícula</AlertDialogTitle>
          <AlertDialogDescription>
            {solicitud ? `${solicitud.nombre} · ${solicitud.interes ?? "—"}` : ""}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex items-center gap-2">
          {STEPS.map((label, index) => (
            <div key={label} className="flex flex-1 items-center gap-2">
              <span
                className={cn(
                  "flex size-[22px] items-center justify-center rounded-full text-[11px] font-bold",
                  index <= step ? "bg-foreground text-background" : "bg-foreground/10 text-muted-foreground"
                )}
              >
                {index + 1}
              </span>
              <span
                className={cn(
                  "text-[12px] font-bold",
                  index <= step ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
              {index === 0 ? <span className="h-px flex-1 bg-border" /> : null}
            </div>
          ))}
        </div>

        <Form form={form} onSubmit={onSubmit} id="crear-matricula" className="flex flex-col gap-4">
          <div className={cn("flex flex-col gap-4", step === 0 ? "" : "hidden")}>
            <SelectField
              name="catedraId"
              label="Cátedra"
              placeholder="Seleccione una cátedra"
              disabled={options.isPending}
              options={(options.data ?? []).map((catedra) => ({ value: catedra.id, label: catedra.label }))}
            />
          </div>

          <div className={cn("flex flex-col gap-4", step === 1 ? "" : "hidden")}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <TextField name="nombres" label="Nombres" />
              <TextField name="apellidos" label="Apellidos" />
            </div>
            <DateField name="fechaNacimiento" label="Fecha de nacimiento" />
            <SwitchField name="paraMenor" label="El estudiante es menor de edad" />
            {paraMenor ? (
              <SelectField name="parentesco" label="Parentesco" options={PARENTESCO_OPCIONES} />
            ) : null}
            <p className="rounded-lg border border-info-border bg-info-tint px-3.5 py-2.5 text-[12px] leading-relaxed text-info-fg">
              Al crear, la matrícula queda en estado <strong>pendiente</strong> y aparecerá en la cola de
              aprobación. El monto mensual y el día de cobro se definen al aprobarla.
            </p>
          </div>
        </Form>

        <AlertDialogFooter>
          {step === 0 ? (
            <>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <Button type="button" onClick={handleContinue}>
                Continuar
                <Icon icon="ph:arrow-right" width={12} height={12} aria-hidden="true" />
              </Button>
            </>
          ) : (
            <>
              <Button type="button" variant="ghost" onClick={() => setStep(0)}>
                Atrás
              </Button>
              <Button form="crear-matricula" type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
                Crear matrícula pendiente
              </Button>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
