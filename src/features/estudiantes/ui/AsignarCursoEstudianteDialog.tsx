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
  Badge,
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
import { useCatedras } from "@/entities/catedra";
import { useEstudiantes } from "../hooks/useEstudiantes";
import { useInscribirEstudianteCatedra } from "../hooks/useInscribirEstudianteCatedra";
import type { IAsignarCursoEstudianteDialogProps } from "./AsignarCursoEstudianteDialog.types";

export default function AsignarCursoEstudianteDialog({
  estudianteId: initialEstudianteId,
  estudianteNombre: initialEstudianteNombre,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  onSuccess,
}: IAsignarCursoEstudianteDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = setControlledOpen ?? setInternalOpen;

  const { data: estudiantesList } = useEstudiantes();
  const { data: catedrasList } = useCatedras();
  const inscribirMutation = useInscribirEstudianteCatedra();

  const [selectedEstudianteId, setSelectedEstudianteId] = useState(initialEstudianteId ?? "");
  const [selectedCatedraId, setSelectedCatedraId] = useState("");
  const [montoMensual, setMontoMensual] = useState("45.00");
  const [diaCobro, setDiaCobro] = useState("5");
  const [motivoAjuste, setMotivoAjuste] = useState("");

  const [prevInitialEstudianteId, setPrevInitialEstudianteId] = useState(initialEstudianteId ?? "");
  if (initialEstudianteId !== prevInitialEstudianteId) {
    setPrevInitialEstudianteId(initialEstudianteId ?? "");
    setSelectedEstudianteId(initialEstudianteId ?? "");
  }

  const activeCatedras = (catedrasList ?? []).filter(
    (c) => c.estado === "planificada" || c.estado === "en_curso"
  );

  const selectedCatedra = (catedrasList ?? []).find((c) => c.id === selectedCatedraId);
  const selectedStudent = (estudiantesList ?? []).find((e) => e.id === selectedEstudianteId);

  const displayName = initialEstudianteNombre ?? selectedStudent?.nombreCompleto ?? "el estudiante";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEstudianteId || !selectedCatedraId) return;

    inscribirMutation.mutate(
      {
        estudianteId: selectedEstudianteId,
        catedraId: selectedCatedraId,
        montoMensual: parseFloat(montoMensual) || 0,
        diaCobro: parseInt(diaCobro, 10) || 5,
        motivoAjuste: motivoAjuste || undefined,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setSelectedCatedraId("");
          setMotivoAjuste("");
          if (onSuccess) onSuccess();
        },
      }
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {controlledOpen === undefined && (
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Icon icon="ph:chalkboard-teacher" width={16} height={16} aria-hidden="true" />
            Asignar Curso / Cátedra
          </Button>
        </AlertDialogTrigger>
      )}

      <AlertDialogContent className="w-full max-w-2xl sm:max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 text-primary">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Icon icon="ph:chalkboard-teacher" width={24} height={24} />
              </div>
              <div>
                <AlertDialogTitle className="text-xl font-bold">
                  Asignar Curso y Cátedra a Estudiante
                </AlertDialogTitle>
                <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Inscriba a <strong>{displayName}</strong> en una cátedra activa con su docente asignado y plan de pago.
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>

          <div className="space-y-5 py-1">
            {!initialEstudianteId && (
              <div className="space-y-2">
                <Label htmlFor="asig-estudiante" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Seleccionar Estudiante *
                </Label>
                <Select value={selectedEstudianteId} onValueChange={setSelectedEstudianteId}>
                  <SelectTrigger id="asig-estudiante" className="h-11">
                    <SelectValue placeholder="Buscar estudiante activo por nombre o cédula..." />
                  </SelectTrigger>
                  <SelectContent>
                    {(estudiantesList ?? []).map((est) => (
                      <SelectItem key={est.id} value={est.id}>
                        {est.nombreCompleto} {est.cedula ? `— C.I. ${est.cedula}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="asig-catedra" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Cátedra y Docente Responsable *
              </Label>
              <Select value={selectedCatedraId} onValueChange={setSelectedCatedraId}>
                <SelectTrigger id="asig-catedra" className="h-11">
                  <SelectValue placeholder="Seleccione el curso, cátedra y docente..." />
                </SelectTrigger>
                <SelectContent>
                  {activeCatedras.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.curso} ({cat.codigo}) — Docente: {cat.docente ?? "Por asignar"} ({cat.activos}/{cat.cupoMaximo} cupos)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCatedra && (
              <div className="p-4 sm:p-5 rounded-2xl bg-background/70 border border-border/80 space-y-3 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-foreground">{selectedCatedra.curso}</span>
                    <Badge variant="outline" className="font-mono text-xs">
                      {selectedCatedra.codigo}
                    </Badge>
                  </div>
                  <Badge variant="default" className="text-xs capitalize">
                    {selectedCatedra.modalidad}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1 border-t border-border/40">
                  <div className="space-y-0.5">
                    <span className="text-muted-foreground block text-[11px]">Profesor / Docente</span>
                    <strong className="text-foreground text-sm font-semibold">{selectedCatedra.docente ?? "Por asignar"}</strong>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-muted-foreground block text-[11px]">Aula / Salón</span>
                    <strong className="text-foreground text-sm font-semibold">{selectedCatedra.aula ?? "Principal"}</strong>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-muted-foreground block text-[11px]">Disponibilidad</span>
                    <strong className="text-foreground text-sm font-semibold">
                      {selectedCatedra.activos} inscritos de {selectedCatedra.cupoMaximo} cupos
                    </strong>
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 sm:p-5 rounded-2xl bg-muted/30 border border-border/60 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                Condiciones del Acuerdo Financiero
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="asig-monto">Mensualidad Pactada ($ USD) *</Label>
                  <Input
                    id="asig-monto"
                    type="number"
                    step="0.01"
                    min={0}
                    required
                    value={montoMensual}
                    onChange={(e) => setMontoMensual(e.target.value)}
                    className="h-10"
                    placeholder="45.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="asig-dia">Día Límite de Cobro</Label>
                  <Select value={diaCobro} onValueChange={setDiaCobro}>
                    <SelectTrigger id="asig-dia" className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Día 1 de cada mes</SelectItem>
                      <SelectItem value="5">Día 5 de cada mes</SelectItem>
                      <SelectItem value="10">Día 10 de cada mes</SelectItem>
                      <SelectItem value="15">Día 15 de cada mes</SelectItem>
                      <SelectItem value="20">Día 20 de cada mes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="asig-motivo">Observación / Nota del Acuerdo</Label>
                  <Input
                    id="asig-motivo"
                    value={motivoAjuste}
                    onChange={(e) => setMotivoAjuste(e.target.value)}
                    placeholder="Ej. Tarifa regular / Descuento por hermano / Beca..."
                    className="h-10"
                  />
                </div>
              </div>
            </div>
          </div>

          <AlertDialogFooter className="pt-2 gap-3">
            <AlertDialogCancel type="button" disabled={inscribirMutation.isPending} className="h-10 px-5">
              Cancelar
            </AlertDialogCancel>
            <Button
              type="submit"
              disabled={inscribirMutation.isPending || !selectedEstudianteId || !selectedCatedraId}
              className="h-10 px-6 font-semibold"
            >
              {inscribirMutation.isPending && <Spinner className="size-4 mr-2" />}
              Asignar y Matricular
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
