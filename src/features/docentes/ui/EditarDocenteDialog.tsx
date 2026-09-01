"use client";

import { useEffect, useState } from "react";
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
  Checkbox,
  Input,
  Label,
  Spinner,
  Textarea,
} from "@/shared/ui";
import { useDocenteDetalle } from "../hooks/useDocenteDetalle";
import { useUpdateDocente } from "../hooks/useUpdateDocente";
import type { IEditarDocenteDialogProps } from "./EditarDocenteDialog.types";

export default function EditarDocenteDialog({
  docente,
  open,
  onOpenChange,
  onSuccess,
}: IEditarDocenteDialogProps) {
  const { data: detalle } = useDocenteDetalle(docente?.id ?? "", Boolean(open && docente));
  const updateMutation = useUpdateDocente();

  const [titulo, setTitulo] = useState("");
  const [experiencia, setExperiencia] = useState("0");
  const [biografia, setBiografia] = useState("");
  const [publicado, setPublicado] = useState(false);
  const [destacado, setDestacado] = useState(false);

  useEffect(() => {
    if (detalle) {
      setTitulo(detalle.titulo ?? "");
      setExperiencia(String(detalle.aniosExperiencia ?? 0));
      setBiografia(detalle.biografia ?? "");
      setPublicado(detalle.publicado ?? false);
      setDestacado(detalle.destacado ?? false);
    }
  }, [detalle]);

  if (!docente) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(
      {
        id: docente.id,
        patch: {
          titulo_profesional: titulo || undefined,
          anios_experiencia: parseInt(experiencia, 10) || 0,
          biografia: biografia || undefined,
          publicado,
          destacado,
        },
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
        <form onSubmit={handleSubmit} className="space-y-6">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 text-primary">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Icon icon="ph:pencil-simple" width={24} height={24} />
              </div>
              <div>
                <AlertDialogTitle className="text-xl font-bold">Editar Perfil Docente</AlertDialogTitle>
                <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Actualice los datos profesionales y de difusión de {docente.nombre}.
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1">
            <div className="space-y-2">
              <Label htmlFor="edit-doc-titulo">Título Profesional</Label>
              <Input
                id="edit-doc-titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej. Lic. en Música"
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-doc-exp">Años de Experiencia</Label>
              <Input
                id="edit-doc-exp"
                type="number"
                min={0}
                value={experiencia}
                onChange={(e) => setExperiencia(e.target.value)}
                className="h-10"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="edit-doc-bio">Biografía</Label>
              <Textarea
                id="edit-doc-bio"
                rows={4}
                value={biografia}
                onChange={(e) => setBiografia(e.target.value)}
              />
            </div>

            <div className="sm:col-span-2 flex flex-wrap items-center gap-6 pt-3 border-t border-border/40">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="edit-doc-pub"
                  checked={publicado}
                  onCheckedChange={(c) => setPublicado(Boolean(c))}
                />
                <Label htmlFor="edit-doc-pub" className="text-xs cursor-pointer font-medium">
                  Publicado en facultad
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="edit-doc-dest"
                  checked={destacado}
                  onCheckedChange={(c) => setDestacado(Boolean(c))}
                />
                <Label htmlFor="edit-doc-dest" className="text-xs cursor-pointer font-medium">
                  Docente destacado
                </Label>
              </div>
            </div>
          </div>

          <AlertDialogFooter className="pt-2 gap-3">
            <AlertDialogCancel type="button" disabled={updateMutation.isPending} className="h-10 px-5">
              Cancelar
            </AlertDialogCancel>
            <Button type="submit" disabled={updateMutation.isPending} className="h-10 px-6 font-semibold">
              {updateMutation.isPending && <Spinner className="size-4 mr-2" />}
              Guardar Cambios
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
