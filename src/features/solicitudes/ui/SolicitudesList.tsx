"use client";

import { useMemo, useState } from "react";
import { Icon } from "@iconify/react";

import { AdminPageHeader, Input, Skeleton } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";

import { useSolicitudes } from "../hooks/useSolicitudes";
import { useUpdateSolicitudEstado } from "../hooks/useUpdateSolicitudEstado";
import { SOLICITUD_ESTADO_SIGUIENTE } from "../model/solicitudes.constants";
import type { ISolicitudRow, TSolicitudEstado } from "../model/solicitud.types";
import CrearMatriculaDialog from "./CrearMatriculaDialog";
import SolicitudCard from "./SolicitudCard";

const FILTROS: Array<{ value: "todas" | TSolicitudEstado; label: string }> = [
  { value: "todas", label: "Todas" },
  { value: "nueva", label: "Nueva" },
  { value: "contactada", label: "Contactada" },
  { value: "convertida", label: "Convertida" },
  { value: "descartada", label: "Descartada" },
];

function getWhatsAppUrl(row: ISolicitudRow): string | null {
  if (!row.telefono) return null;
  const clean = row.telefono.replace(/\D/g, "");
  const num = clean.startsWith("0") ? `593${clean.slice(1)}` : clean;
  const msg = `Hola ${row.nombre}, le saludamos de GOSMEL Music Academy respecto a su solicitud de información para ${row.interes ?? "nuestros cursos"}.`;
  return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
}

export default function SolicitudesList() {
  const { data, isPending } = useSolicitudes();
  const mutation = useUpdateSolicitudEstado();
  const rows = useMemo(() => data ?? [], [data]);

  const [filtro, setFiltro] = useState<"todas" | TSolicitudEstado>("todas");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [solicitudMatricula, setSolicitudMatricula] = useState<ISolicitudRow | null>(null);

  const counts = useMemo(() => {
    const base: Record<string, number> = { todas: rows.length };
    for (const row of rows) base[row.estado] = (base[row.estado] ?? 0) + 1;
    return base;
  }, [rows]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return rows.filter((row) => {
      if (filtro !== "todas" && row.estado !== filtro) return false;
      if (!query) return true;
      return [row.nombre, row.email, row.telefono ?? "", row.interes ?? ""].some((value) =>
        value.toLowerCase().includes(query)
      );
    });
  }, [rows, filtro, search]);

  const activeExpandedId = useMemo(
    () => (expandedId && filtered.some((row) => row.id === expandedId) ? expandedId : null),
    [expandedId, filtered]
  );

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Admisiones · GOSMEL"
        title="Bandeja de solicitudes"
        description="Leads que llegan desde el sitio público, de nueva a convertida."
        icon="ph:tray"
      />

      <div className="flex flex-wrap items-center gap-2">
        {FILTROS.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => {
              setFiltro(item.value);
              setExpandedId(null);
            }}
            aria-pressed={filtro === item.value}
            className={cn(
              "rounded-full px-4 py-2 text-xs font-bold transition-colors",
              filtro === item.value
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
            )}
          >
            {item.label} · {counts[item.value] ?? 0}
          </button>
        ))}
        <Input
          icon={<Icon icon="ph:magnifying-glass" aria-hidden="true" />}
          iconPosition="start"
          placeholder="Buscar solicitud…"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setExpandedId(null);
          }}
          className="w-full rounded-[9px] border-border bg-sidebar sm:ml-auto sm:w-64"
        />
      </div>

      {isPending ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card py-16 text-center">
          <Icon icon="ph:tray" className="size-8 text-muted-foreground/60" aria-hidden="true" />
          <p className="font-heading text-lg text-foreground">Sin solicitudes</p>
          <p className="text-sm text-muted-foreground">Cuando lleguen solicitudes aparecerán aquí.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((row) => {
            const siguiente = SOLICITUD_ESTADO_SIGUIENTE[row.estado];
            return (
              <SolicitudCard
                key={row.id}
                solicitud={row}
                expanded={activeExpandedId === row.id}
                onToggle={() =>
                  setExpandedId((prev) => (prev === row.id ? null : row.id))
                }
                onMarkNext={() =>
                  siguiente ? mutation.mutate({ id: row.id, estado: siguiente }) : undefined
                }
                onConvert={() => setSolicitudMatricula(row)}
                onDiscard={() => mutation.mutate({ id: row.id, estado: "descartada" })}
                waUrl={getWhatsAppUrl(row)}
                busy={mutation.isPending}
              />
            );
          })}
        </div>
      )}

      <CrearMatriculaDialog
        solicitud={solicitudMatricula}
        onClose={() => setSolicitudMatricula(null)}
      />
    </div>
  );
}
