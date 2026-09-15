"use client";

import { Icon } from "@iconify/react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Badge,
  Button,
} from "@/shared/ui";
import { formatDateTime } from "@/shared/lib/formatters";

import type { IDetalleResenaDialogProps } from "./DetalleResenaDialog.types";

export default function DetalleResenaDialog({ item }: IDetalleResenaDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon-xs" aria-label={`Ver reseña de ${item.estudiante}`}>
          <Icon icon="ph:eye" aria-hidden="true" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-h-[90vh] w-full max-w-xl overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Reseña de {item.estudiante}</AlertDialogTitle>
        </AlertDialogHeader>

        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-3">
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Curso</p>
              <p className="mt-1 text-sm font-medium">{item.curso}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-3">
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Fecha</p>
              <p className="mt-1 text-sm font-medium">{formatDateTime(item.createdAt)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-warning">
              <Icon icon="ph:star-fill" className="size-4" aria-hidden="true" />
              <span className="text-sm font-semibold text-foreground">{item.puntuacion} / 5</span>
            </span>
            <Badge variant={item.publicado ? "success" : "secondary"}>
              {item.publicado ? "Publicada" : "Pendiente"}
            </Badge>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            {item.comentario ? (
              <p className="whitespace-pre-wrap text-sm leading-[1.65] text-foreground">{item.comentario}</p>
            ) : (
              <p className="text-sm italic text-muted-foreground">Valoración sin comentario.</p>
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
