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
  Input,
  Label,
  Spinner,
} from "@/shared/ui";
import { useCreateRepresentante } from "../hooks/useCreateRepresentante";
import type { ICrearRepresentanteDialogProps } from "./CrearRepresentanteDialog.types";

export default function CrearRepresentanteDialog({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  onSuccess,
}: Partial<ICrearRepresentanteDialogProps> = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = setControlledOpen ?? setInternalOpen;

  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [celular, setCelular] = useState("");
  const [email, setEmail] = useState("");
  const [cedula, setCedula] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ocupacion, setOcupacion] = useState("");

  const createMutation = useCreateRepresentante();

  const resetForm = () => {
    setNombres("");
    setApellidos("");
    setCelular("");
    setEmail("");
    setCedula("");
    setDireccion("");
    setOcupacion("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombres.trim() || !apellidos.trim() || !celular.trim()) return;

    createMutation.mutate(
      {
        nombres,
        apellidos,
        celular,
        email: email || undefined,
        cedula: cedula || undefined,
        direccion: direccion || undefined,
        ocupacion: ocupacion || undefined,
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
            Nuevo Representante
          </Button>
        </AlertDialogTrigger>
      )}

      <AlertDialogContent className="w-full max-w-2xl sm:max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 text-primary">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Icon icon="ph:identification-badge" width={24} height={24} />
              </div>
              <div>
                <AlertDialogTitle className="text-xl font-bold">Registrar Representante</AlertDialogTitle>
                <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Ficha del tutor o familiar para asociar a estudiantes menores y coordinar cobranzas.
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1">
            <div className="space-y-2">
              <Label htmlFor="nombres">Nombres *</Label>
              <Input
                id="nombres"
                required
                value={nombres}
                onChange={(e) => setNombres(e.target.value)}
                placeholder="Ej. María Elena"
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apellidos">Apellidos *</Label>
              <Input
                id="apellidos"
                required
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
                placeholder="Ej. Ramírez Castro"
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="celular">Teléfono Celular *</Label>
              <Input
                id="celular"
                required
                value={celular}
                onChange={(e) => setCelular(e.target.value)}
                placeholder="Ej. 0991234567"
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cedula">Cédula / DNI</Label>
              <Input
                id="cedula"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                placeholder="Ej. 1712345678"
                className="h-10"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ej. maria@correo.com"
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ocupacion">Ocupación / Profesión</Label>
              <Input
                id="ocupacion"
                value={ocupacion}
                onChange={(e) => setOcupacion(e.target.value)}
                placeholder="Ej. Docente, Ingeniera..."
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección Domiciliaria</Label>
              <Input
                id="direccion"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder="Ej. Sector Norte, Av. 10 de Agosto"
                className="h-10"
              />
            </div>
          </div>

          <AlertDialogFooter className="pt-2 gap-3">
            <AlertDialogCancel type="button" disabled={createMutation.isPending} className="h-10 px-5">
              Cancelar
            </AlertDialogCancel>
            <Button type="submit" disabled={createMutation.isPending} className="h-10 px-6 font-semibold">
              {createMutation.isPending && <Spinner className="size-4 mr-2" />}
              Guardar Representante
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
