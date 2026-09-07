import { Icon } from "@iconify/react";

import { Badge, Button } from "@/shared/ui";

import { MATERIAL_TIPO_BADGE, TIPO_MATERIAL_LABEL } from "../model/student-dashboard.types";
import type { IStudentMaterialCardProps } from "./StudentMaterialCard.types";

const TIPO_ICON: Record<string, string> = {
  pdf: "ph:file-pdf",
  partitura: "ph:music-notes",
  audio: "ph:music-note",
  video: "ph:video",
  enlace: "ph:link",
};

export default function StudentMaterialCard({ material }: IStudentMaterialCardProps) {
  const icon = TIPO_ICON[material.tipo] ?? "ph:file";

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-accent-muted/40 bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-tint text-primary">
            <Icon icon={icon} className="size-4.5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{material.titulo}</p>
            <p className="truncate text-xs text-muted-foreground">{material.destino ?? "General"}</p>
          </div>
        </div>
        <Badge variant={MATERIAL_TIPO_BADGE[material.tipo].variant}>{TIPO_MATERIAL_LABEL[material.tipo]}</Badge>
      </div>

      {material.tipo === "audio" && material.href ? (
        <audio controls src={material.href} className="w-full" />
      ) : (
        <Button asChild variant="outline" size="sm" className="self-start">
          <a href={material.href} target="_blank" rel="noreferrer">
            <Icon icon={material.tipo === "enlace" ? "ph:arrow-square-out" : "ph:download-simple"} aria-hidden="true" />
            {material.tipo === "enlace" ? "Abrir" : "Descargar"}
          </a>
        </Button>
      )}
    </div>
  );
}