"use client";

import { useMemo, useState } from "react";
import { Icon } from "@iconify/react";

import { useInscripcionesPendientes, type IInscripcionPendiente } from "@/entities/matricula";
import { AdminPageHeader, Input, Skeleton } from "@/shared/ui";

import AprobarMatriculaDialog from "./AprobarMatriculaDialog";
import MatriculaCard from "./MatriculaCard";
import RechazarMatriculaDialog from "./RechazarMatriculaDialog";

export default function MatriculasList() {
  const { data, isPending } = useInscripcionesPendientes();
  const rows = useMemo(() => data ?? [], [data]);

  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [aprobar, setAprobar] = useState<IInscripcionPendiente | null>(null);
  const [rechazar, setRechazar] = useState<IInscripcionPendiente | null>(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) =>
      [row.estudiante, row.cursoNombre ?? "", row.catedraCodigo ?? ""].some((value) =>
        value.toLowerCase().includes(query)
      )
    );
  }, [rows, search]);

  const activeExpandedId = useMemo(
    () => (expandedId && filtered.some((row) => row.id === expandedId) ? expandedId : null),
    [expandedId, filtered]
  );

  const searching = search.trim().length > 0;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Admisiones · GOSMEL"
        title="Matrículas por aprobar"
        description="Inscripciones que esperan tu decisión antes de activarse."
        icon="ph:user-plus"
      />

      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-warning-border bg-warning-tint px-4 py-2 text-xs font-bold text-warning-fg">
          <Icon icon="ph:clock-countdown" className="size-3.5" aria-hidden="true" />
          Pendientes · {rows.length}
        </span>
        <Input
          icon={<Icon icon="ph:magnifying-glass" aria-hidden="true" />}
          iconPosition="start"
          placeholder="Buscar matrícula…"
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
          <Icon
            icon={searching ? "ph:magnifying-glass" : "ph:identification-card"}
            className="size-8 text-muted-foreground/60"
            aria-hidden="true"
          />
          <p className="font-heading text-lg text-foreground">
            {searching ? "Sin resultados" : "Sin matrículas pendientes"}
          </p>
          <p className="text-sm text-muted-foreground">
            {searching
              ? `Nada coincide con «${search.trim()}».`
              : "Cuando se generen inscripciones aparecerán aquí."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((row) => {
            return (
              <MatriculaCard
                key={row.id}
                inscripcion={row}
                expanded={activeExpandedId === row.id}
                onToggle={() =>
                  setExpandedId((prev) => (prev === row.id ? null : row.id))
                }
                onAprobar={() => setAprobar(row)}
                onRechazar={() => setRechazar(row)}
              />
            );
          })}
        </div>
      )}

      <AprobarMatriculaDialog inscripcion={aprobar} onClose={() => setAprobar(null)} />
      <RechazarMatriculaDialog inscripcion={rechazar} onClose={() => setRechazar(null)} />
    </div>
  );
}
