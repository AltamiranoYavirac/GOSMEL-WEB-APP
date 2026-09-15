"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, Badge, Button, Spinner } from "@/shared/ui";
import { CheckboxField, Form, SelectField, useAppForm } from "@/shared/form";
import { useRepresentantes } from "@/entities/representante";

import { useDesvincularRepresentante } from "../hooks/useDesvincularRepresentante";
import { useVincularRepresentante } from "../hooks/useVincularRepresentante";
import { getVincularRepresentanteFormDefaults, PARENTESCO_REPRESENTANTE_OPCIONES, vincularRepresentanteFormSchema, type IVincularRepresentanteFormValues } from "../model/VincularRepresentanteForm.config";
import type { IEstudianteDetalle } from "../model/estudiante-detalle.types";

export default function GestionarRepresentantesDialog({ estudianteId, detalle }: { estudianteId: string; detalle: IEstudianteDetalle }) {
  const [open, setOpen] = useState(false);
  const { data: representantes = [] } = useRepresentantes();
  const vincular = useVincularRepresentante();
  const desvincular = useDesvincularRepresentante();
  const form = useAppForm<IVincularRepresentanteFormValues>({ schema: vincularRepresentanteFormSchema, values: getVincularRepresentanteFormDefaults() });
  const vinculados = new Set(detalle.representantes.map((vinculo) => vinculo.representanteId));
  const opciones = representantes.filter((representante) => !vinculados.has(representante.id)).map((representante) => ({ value: representante.id, label: representante.nombre }));
  const onSubmit = (values: IVincularRepresentanteFormValues) => vincular.mutate({ estudianteId, ...values }, { onSuccess: () => form.reset(getVincularRepresentanteFormDefaults()) });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild><Button size="xs" variant="outline"><Icon icon="ph:users-three" aria-hidden="true" />Gestionar</Button></AlertDialogTrigger>
      <AlertDialogContent className="max-h-[90vh] w-full max-w-xl overflow-y-auto p-6">
        <AlertDialogHeader><AlertDialogTitle>Representantes de {detalle.nombre}</AlertDialogTitle></AlertDialogHeader>
        <div className="space-y-2">{detalle.representantes.length ? detalle.representantes.map((vinculo) => <div key={vinculo.representanteId} className="flex items-center justify-between rounded-lg border p-3"><div><p className="font-medium">{vinculo.nombre} {vinculo.esContactoPrincipal ? <Badge variant="default" className="ml-2">Principal</Badge> : null}</p><p className="text-xs text-muted-foreground">{vinculo.parentesco.replace("_", " ")} · {vinculo.autorizaRetiro ? "Autoriza retiro" : "No autoriza retiro"}</p></div><Button type="button" size="xs" variant="ghost" className="text-destructive" disabled={desvincular.isPending} onClick={() => desvincular.mutate({ estudianteId, representanteId: vinculo.representanteId })}>Desvincular</Button></div>) : <p className="text-sm text-muted-foreground">No hay representantes vinculados.</p>}</div>
        <Form form={form} onSubmit={onSubmit} id={`vincular-representante-${estudianteId}`} className="mt-4 space-y-3 border-t pt-4"><SelectField name="representanteId" label="Nuevo representante" placeholder="Selecciona una persona" options={opciones} /><SelectField name="parentesco" label="Parentesco" options={[...PARENTESCO_REPRESENTANTE_OPCIONES]} /><div className="grid grid-cols-1 gap-2 sm:grid-cols-2"><CheckboxField name="esContactoPrincipal" label="Contacto principal" /><CheckboxField name="autorizaRetiro" label="Autoriza retiro" /></div></Form>
        <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><Button form={`vincular-representante-${estudianteId}`} type="submit" disabled={vincular.isPending || opciones.length === 0}>{vincular.isPending ? <Spinner className="size-4" /> : null}Vincular</Button></AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
