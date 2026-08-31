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
  Spinner,
} from "@/shared/ui";
import { Form, TextField, useAppForm } from "@/shared/form";

import { useUpdateUsuarioContacto } from "../hooks/useUpdateUsuarioContacto";
import {
  editarContactoFormSchema,
  getEditarContactoFormDefaults,
  type IEditarContactoFormValues,
} from "../model/EditarContactoForm.config";

interface IEditarContactoDialogProps {
  usuario: {
    id: string;
    nombre: string;
    cedula: string | null;
    celular: string | null;
  };
}

export default function EditarContactoDialog({ usuario }: IEditarContactoDialogProps) {
  const [open, setOpen] = useState(false);
  const mutation = useUpdateUsuarioContacto();
  const form = useAppForm<IEditarContactoFormValues>({
    schema: editarContactoFormSchema,
    values: getEditarContactoFormDefaults(usuario.cedula, usuario.celular),
    resetOptions: { keepDirtyValues: false, keepErrors: false },
  });

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      form.reset(getEditarContactoFormDefaults(usuario.cedula, usuario.celular));
    }
  };

  const onSubmit = (values: IEditarContactoFormValues) => {
    mutation.mutate(
      { id: usuario.id, values },
      {
        onSuccess: () => setOpen(false),
      }
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={`Editar contacto de ${usuario.nombre}`}>
          <Icon icon="ph:pencil-simple" aria-hidden="true" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Editar contacto</AlertDialogTitle>
          <AlertDialogDescription>{usuario.nombre}</AlertDialogDescription>
        </AlertDialogHeader>

        <Form form={form} onSubmit={onSubmit} id={`editar-contacto-${usuario.id}`} className="flex flex-col gap-4">
          <TextField
            name="cedula"
            label="Cédula"
            placeholder="Número de cédula"
            startIcon={<Icon icon="ph:identification-card" className="size-4" aria-hidden="true" />}
          />
          <TextField
            name="celular"
            label="Celular"
            placeholder="Número de celular"
            startIcon={<Icon icon="ph:phone" className="size-4" aria-hidden="true" />}
          />
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button form={`editar-contacto-${usuario.id}`} type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? <Spinner className="size-4" /> : <Icon icon="ph:check" aria-hidden="true" />}
            Guardar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}