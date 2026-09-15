"use client";

import { useMemo, useState } from "react";
import { Icon } from "@iconify/react";

import { AdminPageHeader, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Skeleton } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";

import { useEstudiantes } from "../hooks/useEstudiantes";
import type { IEstudianteRow } from "../model/estudiante.types";
import AsignarCursoEstudianteDialog from "./AsignarCursoEstudianteDialog";
import CrearEstudianteDialog from "./CrearEstudianteDialog";
import EstudianteFichaCard from "./EstudianteFichaCard";
import type { TEstadoFiltro } from "./EstudiantesList.types";

export default function EstudiantesList() {
  const { data, isPending } = useEstudiantes();
  const rows = useMemo(() => data ?? [], [data]);

  const [estado, setEstado] = useState<TEstadoFiltro | "todos">("todos");
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
  const inactivosCount = rows.length - activosCount;
  const searching = search.trim().length > 0 || instrumento !== "todos" || estado !== "todos";

  const estadoOpciones: { value: TEstadoFiltro | "todos"; label: string; count: number }[] = [
    { value: "todos", label: "Todos", count: rows.length },
    { value: "activos", label: "Activos", count: activosCount },
    { value: "inactivos", label: "Inactivos", count: inactivosCount },
  ];

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

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div
            role="group"
            aria-label="Filtrar por estado"
            className="inline-flex items-center gap-1 rounded-lg border border-border bg-card p-1 shadow-xs"
          >
            {estadoOpciones.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setEstado(option.value)}
                aria-pressed={estado === option.value}
                className={cn(
                  "h-8 rounded-md px-3 text-xs font-semibold whitespace-nowrap transition-colors",
                  estado === option.value
                    ? "bg-foreground text-background shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {option.label} · {option.count}
              </button>
            ))}
          </div>
          {searching ? (
            <p className="text-xs text-muted-foreground" role="status">
              {filtered.length} resultado{filtered.length === 1 ? "" : "s"}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <Input
              icon={<Icon icon="ph:magnifying-glass" aria-hidden="true" />}
              iconPosition="start"
              placeholder="Buscar por nombre, cédula, correo…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-10 rounded-lg border-border bg-card text-sm shadow-xs"
            />
          </div>
          <Select value={instrumento} onValueChange={setInstrumento}>
            <SelectTrigger
              size="sm"
              aria-label="Filtrar por instrumento"
              className="h-10 w-full shrink-0 rounded-lg border-border bg-card text-xs font-semibold shadow-xs sm:w-52"
            >
              <SelectValue placeholder="Instrumento" />
            </SelectTrigger>
            <SelectContent>
              {instrumentos.map((item) => (
                <SelectItem key={item} value={item}>
                  {item === "todos" ? "Todos los instrumentos" : item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isPending ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-56 w-full rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card py-16 text-center">
          <Icon
            icon={searching ? "ph:magnifying-glass" : "ph:student"}
            className="size-8 text-muted-foreground/60"
            aria-hidden="true"
          />
          <p className="font-heading text-lg font-bold text-foreground">
            {searching ? "Sin resultados" : "Sin estudiantes"}
          </p>
          <p className="text-sm text-muted-foreground">
            {searching
              ? "Prueba con otro nombre o limpia los filtros."
              : "Cuando se registren estudiantes aparecerán aquí."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4">
          {filtered.map((row) => (
            <EstudianteFichaCard key={row.id} estudiante={row} />
          ))}
        </div>
      )}
    </div>
  );
}
