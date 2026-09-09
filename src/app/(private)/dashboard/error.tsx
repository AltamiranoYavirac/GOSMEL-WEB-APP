"use client";

import { useEffect } from "react";
import { Icon } from "@iconify/react";

import { Button } from "@/shared/ui";

import type { IDashboardErrorProps } from "./error.types";

export default function DashboardError({ error, reset }: IDashboardErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <Icon icon="ph:warning-octagon" width={40} height={40} className="text-destructive" aria-hidden="true" />
      <div className="space-y-1">
        <p className="text-base font-semibold">Algo salió mal</p>
        <p className="text-sm text-muted-foreground">
          No se pudo cargar esta sección del panel. Intenta de nuevo.
        </p>
      </div>
      <Button onClick={reset} variant="outline" size="sm">
        Reintentar
      </Button>
    </div>
  );
}
