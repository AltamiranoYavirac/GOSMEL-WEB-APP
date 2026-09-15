"use client";

import { useMemo, useState } from "react";
import { Icon } from "@iconify/react";

import { useInscripcionesPendientes, type IInscripcionPendiente } from "@/entities/matricula";
import {
  AdminPageHeader,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from "@/shared/ui";

import AprobarMatriculaDialog from "./AprobarMatriculaDialog";
import MatriculaQueueRow from "./MatriculaQueueRow";
import MatriculaReviewSheet from "./MatriculaReviewSheet";
import RechazarMatriculaDialog from "./RechazarMatriculaDialog";
import { cupoPorcentaje } from "./CupoBar";

type TOrden = "urgencia" | "recientes" | "cupo";

function compararPorOrden(orden: TOrden) {
  return (a: IInscripcionPendiente, b: IInscripcionPendiente) => {
    if (orden === "recientes") {
      return +new Date(b.fechaInscripcion) - +new Date(a.fechaInscripcion);
    }
    if (orden === "cupo") {
      const pctA = cupoPorcentaje(a.cuposOcupados, a.cupoMaximo) ?? -1;
      const pctB = cupoPorcentaje(b.cuposOcupados, b.cupoMaximo) ?? -1;
      if (pctB !== pctA) return pctB - pctA;
      return b.diasEspera - a.diasEspera;
    }
    if (b.diasEspera !== a.diasEspera) return b.diasEspera - a.diasEspera;
    return +new Date(a.fechaInscripcion) - +new Date(b.fechaInscripcion);
  };
}

export default function MatriculasList() {
  const { data, isPending } = useInscripcionesPendientes();
  const rows = useMemo(() => data ?? [], [data]);

  const [search, setSearch] = useState("");
  const [orden, setOrden] = useState<TOrden>("urgencia");
  const [selected, setSelected] = useState<IInscripcionPendiente | null>(null);
  const [aprobar, setAprobar] = useState<IInscripcionPendiente | null>(null);
  const [rechazar, setRechazar] = useState<IInscripcionPendiente | null>(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const base = query
      ? rows.filter((row) =>
          [
            row.estudiante,
            row.cursoNombre ?? "",
            row.catedraCodigo ?? "",
            row.docenteNombre ?? "",
            row.instrumentoNombre ?? "",
          ].some((value) => value.toLowerCase().includes(query))
        )
      : [...rows];
    return base.sort(compararPorOrden(orden));
  }, [rows, search, orden]);

  const searching = search.trim().length > 0;
  const urgentes = rows.filter((row) => row.diasEspera >= 7).length;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Admisiones · GOSMEL"
        title="Matrículas por aprobar"
        description="Inscripciones que esperan tu decisión antes de activarse."
        icon="ph:user-plus"
      />

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-warning-border bg-warning-tint px-4 py-2 text-xs font-bold text-warning-fg">
            <Icon icon="ph:clock-countdown" className="size-3.5" aria-hidden="true" />
            Pendientes · {rows.length}
          </span>
          {urgentes > 0 ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-danger-border bg-danger-tint px-4 py-2 text-xs font-bold text-danger-fg">
              <Icon icon="ph:alarm" className="size-3.5" aria-hidden="true" />
              Urgentes · {urgentes}
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <Input
            icon={<Icon icon="ph:magnifying-glass" aria-hidden="true" />}
            iconPosition="start"
            placeholder="Buscar por alumno, curso, docente…"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setSelected(null);
            }}
            className="h-11 min-w-0 flex-1 rounded-xl border-border bg-card text-sm shadow-xs"
          />
          <Select value={orden} onValueChange={(value) => setOrden(value as TOrden)}>
            <SelectTrigger size="sm" className="h-11 w-36 shrink-0 rounded-xl border-border bg-card text-xs font-semibold shadow-xs sm:w-48 sm:text-sm" aria-label="Ordenar matrículas">
              <SelectValue placeholder="Ordenar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="urgencia">Más espera primero</SelectItem>
              <SelectItem value="recientes">Más recientes</SelectItem>
              <SelectItem value="cupo">Cupo más lleno</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isPending ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-80 w-full rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card py-16 text-center">
          <Icon
            icon={searching ? "ph:magnifying-glass" : "ph:identification-card"}
            className="size-8 text-muted-foreground/60"
            aria-hidden="true"
          />
          <p className="font-heading text-lg font-extrabold tracking-tight text-foreground">
            {searching ? "Sin resultados" : "Sin matrículas pendientes"}
          </p>
          <p className="text-sm text-muted-foreground">
            {searching
              ? `Nada coincide con «${search.trim()}».`
              : "Cuando se generen inscripciones aparecerán aquí."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3">
          {searching ? (
            <p className="text-xs text-muted-foreground" role="status">
              {filtered.length} resultado{filtered.length === 1 ? "" : "s"} para «{search.trim()}»
            </p>
          ) : null}
          {filtered.map((row) => {
            return (
              <MatriculaQueueRow
                key={row.id}
                inscripcion={row}
                onSelect={() => setSelected(row)}
              />
            );
          })}
        </div>
      )}

      <MatriculaReviewSheet
        inscripcion={selected}
        onClose={() => setSelected(null)}
        onAprobar={(row) => {
          setSelected(null);
          setAprobar(row);
        }}
        onRechazar={(row) => {
          setSelected(null);
          setRechazar(row);
        }}
      />
      <AprobarMatriculaDialog inscripcion={aprobar} onClose={() => setAprobar(null)} />
      <RechazarMatriculaDialog inscripcion={rechazar} onClose={() => setRechazar(null)} />
    </div>
  );
}
