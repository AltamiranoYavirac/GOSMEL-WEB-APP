"use client";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, Button, Spinner } from "@/shared/ui";
import { Form, SelectField, TextareaField, useAppForm } from "@/shared/form";
import { useRepresentantesPorEstudiante } from "@/entities/representante";
import { useCambiarResponsableAcuerdo } from "../hooks/useCambiarResponsableAcuerdo";
import { cambiarResponsableFormSchema, getCambiarResponsableFormDefaults, SIN_RESPONSABLE_VALUE, type ICambiarResponsableFormValues } from "../model/CambiarResponsableForm.config";
import type { IAcuerdoRow } from "../model/acuerdo.types";

export default function CambiarResponsableDialog({ acuerdo }: { acuerdo: IAcuerdoRow }) {
  const [open, setOpen] = useState(false);
  const { data: representantes = [] } = useRepresentantesPorEstudiante(open ? acuerdo.estudianteId : null);
  const mutation = useCambiarResponsableAcuerdo();
  const form = useAppForm<ICambiarResponsableFormValues>({ schema: cambiarResponsableFormSchema, values: getCambiarResponsableFormDefaults() });
  const options = [{ value: SIN_RESPONSABLE_VALUE, label: "Estudiante paga por sí mismo" }, ...representantes.map((r) => ({ value: r.id, label: r.nombre }))];
  const onSubmit = (values: ICambiarResponsableFormValues) => mutation.mutate({ acuerdoId: acuerdo.id, representanteId: values.representanteId === SIN_RESPONSABLE_VALUE ? null : values.representanteId || null, motivo: values.motivo }, { onSuccess: () => setOpen(false) });
  return <AlertDialog open={open} onOpenChange={setOpen}>
    <AlertDialogTrigger asChild><Button size="icon-xs" variant="ghost" aria-label={`Cambiar responsable de ${acuerdo.estudiante}`}><Icon icon="ph:user-switch" className="size-4" aria-hidden="true" /></Button></AlertDialogTrigger>
    <AlertDialogContent className="w-full max-w-lg p-6"><AlertDialogHeader><AlertDialogTitle>Cambiar responsable de pago</AlertDialogTitle><AlertDialogDescription>{acuerdo.estudiante}. El cambio conserva la deuda pendiente y debe quedar auditado.</AlertDialogDescription></AlertDialogHeader>
      <Form form={form} onSubmit={onSubmit} id={`cambiar-responsable-${acuerdo.id}`} className="space-y-4"><SelectField name="representanteId" label="Nuevo responsable" options={options} /><TextareaField name="motivo" label="Motivo obligatorio" rows={3} /></Form>
      <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><Button form={`cambiar-responsable-${acuerdo.id}`} type="submit" disabled={mutation.isPending}>{mutation.isPending ? <Spinner className="size-4" /> : null}Guardar cambio</Button></AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>;
}
