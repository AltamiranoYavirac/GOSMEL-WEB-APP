"use client";

import { Icon } from "@iconify/react";

import { Badge } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";

interface IEsperaBadgeProps {
  diasEspera: number;
  /** Versión sólida de alto contraste para fondos oscuros. */
  solid?: boolean;
  className?: string;
}

export function esperaTexto(diasEspera: number): string {
  if (diasEspera <= 0) return "hoy";
  if (diasEspera === 1) return "hace 1 día";
  return `hace ${diasEspera} días`;
}

export default function EsperaBadge({ diasEspera, solid = false, className }: IEsperaBadgeProps) {
  const urgente = diasEspera >= 7;
  const pronto = diasEspera >= 3 && diasEspera < 7;

  return (
    <Badge
      variant={urgente && !solid ? "destructive" : "warning"}
      className={cn(
        "gap-1",
        solid && "border-transparent",
        solid && urgente && "bg-destructive text-destructive-foreground",
        solid && !urgente && "bg-warning text-warning-fg",
        className
      )}
      title={urgente ? "Lleva 7 días o más esperando — dale prioridad" : undefined}
    >
      <Icon
        icon={urgente ? "ph:alarm" : pronto ? "ph:clock-countdown" : "ph:clock"}
        className="size-3"
        aria-hidden="true"
      />
      Pendiente · {esperaTexto(diasEspera)}
    </Badge>
  );
}
