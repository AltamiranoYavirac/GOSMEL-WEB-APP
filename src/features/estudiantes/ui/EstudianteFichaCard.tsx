"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";

import { Badge, Button, DataLabel } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";
import { initialsOf } from "@/shared/lib/formatters";

import { NIVEL_BADGE } from "../model/estudiantes.constants";
import EditarEstudianteDialog from "./EditarEstudianteDialog";
import EliminarEstudianteDialog from "./EliminarEstudianteDialog";
import type { IEstudianteFichaCardProps } from "./EstudianteFichaCard.types";

export default function EstudianteFichaCard({ estudiante }: IEstudianteFichaCardProps) {
  const tieneCuenta = Boolean(estudiante.perfilId);
  const visibles = estudiante.instrumentos.slice(0, 2);
  const resto = estudiante.instrumentos.length - visibles.length;

  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-xl border border-border bg-card p-4 shadow-xs transition-colors hover:border-input hover:shadow-md",
        !estudiante.activo && "opacity-70"
      )}
    >
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-tint text-[13px] font-bold text-primary-800">
          {initialsOf(estudiante.nombreCompleto)}
        </span>
        <div className="min-w-0 flex-1">
          <Link
            href={`/dashboard/admin/estudiantes/${estudiante.id}`}
            className="block truncate text-[15px] font-bold text-foreground hover:underline"
          >
            {estudiante.nombreCompleto}
          </Link>
          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>{estudiante.edad != null ? `${estudiante.edad} años` : "Edad —"}</span>
            <span aria-hidden="true">·</span>
            <span className={cn("font-semibold", estudiante.activo ? "text-success-fg" : "text-muted-foreground")}>
              {estudiante.activo ? "Activo" : "Inactivo"}
            </span>
          </div>
        </div>
        <span
          title={tieneCuenta ? "Cuenta propia vinculada" : "Sin cuenta propia"}
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-md border",
            tieneCuenta
              ? "border-success-border bg-success-tint text-success-fg"
              : "border-border bg-muted text-muted-foreground"
          )}
        >
          <Icon icon={tieneCuenta ? "ph:check" : "ph:user"} width={13} height={13} aria-hidden="true" />
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {estudiante.nivel ? (
          <Badge variant={NIVEL_BADGE[estudiante.nivel].variant}>{NIVEL_BADGE[estudiante.nivel].label}</Badge>
        ) : (
          <Badge variant="outline">Sin nivel</Badge>
        )}
        {visibles.map((instrumento) => (
          <Badge key={instrumento} variant="outline">
            {instrumento}
          </Badge>
        ))}
        {resto > 0 ? <Badge variant="outline">+{resto}</Badge> : null}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 rounded-lg bg-muted/60 p-3">
        <div className="min-w-0">
          <DataLabel>Cátedras</DataLabel>
          <div className="mt-0.5 text-[13px] font-bold text-foreground">
            {estudiante.catedrasActivas.length}
          </div>
        </div>
        <div className="min-w-0">
          <DataLabel>Representante</DataLabel>
          <div className="mt-0.5 truncate text-[13px] font-semibold text-foreground">
            {estudiante.representante ?? "—"}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
        <Button asChild variant="outline" size="sm" className="flex-1">
          <Link href={`/dashboard/admin/estudiantes/${estudiante.id}`}>
            <Icon icon="ph:folder-open" width={14} height={14} aria-hidden="true" />
            Expediente
          </Link>
        </Button>
        <div className="ml-auto flex items-center gap-1">
          <EditarEstudianteDialog estudiante={estudiante} />
          <EliminarEstudianteDialog estudiante={estudiante} />
        </div>
      </div>
    </div>
  );
}
