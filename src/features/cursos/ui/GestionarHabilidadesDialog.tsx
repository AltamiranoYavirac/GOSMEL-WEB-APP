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
  AlertDialogTrigger,
  Button,
  Skeleton,
  Spinner,
} from "@/shared/ui";
import { Form, TextField, useAppForm } from "@/shared/form";

import { useCursoHabilidades } from "../hooks/useCursoHabilidades";
import { useCrearHabilidad } from "../hooks/useCrearHabilidad";
import { useEliminarHabilidad } from "../hooks/useEliminarHabilidad";
import {
  getHabilidadFormDefaults,
  habilidadFormSchema,
  type IHabilidadFormValues,
} from "../model/HabilidadForm.config";
import type { IGestionarHabilidadesDialogProps } from "./GestionarHabilidadesDialog.types";

export default function GestionarHabilidadesDialog({
  cursoId,
  cursoNombre,
}: IGestionarHabilidadesDialogProps) {
  const [open, setOpen] = useState(false);
  const habilidades = useCursoHabilidades(cursoId, open);
  const crear = useCrearHabilidad(cursoId);
  const eliminar = useEliminarHabilidad(cursoId);

  const form = useAppForm<IHabilidadFormValues>({
    schema: habilidadFormSchema,
    defaultValues: getHabilidadFormDefaults(),
  });

  const onSubmit = (values: IHabilidadFormValues) => {
    crear.mutate(
      { habilidad: values.habilidad, orden: (habilidades.data?.length ?? 0) },
      {
        onSuccess: () => form.reset(getHabilidadFormDefaults()),
      }
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="xs" variant="outline">
          <Icon icon="ph:star" aria-hidden="true" />
          Habilidades
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <AlertDialogHeader>
          <AlertDialogTitle>Habilidades del curso</AlertDialogTitle>
          <AlertDialogDescription>{cursoNombre}</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          <Form form={form} onSubmit={onSubmit} id="crear-habilidad" className="flex items-end gap-2">
            <div className="flex-1">
              <TextField name="habilidad" label="Nueva habilidad" placeholder="Ej. Lectura a primera vista" />
            </div>
            <Button type="submit" size="default" disabled={crear.isPending}>
              {crear.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:plus" aria-hidden="true" />}
              Agregar
            </Button>
          </Form>

          <div className="space-y-2">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Habilidades registradas ({habilidades.data?.length ?? 0})
            </p>

            {habilidades.isPending ? (
              <div className="space-y-1.5">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : !habilidades.data?.length ? (
              <p className="py-3 text-center text-xs text-muted-foreground">Sin habilidades registradas.</p>
            ) : (
              <ul className="max-h-48 space-y-1.5 overflow-y-auto">
                {habilidades.data.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-2 rounded-md border border-border/60 bg-muted/40 px-3 py-1.5 text-sm"
                  >
                    <span>{item.habilidad}</span>
                    <Button
                      size="icon-xs"
                      variant="ghost"
                      disabled={eliminar.isPending}
                      onClick={() => eliminar.mutate(item.id)}
                      aria-label={`Eliminar habilidad ${item.habilidad}`}
                    >
                      <Icon icon="ph:x" className="size-3.5 text-muted-foreground hover:text-destructive" aria-hidden="true" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cerrar</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
