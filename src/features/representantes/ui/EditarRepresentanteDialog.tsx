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
  Spinner,
} from "@/shared/ui";
import { useUpdateRepresentante } from "../hooks/useUpdateRepresentante";
import type { IEditarRepresentanteDialogProps } from "./EditarRepresentanteDialog.types";

export default function EditarRepresentanteDialog({
  representante,
  open,
  onOpenChange,
}: IEditarRepresentanteDialogProps) {
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [celular, setCelular] = useState("");
  const [email, setEmail] = useState("");
  const [cedula, setCedula] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ocupacion, setOcupacion] = useState("");

  const updateMutation = useUpdateRepresentante();

  useEffect(() => {
    if (representante) {
      setNombres(representante.nombres ?? "");
      setApellidos(representante.apellidos ?? "");
      setCelular(representante.celular ?? "");
      setEmail(representante.email ?? "");
      setCedula(representante.cedula ?? "");
      setDireccion(representante.direccion ?? "");
      setOcupacion(representante.ocupacion ?? "");
    }
  }, [representante]);

  if (!representante) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombres.trim() || !apellidos.trim() || !celular.trim()) return;

    updateMutation.mutate(
      {
        id: representante.id,
        nombres,
        apellidos,
        celular,
        email: email || undefined,
        cedula: cedula || undefined,
        direccion: direccion || undefined,
        ocupacion: ocupacion || undefined,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
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
                <AlertDialogTitle className="text-xl font-bold">Editar Representante</AlertDialogTitle>
                <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Actualice los datos de contacto y localización de {representante.nombre}.
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1">
            <div className="space-y-2">
              <Label htmlFor="edit-nombres">Nombres *</Label>
              <Input
                id="edit-nombres"
                required
                value={nombres}
                onChange={(e) => setNombres(e.target.value)}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-apellidos">Apellidos *</Label>
              <Input
                id="edit-apellidos"
                required
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-celular">Teléfono Celular *</Label>
              <Input
                id="edit-celular"
                required
                value={celular}
                onChange={(e) => setCelular(e.target.value)}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-cedula">Cédula / DNI</Label>
              <Input
                id="edit-cedula"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                className="h-10"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="edit-email">Correo Electrónico</Label>
              <Input
                id="edit-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-ocupacion">Ocupación / Profesión</Label>
              <Input
                id="edit-ocupacion"
                value={ocupacion}
                onChange={(e) => setOcupacion(e.target.value)}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-direccion">Dirección</Label>
              <Input
                id="edit-direccion"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                className="h-10"
              />
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
