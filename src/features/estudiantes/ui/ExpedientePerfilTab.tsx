import { Icon } from "@iconify/react";

import { Badge } from "@/shared/ui";

import type { IExpedienteTabProps } from "./EstudianteExpediente.types";

export default function ExpedientePerfilTab({ detalle }: IExpedienteTabProps) {
  const esMenor = detalle.fechaNacimiento
    ? new Date().getFullYear() - new Date(detalle.fechaNacimiento).getFullYear() < 18
    : false;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-3.5 text-[15px] font-bold text-foreground">Instrumentos</div>
        {detalle.instrumentos.length > 0 ? (
          <div className="flex flex-col gap-2.5">
            {detalle.instrumentos.map((instrumento) => (
              <div
                key={instrumento}
                className="flex items-center justify-between rounded-lg bg-foreground/[0.03] px-3.5 py-3"
              >
                <span className="text-[13.5px] font-bold text-foreground">{instrumento}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[13px] text-muted-foreground">Sin instrumentos registrados.</p>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-3.5 flex items-center justify-between">
          <span className="text-[15px] font-bold text-foreground">Representante</span>
          {esMenor ? <Badge variant="warning">Menor de edad</Badge> : null}
        </div>
        {detalle.representante ? (
          <div className="rounded-lg bg-foreground/[0.03] px-3.5 py-3 text-[13.5px] font-bold text-foreground">
            {detalle.representante}
          </div>
        ) : (
          <p className="text-[13px] text-muted-foreground">
            {esMenor ? "Aún sin representante vinculado." : "Mayor de edad — no requiere representante."}
          </p>
        )}
      </div>

      {esMenor ? (
        <div className="flex items-center gap-3 rounded-2xl border border-warning-border bg-warning-tint/40 px-5 py-4 md:col-span-2">
          <Icon icon="ph:warning-circle" width={18} height={18} className="text-warning-fg" aria-hidden="true" />
          <div>
            <div className="text-[13.5px] font-bold text-foreground">Aún depende de su representante</div>
            <div className="text-[12px] text-muted-foreground">
              Podrá vincular su propia cuenta cuando cumpla la mayoría de edad.
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
