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

  return (
    <div
      className={cn(
        "flex flex-col gap-3.5 rounded-2xl border border-border bg-card p-5",
        !estudiante.activo && "opacity-60"
      )}
    >
      <Link href={`/dashboard/admin/estudiantes/${estudiante.id}`} className="flex flex-col gap-3.5">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-full bg-foreground/8 text-sm font-bold text-foreground">
            {initialsOf(estudiante.nombreCompleto)}
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[15px] font-bold text-foreground">{estudiante.nombreCompleto}</div>
            <div className="text-[12px] text-muted-foreground">
              {estudiante.edad != null ? `${estudiante.edad} años` : "Edad —"}
            </div>
          </div>
          <span
            title={tieneCuenta ? "Cuenta propia vinculada" : "Sin cuenta propia"}
            className={cn(
              "flex size-6 items-center justify-center rounded-full",
              tieneCuenta ? "bg-success-tint text-success-fg" : "bg-foreground/6 text-muted-foreground"
            )}
          >
            <Icon icon={tieneCuenta ? "ph:check" : "ph:lock-simple"} width={12} height={12} aria-hidden="true" />
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {estudiante.nivel ? (
            <Badge variant={NIVEL_BADGE[estudiante.nivel].variant}>{NIVEL_BADGE[estudiante.nivel].label}</Badge>
          ) : null}
          {estudiante.instrumentos.map((instrumento) => (
            <Badge key={instrumento} variant="ghost">
              {instrumento}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-border pt-3">
          <div>
            <DataLabel>Cátedras</DataLabel>
            <div className="mt-0.5 text-[13px] font-bold text-foreground">{estudiante.catedrasActivas.length}</div>
          </div>
          <div>
            <DataLabel>Representante</DataLabel>
            <div className="mt-0.5 truncate text-[13px] font-semibold text-foreground">
              {estudiante.representante ?? "—"}
            </div>
          </div>
        </div>
      </Link>

      <div className="flex items-center gap-1 border-t border-border pt-2.5">
        <Button asChild variant="ghost" size="sm" className="text-info-fg">
          <Link href={`/dashboard/admin/estudiantes/${estudiante.id}`}>
            <Icon icon="ph:folder-open" width={16} height={16} aria-hidden="true" />
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
