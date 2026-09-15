"use client";

import { Icon } from "@iconify/react";

import {
  aprobarMatriculaFormSchema,
  getAprobarMatriculaFormDefaults,
  useAprobarMatricula,
  type IAprobarMatriculaFormValues,
} from "@/entities/matricula";
import { Form, NumberField, TextField, useAppForm } from "@/shared/form";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Spinner,
} from "@/shared/ui";
import { buildCloudinaryImageUrl } from "@/shared/lib";
import { formatCurrency, formatDate, initialsOf } from "@/shared/lib/formatters";

import type { IAprobarMatriculaDialogProps } from "./AprobarMatriculaDialog.types";
import EsperaBadge from "./EsperaBadge";

export default function AprobarMatriculaDialog({ inscripcion, onClose }: IAprobarMatriculaDialogProps) {
  const mutation = useAprobarMatricula();
  const open = inscripcion !== null;

  const form = useAppForm<IAprobarMatriculaFormValues>({
    schema: aprobarMatriculaFormSchema,
    values: {
      ...getAprobarMatriculaFormDefaults(),
      inscripcionId: inscripcion?.id ?? "",
      diaCobro: 5,
    },
    resetOptions: { keepDirtyValues: false, keepErrors: false },
  });

  const onSubmit = (values: IAprobarMatriculaFormValues) => {
    mutation.mutate(values, { onSuccess: onClose });
  };

  const avatarUrl = inscripcion
    ? buildCloudinaryImageUrl(inscripcion.estudianteAvatarPublicId, "q_auto,f_auto,w_160,h_160,c_fill,g_face")
    : null;
  const precioRef = inscripcion?.precioReferencial ?? null;

  return (
    <AlertDialog open={open} onOpenChange={(next) => (next ? null : onClose())}>
      <AlertDialogContent size="xl" className="w-full gap-5 rounded-xl p-6 shadow-lg sm:p-7">
        <AlertDialogHeader className="flex-row items-center gap-4">
          <AlertDialogMedia className="mb-0 size-10 rounded-lg bg-muted text-success-fg">
            <Icon icon="ph:seal-check" className="size-6" aria-hidden="true" />
          </AlertDialogMedia>
          <div className="min-w-0">
            <AlertDialogTitle className="font-heading text-xl font-extrabold tracking-tight">
              Aprobar matrícula
            </AlertDialogTitle>
            <AlertDialogDescription>
              Define el cobro mensual para activar esta inscripción.
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        {inscripcion ? (
          <section aria-label="Resumen de la inscripción" className="border-y border-border bg-muted/35 px-4 py-4 sm:px-5">
            <div className="flex items-center gap-3">
              <Avatar size="lg" className="size-12 shrink-0 bg-muted ring-2 ring-primary-tint">
                {avatarUrl ? <AvatarImage src={avatarUrl} alt="" /> : null}
                <AvatarFallback className="bg-primary-tint text-sm font-extrabold text-primary-800">
                  {initialsOf(inscripcion.estudiante)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate font-heading text-[15px] font-extrabold tracking-tight text-foreground">
                  {inscripcion.estudiante}
                </p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {inscripcion.cursoNombre ?? "Cátedra"}
                  {inscripcion.catedraCodigo ? ` · ${inscripcion.catedraCodigo}` : ""}
                </p>
              </div>
              <EsperaBadge diasEspera={inscripcion.diasEspera} className="shrink-0" />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-border/60 pt-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Icon icon="ph:calendar-check" className="size-3.5" aria-hidden="true" />
                Inicia {formatDate(inscripcion.fechaInicio)}
              </span>
              {inscripcion.docenteNombre ? (
                <span className="inline-flex min-w-0 items-center gap-1.5">
                  <Icon icon="ph:chalkboard-teacher" className="size-3.5 shrink-0" aria-hidden="true" />
                  <span className="truncate">{inscripcion.docenteNombre}</span>
                </span>
              ) : null}
              {inscripcion.cupoMaximo !== null ? (
                <span className="inline-flex items-center gap-1.5">
                  <Icon icon="ph:users-three" className="size-3.5" aria-hidden="true" />
                  Cupo {inscripcion.cuposOcupados} de {inscripcion.cupoMaximo}
                </span>
              ) : null}
            </div>
          </section>
        ) : null}

        <Form form={form} onSubmit={onSubmit} id="aprobar-matricula" className="flex flex-col gap-4">
          {precioRef !== null ? (
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
              <div className="flex min-w-0 items-center gap-2.5">
                <Icon icon="ph:tag" className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Precio del curso</p>
                  <p className="mt-0.5 font-heading text-sm font-extrabold tracking-tight text-foreground">
                    {formatCurrency(precioRef)} <span className="font-sans text-xs font-medium text-muted-foreground">/ mes</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  form.setValue("montoMensual", precioRef, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                className="rounded-md border border-border bg-background px-3 py-2 text-xs font-bold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Aplicar precio
              </button>
            </div>
          ) : null}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <NumberField
              name="montoMensual"
              label="Monto mensual a cobrar (USD)"
              placeholder="0.00"
              integerOnly={false}
              asNumber
              startIcon={<Icon icon="ph:currency-dollar" className="size-4" aria-hidden="true" />}
            />
            <NumberField
              name="diaCobro"
              label="Día de cobro mensual"
              placeholder="1–28"
              hint="Día del mes en que se genera la cuota."
              asNumber
            />
          </div>
          <TextField
            name="motivoAjuste"
            label="Motivo de ajuste o beca (opcional)"
            placeholder="Ej: beca parcial 20%, tarifa regular acordada…"
          />
          <p className="flex gap-2.5 border-l-2 border-success/70 py-0.5 pl-3 text-xs leading-relaxed text-muted-foreground">
            <Icon icon="ph:check-circle" className="size-4 shrink-0 text-success-fg" aria-hidden="true" />
            <span>
              Al confirmar, la matrícula pasa a estado <strong>activa</strong> y se generará la primera
              cuota automáticamente.
            </span>
          </p>
        </Form>

        <AlertDialogFooter className="grid grid-cols-2 gap-3">
          <AlertDialogCancel className="mt-0 h-12 w-full font-extrabold">Cancelar</AlertDialogCancel>
          <Button
            form="aprobar-matricula"
            type="submit"
            disabled={mutation.isPending}
            className="h-12 w-full font-extrabold text-white shadow-xs"
          >
            {mutation.isPending ? (
              <Spinner className="size-4" />
            ) : (
              <Icon icon="ph:seal-check" aria-hidden="true" />
            )}
            Confirmar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
