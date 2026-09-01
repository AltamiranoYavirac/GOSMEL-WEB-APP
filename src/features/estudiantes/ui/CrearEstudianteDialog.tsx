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
  Checkbox,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spinner,
} from "@/shared/ui";
import { useRepresentantes } from "@/entities/representante";
import { useCreateEstudiante } from "../hooks/useCreateEstudiante";
import type { TNivelCurso } from "../model/estudiante.types";
import type { ICrearEstudianteDialogProps } from "./CrearEstudianteDialog.types";

type TParentesco =
  | "madre"
  | "padre"
  | "abuelo"
  | "tio"
  | "hermano"
  | "tutor_legal"
  | "otro";

export default function CrearEstudianteDialog({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  defaultRepresentanteId,
  onSuccess,
}: ICrearEstudianteDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = setControlledOpen ?? setInternalOpen;

  const { data: reps } = useRepresentantes();
  const createMutation = useCreateEstudiante();

  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [cedula, setCedula] = useState("");
  const [celular, setCelular] = useState("");
  const [email, setEmail] = useState("");
  const [nivel, setNivel] = useState<TNivelCurso>("iniciacion");
  const [esMenor, setEsMenor] = useState(true);
  const [representanteId, setRepresentanteId] = useState(defaultRepresentanteId || "");
  const [parentesco, setParentesco] = useState<TParentesco>("madre");

  const resetForm = () => {
    setNombres("");
    setApellidos("");
    setFechaNacimiento("");
    setCedula("");
    setCelular("");
    setEmail("");
    setNivel("iniciacion");
    setEsMenor(true);
    setRepresentanteId(defaultRepresentanteId || "");
    setParentesco("madre");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombres.trim() || !apellidos.trim() || !fechaNacimiento) return;

    createMutation.mutate(
      {
        nombres,
        apellidos,
        fecha_nacimiento: fechaNacimiento,
        cedula: cedula || undefined,
        celular: celular || undefined,
        email: email || undefined,
        nivel_musical: nivel,
        representante_id: esMenor && representanteId ? representanteId : undefined,
        parentesco: esMenor && representanteId ? parentesco : undefined,
      },
      {
        onSuccess: (data) => {
          resetForm();
          setOpen(false);
          if (data && onSuccess) {
            onSuccess(data.id);
          }
        },
      }
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {controlledOpen === undefined && (
        <AlertDialogTrigger asChild>
          <Button className="gap-2">
            <Icon icon="ph:plus" width={16} height={16} aria-hidden="true" />
            Nuevo Estudiante
          </Button>
        </AlertDialogTrigger>
      )}

      <AlertDialogContent className="w-full max-w-2xl sm:max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 text-primary">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Icon icon="ph:student" width={24} height={24} />
              </div>
              <div>
                <AlertDialogTitle className="text-xl font-bold">
                  Alta Presencial de Estudiante
                </AlertDialogTitle>
                <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Crea la ficha del alumno y vincula su tutor o representante legal.
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1">
            <div className="space-y-2">
              <Label htmlFor="est-nombres">Nombres *</Label>
              <Input
                id="est-nombres"
                required
                value={nombres}
                onChange={(e) => setNombres(e.target.value)}
                placeholder="Ej. Mateo Sebastián"
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="est-apellidos">Apellidos *</Label>
              <Input
                id="est-apellidos"
                required
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
                placeholder="Ej. Ramírez Castro"
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="est-fecha">Fecha de Nacimiento *</Label>
              <Input
                id="est-fecha"
                type="date"
                required
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="est-nivel">Nivel Musical</Label>
              <Select value={nivel} onValueChange={(val) => setNivel(val as TNivelCurso)}>
                <SelectTrigger id="est-nivel" className="h-10">
                  <SelectValue placeholder="Seleccione nivel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="iniciacion">Iniciación</SelectItem>
                  <SelectItem value="basico">Básico</SelectItem>
                  <SelectItem value="intermedio">Intermedio</SelectItem>
                  <SelectItem value="avanzado">Avanzado</SelectItem>
                  <SelectItem value="maestria">Maestría</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="est-cedula">Cédula / DNI</Label>
              <Input
                id="est-cedula"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                placeholder="Ej. 1750293847"
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="est-celular">Celular de Contacto</Label>
              <Input
                id="est-celular"
                value={celular}
                onChange={(e) => setCelular(e.target.value)}
                placeholder="Ej. 0998765432"
                className="h-10"
              />
            </div>

            <div className="sm:col-span-2 pt-3 border-t border-border/40 space-y-4">
              <div className="flex items-center gap-2.5">
                <Checkbox
                  id="es-menor"
                  checked={esMenor}
                  onCheckedChange={(checked) => setEsMenor(Boolean(checked))}
                />
                <Label htmlFor="es-menor" className="font-semibold text-sm cursor-pointer">
                  El estudiante es menor de edad (asociar representante)
                </Label>
              </div>

              {esMenor && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-background/50 border border-border/60">
                  <div className="space-y-2">
                    <Label htmlFor="rep-select">Representante Registrado</Label>
                    <Select value={representanteId} onValueChange={setRepresentanteId}>
                      <SelectTrigger id="rep-select" className="h-10">
                        <SelectValue placeholder="Buscar representante..." />
                      </SelectTrigger>
                      <SelectContent>
                        {(reps ?? []).map((r) => (
                          <SelectItem key={r.id} value={r.id}>
                            {r.nombre} {r.cedula ? `(${r.cedula})` : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parentesco-select">Parentesco</Label>
                    <Select value={parentesco} onValueChange={(v) => setParentesco(v as TParentesco)}>
                      <SelectTrigger id="parentesco-select" className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="madre">Madre</SelectItem>
                        <SelectItem value="padre">Padre</SelectItem>
                        <SelectItem value="abuelo">Abuelo/a</SelectItem>
                        <SelectItem value="tio">Tío/a</SelectItem>
                        <SelectItem value="hermano">Hermano/a</SelectItem>
                        <SelectItem value="tutor_legal">Tutor Legal</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </div>

          <AlertDialogFooter className="pt-2 gap-3">
            <AlertDialogCancel type="button" disabled={createMutation.isPending} className="h-10 px-5">
              Cancelar
            </AlertDialogCancel>
            <Button type="submit" disabled={createMutation.isPending} className="h-10 px-6 font-semibold">
              {createMutation.isPending && <Spinner className="size-4 mr-2" />}
              Guardar Estudiante
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
