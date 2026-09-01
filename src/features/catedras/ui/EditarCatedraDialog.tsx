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
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spinner,
} from "@/shared/ui";
import { useCatedraOptions } from "../hooks/useCatedraOptions";
import { useUpdateCatedra } from "../hooks/useUpdateCatedra";
import type { TEstadoCatedra, TModalidadCurso } from "../model/catedra.types";
import type { IEditarCatedraDialogProps } from "./EditarCatedraDialog.types";

export default function EditarCatedraDialog({
  catedra,
  open,
  onOpenChange,
  onSuccess,
}: IEditarCatedraDialogProps) {
  const { data: options } = useCatedraOptions(open);
  const docentes = options?.docentes ?? [];
  const updateMutation = useUpdateCatedra();

  const [cupo, setCupo] = useState("15");
  const [aula, setAula] = useState("");
  const [modalidad, setModalidad] = useState<TModalidadCurso>("presencial");
  const [docenteId, setDocenteId] = useState("");
  const [estado, setEstado] = useState<TEstadoCatedra>("planificada");

  useEffect(() => {
    if (catedra) {
      setCupo(String(catedra.cupoMaximo ?? 15));
      setAula(catedra.aula ?? "");
      setModalidad(catedra.modalidad ?? "presencial");
      setEstado(catedra.estado ?? "planificada");

      const matchDoc = docentes.find((d) => d.nombre === catedra.docente);
      if (matchDoc) {
        setDocenteId(matchDoc.id);
      }
    }
  }, [catedra, docentes]);

  if (!catedra) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(
      {
        id: catedra.id,
        cupo_maximo: parseInt(cupo, 10) || 15,
        aula: aula || null,
        modalidad,
        docente_id: docenteId || undefined,
        estado,
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
                <Icon icon="ph:chalkboard" width={24} height={24} />
              </div>
              <div>
                <AlertDialogTitle className="text-xl font-bold">
                  Editar Cátedra {catedra.codigo}
                </AlertDialogTitle>
                <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Curso: <strong>{catedra.curso}</strong>. Modifique las condiciones operativas y de aula.
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="edit-cat-docente" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Docente Asignado
              </Label>
              <Select value={docenteId} onValueChange={setDocenteId}>
                <SelectTrigger id="edit-cat-docente" className="h-11">
                  <SelectValue placeholder="Seleccione docente responsable..." />
                </SelectTrigger>
                <SelectContent>
                  {docentes.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-cat-cupo">Cupo Máximo</Label>
              <Input
                id="edit-cat-cupo"
                type="number"
                min={1}
                max={50}
                required
                value={cupo}
                onChange={(e) => setCupo(e.target.value)}
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-cat-aula">Aula / Salón</Label>
              <Input
                id="edit-cat-aula"
                value={aula}
                onChange={(e) => setAula(e.target.value)}
                placeholder="Ej. Aula 201, Sala de Piano..."
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-cat-modalidad">Modalidad</Label>
              <Select value={modalidad} onValueChange={(v) => setModalidad(v as TModalidadCurso)}>
                <SelectTrigger id="edit-cat-modalidad" className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="presencial">Presencial</SelectItem>
                  <SelectItem value="virtual">Virtual</SelectItem>
                  <SelectItem value="hibrido">Híbrido</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-cat-estado">Estado Operativo</Label>
              <Select value={estado} onValueChange={(v) => setEstado(v as TEstadoCatedra)}>
                <SelectTrigger id="edit-cat-estado" className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planificada">Planificada</SelectItem>
                  <SelectItem value="en_curso">En curso</SelectItem>
                  <SelectItem value="finalizada">Finalizada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
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
