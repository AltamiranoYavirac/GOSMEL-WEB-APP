import { Icon } from "@iconify/react";

export default function ExpedienteBitacoraTab() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card py-16 text-center">
      <Icon icon="ph:clock-counter-clockwise" className="size-8 text-muted-foreground/60" aria-hidden="true" />
      <p className="font-heading text-lg text-foreground">Sin actividad registrada</p>
      <p className="text-sm text-muted-foreground">La bitácora del estudiante aparecerá aquí.</p>
    </div>
  );
}
