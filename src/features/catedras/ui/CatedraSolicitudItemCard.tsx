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
  Card,
  CardContent,
  Input,
  Label,
} from "@/shared/ui";
import { formatCurrency, formatDate } from "@/shared/lib/formatters";

import { useAprobarMatricula, useRechazarMatricula } from "@/entities/matricula";
import type { ICatedraSolicitudItem } from "../model/catedra-estudiantes.types";

interface ICatedraSolicitudItemCardProps {
  solicitud: ICatedraSolicitudItem;
}

export default function CatedraSolicitudItemCard({
  solicitud,
}: ICatedraSolicitudItemCardProps) {
  const [monto, setMonto] = useState(
    solicitud.precioReferencial != null ? String(solicitud.precioReferencial) : "0"
  );
  const [diaCobro, setDiaCobro] = useState("5");
  const [motivo, setMotivo] = useState("");
  const [rejectOpen, setRejectOpen] = useState(false);

  const aprobarMutation = useAprobarMatricula();
  const rechazarMutation = useRechazarMatricula();

  const handleAprobar = () => {
    aprobarMutation.mutate({
      inscripcionId: solicitud.inscripcionId,
      montoMensual: parseFloat(monto) || 0,
      diaCobro: parseInt(diaCobro, 10) || 5,
      motivoAjuste: motivo.trim() || undefined,
    });
  };

  const handleRechazar = () => {
    rechazarMutation.mutate(
      { inscripcionId: solicitud.inscripcionId, motivo: motivo.trim() || "Sin motivo especificado" },
      { onSuccess: () => setRejectOpen(false) }
    );
  };

  return (
    <Card className="border-border/70 bg-background/60 shadow-xs">
      <CardContent className="flex flex-col gap-4 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="font-semibold text-base text-foreground">
              {solicitud.estudianteNombre}
            </h4>
            <p className="text-xs text-muted-foreground">
              Solicitado el {formatDate(solicitud.fechaInscripcion)}
              {solicitud.solicitadaPor ? ` por ${solicitud.solicitadaPor}` : ""}
            </p>
          </div>
          <Badge variant="warning" className="text-xs">
            Solicitud pendiente
          </Badge>
        </div>

        <div className="rounded-lg bg-muted/40 p-3 text-xs flex items-center justify-between gap-2 border border-border/40">
          <span className="text-muted-foreground">Precio referencial del curso:</span>
          <span className="font-semibold text-foreground font-mono">
            {solicitud.precioReferencial != null
              ? `${formatCurrency(solicitud.precioReferencial)} / mes`
              : "No definido"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor={`monto-${solicitud.inscripcionId}`} className="text-xs">
              Monto mensual acordado ($)
            </Label>
            <Input
              id={`monto-${solicitud.inscripcionId}`}
              type="number"
              step="0.01"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              className="text-sm h-8 font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`dia-${solicitud.inscripcionId}`} className="text-xs">
              Día de cobro mensual (1–28)
            </Label>
            <Input
              id={`dia-${solicitud.inscripcionId}`}
              type="number"
              min="1"
              max="28"
              value={diaCobro}
              onChange={(e) => setDiaCobro(e.target.value)}
              className="text-sm h-8 font-mono"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`motivo-${solicitud.inscripcionId}`} className="text-xs">
            Motivo de ajuste o beca (opcional)
          </Label>
          <Input
            id={`motivo-${solicitud.inscripcionId}`}
            placeholder="Ej. Beca parcial 20%, tarifa regular acordada..."
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            className="text-xs h-8"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
          <AlertDialog open={rejectOpen} onOpenChange={setRejectOpen}>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-destructive border-destructive/30 hover:bg-destructive/10 gap-1 text-xs"
                disabled={rechazarMutation.isPending || aprobarMutation.isPending}
              >
                <Icon icon="ph:x-circle" className="size-3.5" aria-hidden="true" />
                Rechazar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="w-full max-w-md p-6">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-destructive">
                  ¿Rechazar solicitud de matrícula?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Se descartará la solicitud de <strong>{solicitud.estudianteNombre}</strong> para esta cátedra. El estudiante podrá volver a solicitar si lo desea.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={rechazarMutation.isPending}>Cancelar</AlertDialogCancel>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleRechazar}
                  disabled={rechazarMutation.isPending}
                >
                  {rechazarMutation.isPending ? "Rechazando..." : "Confirmar rechazo"}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button
            type="button"
            size="sm"
            onClick={handleAprobar}
            disabled={aprobarMutation.isPending || rechazarMutation.isPending}
            className="gap-1.5 text-xs bg-success text-warm-950 hover:bg-success/90"
          >
            <Icon icon="ph:check-circle" className="size-3.5" aria-hidden="true" />
            {aprobarMutation.isPending ? "Aprobando..." : "Aprobar matrícula"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
