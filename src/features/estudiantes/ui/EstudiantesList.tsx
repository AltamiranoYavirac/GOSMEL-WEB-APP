"use client";

import { useMemo, useState } from "react";
import { Icon } from "@iconify/react";

import { AdminPageHeader, Input, Skeleton } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";

import { useEstudiantes } from "../hooks/useEstudiantes";
import type { IEstudianteRow } from "../model/estudiante.types";
import AsignarCursoEstudianteDialog from "./AsignarCursoEstudianteDialog";
import CrearEstudianteDialog from "./CrearEstudianteDialog";
import EstudianteFichaCard from "./EstudianteFichaCard";

type TEstadoFiltro = "activos" | "inactivos";

export default function EstudiantesList() {
  const { data, isPending } = useEstudiantes();
  const rows = useMemo(() => data ?? [], [data]);

  const [estado, setEstado] = useState<TEstadoFiltro>("activos");
  const [search, setSearch] = useState("");
  const [instrumento, setInstrumento] = useState("todos");

  const instrumentos = useMemo(() => {
    const set = new Set<string>();
    for (const row of rows) row.instrumentos.forEach((item) => set.add(item));
    return ["todos", ...Array.from(set).sort()];
  }, [rows]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return rows.filter((row: IEstudianteRow) => {
      if (estado === "activos" && !row.activo) return false;
      if (estado === "inactivos" && row.activo) return false;
      if (instrumento !== "todos" && !row.instrumentos.includes(instrumento)) return false;
      if (!query) return true;
      return [row.nombreCompleto, row.cedula ?? "", row.email ?? "", row.representante ?? ""].some((value) =>
        value.toLowerCase().includes(query)
      );
    });
  }, [rows, estado, instrumento, search]);

  const activosCount = rows.filter((row) => row.activo).length;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Personas · GOSMEL"
        title="Estudiantes"
        description="Datos personales, nivel musical, cursos inscritos y docentes a cargo."
        icon="ph:student"
      >
        <AsignarCursoEstudianteDialog />
        <CrearEstudianteDialog />
      </AdminPageHeader>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[13px] font-medium text-muted-foreground">
          {activosCount} activos · {rows.length - activosCount} inactivos
        </span>
        <div className="mx-1 h-5 w-px bg-border" />
        {(["activos", "inactivos"] as TEstadoFiltro[]).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setEstado(value)}
            aria-pressed={estado === value}
            className={cn(
              "rounded-full px-4 py-2 text-xs font-bold capitalize transition-colors",
              estado === value
                ? "bg-foreground/10 text-foreground"
                : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
            )}
          >
            {value}
          </button>
        ))}
        <select
          value={instrumento}
          onChange={(event) => setInstrumento(event.target.value)}
          className="rounded-[9px] border border-border bg-sidebar px-3 py-2 text-xs font-semibold text-foreground"
        >
          {instrumentos.map((item) => (
            <option key={item} value={item}>
              {item === "todos" ? "Instrumento: todos" : item}
            </option>
          ))}
        </select>
        <Input
          icon={<Icon icon="ph:magnifying-glass" aria-hidden="true" />}
          iconPosition="start"
          placeholder="Buscar estudiante…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full rounded-[9px] border-border bg-sidebar sm:ml-auto sm:w-64"
        />
      </div>

      {isPending ? (
        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-52 w-full rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card py-16 text-center">
          <Icon icon="ph:student" className="size-8 text-muted-foreground/60" aria-hidden="true" />
          <p className="font-heading text-lg text-foreground">Sin estudiantes</p>
          <p className="text-sm text-muted-foreground">Cuando se registren estudiantes aparecerán aquí.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((row) => (
            <EstudianteFichaCard key={row.id} estudiante={row} />
          ))}
        </div>
      )}
    </div>
  );
}
