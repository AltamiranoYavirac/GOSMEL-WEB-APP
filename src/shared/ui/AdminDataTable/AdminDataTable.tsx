"use client";

import { useId, useMemo, useState } from "react";
import { Icon } from "@iconify/react";

import { cn } from "@/shared/lib/utils";
import { Button, Checkbox, Input, Skeleton, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui";

import type { IAdminColumn, IAdminDataTableProps } from "./AdminDataTable.types";

const DEFAULT_PAGE_SIZE = 10;

function filterClasses(active: boolean) {
  return cn(
    "inline-flex h-7 shrink-0 items-center gap-1.5 rounded-md border px-2.5 text-xs font-medium whitespace-nowrap tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    active
      ? "border-foreground bg-foreground text-background"
      : "border-border bg-transparent text-muted-foreground hover:border-foreground/30 hover:bg-muted/60 hover:text-foreground"
  );
}

export default function AdminDataTable<T>({
  data,
  columns,
  loading = false,
  keyId,
  searchKeys,
  searchPlaceholder = "Buscar…",
  filters,
  emptyTitle = "Sin resultados",
  emptyDescription,
  rowActions,
  countLabel = "registros",
  pageSize = DEFAULT_PAGE_SIZE,
  selection,
  mobileCard,
}: IAdminDataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [filterValue, setFilterValue] = useState<string>("all");
  const [page, setPage] = useState(1);
  const searchId = useId();

  const filtered = useMemo(() => {
    let rows = data;
    if (filters && filterValue !== "all") {
      const active = filters.find((item) => item.value === filterValue);
      if (active) rows = rows.filter((row) => active.match(row));
    }
    const query = search.trim().toLowerCase();
    if (query && searchKeys && searchKeys.length > 0) {
      rows = rows.filter((row) => searchKeys.some((getter) => getter(row).toLowerCase().includes(query)));
    }
    return rows;
  }, [data, search, filterValue, filters, searchKeys]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const columnByKey = new Map(columns.map((column) => [column.key, column]));
  const mobileTitle = columnByKey.get(mobileCard?.titleKey ?? columns[0]?.key) ?? columns[0];
  const mobileSummary = (mobileCard?.summaryKeys ?? columns.slice(1, 4).map((column) => column.key))
    .map((key) => columnByKey.get(key))
    .filter((column): column is IAdminColumn<T> => column !== undefined && column.key !== mobileTitle?.key);
  const mobileDetails = (mobileCard?.detailsKeys ?? columns
    .map((column) => column.key)
    .filter((key) => key !== mobileTitle?.key && !mobileSummary.some((column) => column.key === key)))
    .map((key) => columnByKey.get(key))
    .filter((column): column is IAdminColumn<T> => column !== undefined && column.key !== mobileTitle?.key && !mobileSummary.some((summary) => summary.key === column.key));

  const pageIds = pageRows.map(keyId);
  const selectedOnPage = selection ? pageIds.filter((id) => selection.selectedIds.includes(id)).length : 0;
  const allPageSelected = pageIds.length > 0 && selectedOnPage === pageIds.length;
  const somePageSelected = selectedOnPage > 0 && !allPageSelected;

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card" aria-label="Tabla de datos">
      <div className="space-y-3 border-b border-border px-4 py-3 sm:px-4">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          {searchKeys ? (
            <div className="relative w-full sm:max-w-[300px] sm:shrink-0">
              <label className="sr-only" htmlFor={searchId}>Buscar registros</label>
              <Input
                id={searchId}
                icon={<Icon icon="ph:magnifying-glass" aria-hidden="true" />}
                iconPosition="start"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(event) => { setSearch(event.target.value); setPage(1); }}
                className="h-8 bg-background pr-8"
              />
              {search ? (
                <button
                  type="button"
                  onClick={() => { setSearch(""); setPage(1); }}
                  aria-label="Limpiar búsqueda"
                  className="absolute top-1/2 right-1.5 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Icon icon="ph:x" className="size-3.5" aria-hidden="true" />
                </button>
              ) : null}
            </div>
          ) : null}
          <p className="text-xs text-muted-foreground tabular-nums sm:text-right" aria-live="polite">
            <span className="font-semibold text-foreground">{filtered.length}</span> {countLabel}
            {filters && filterValue !== "all" ? <span> · filtrado de {data.length}</span> : null}
          </p>
        </div>

        {filters ? (
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtros de registros">
            <button type="button" onClick={() => { setFilterValue("all"); setPage(1); }} aria-pressed={filterValue === "all"} className={filterClasses(filterValue === "all")}>
              Todos <span className="font-mono text-[11px] opacity-70 tabular-nums">{data.length}</span>
            </button>
            {filters.map((item) => {
              const count = data.filter((row) => item.match(row)).length;
              return (
                <button key={item.value} type="button" onClick={() => { setFilterValue(item.value); setPage(1); }} aria-pressed={filterValue === item.value} className={filterClasses(filterValue === item.value)}>
                  {item.label} <span className="font-mono text-[11px] opacity-70 tabular-nums">{count}</span>
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      {loading ? (
        <>
          <Table className="hidden md:table">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {selection ? <TableHead className="w-10 first:pl-4" /> : null}
                {columns.map((column) => <TableHead key={column.key} scope="col" className={cn("h-9 px-3 text-[11px] font-semibold tracking-[0.06em] text-muted-foreground uppercase first:pl-4 last:pr-4", column.headerClassName)}>{column.label}</TableHead>)}
                {rowActions ? <TableHead className="pr-4 text-right" scope="col">Acciones</TableHead> : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 6 }).map((_, index) => (
                <TableRow key={index}>
                  {selection ? <TableCell><Skeleton className="size-4" /></TableCell> : null}
                  {columns.map((column) => <TableCell key={column.key}><Skeleton className="h-5 w-24" /></TableCell>)}
                  {rowActions ? <TableCell><Skeleton className="h-5 w-16" /></TableCell> : null}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="divide-y divide-border md:hidden">
            {Array.from({ length: 4 }).map((_, index) => <div key={index} className="space-y-3 p-4"><Skeleton className="h-4 w-40" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-2/3" /></div>)}
          </div>
        </>
      ) : pageRows.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 px-4 py-16 text-center">
          <Icon icon="ph:tray" className="size-8 text-muted-foreground/60" aria-hidden="true" />
          <p className="font-heading text-lg text-foreground">{emptyTitle}</p>
          {emptyDescription ? <p className="text-sm text-muted-foreground">{emptyDescription}</p> : null}
        </div>
      ) : (
        <>
          <Table className="hidden md:table">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {selection ? (
                  <TableHead className="w-10 first:pl-4">
                    <Checkbox checked={allPageSelected ? true : somePageSelected ? "indeterminate" : false} onCheckedChange={() => selection.onToggleAll(pageIds)} aria-label="Seleccionar todas las filas de la página" />
                  </TableHead>
                ) : null}
                {columns.map((column) => <TableHead key={column.key} scope="col" className={cn("h-9 px-3 text-[11px] font-semibold tracking-[0.06em] text-muted-foreground uppercase first:pl-4 last:pr-4", column.headerClassName)}>{column.label}</TableHead>)}
                {rowActions ? <TableHead className="pr-4 text-right" scope="col">Acciones</TableHead> : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.map((row) => (
                <TableRow key={keyId(row)} className="hover:bg-muted/40">
                  {selection ? <TableCell className="first:pl-4"><Checkbox checked={selection.selectedIds.includes(keyId(row))} onCheckedChange={() => selection.onToggle(keyId(row))} aria-label="Seleccionar fila" /></TableCell> : null}
                  {columns.map((column) => <TableCell key={column.key} className={cn("px-3 py-2.5 text-[13px] first:pl-4 last:pr-4", column.cellClassName)}>{column.render(row)}</TableCell>)}
                  {rowActions ? <TableCell className="pr-4 text-right whitespace-nowrap">{rowActions(row)}</TableCell> : null}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="divide-y divide-border md:hidden">
            {pageRows.map((row) => (
              <article key={keyId(row)} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    {mobileTitle ? <div className="truncate text-sm font-semibold text-foreground">{mobileTitle.render(row)}</div> : null}
                  </div>
                  {selection ? <Checkbox checked={selection.selectedIds.includes(keyId(row))} onCheckedChange={() => selection.onToggle(keyId(row))} aria-label="Seleccionar fila" /> : null}
                </div>
                {mobileSummary.length > 0 ? (
                  <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
                    {mobileSummary.map((column) => <div key={column.key} className="min-w-0"><dt className="text-[11px] font-medium text-muted-foreground">{column.label}</dt><dd className="mt-0.5 truncate text-sm text-foreground">{column.render(row)}</dd></div>)}
                  </dl>
                ) : null}
                {mobileDetails.length > 0 ? (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-xs font-medium text-muted-foreground">Ver detalle</summary>
                    <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border pt-3">
                      {mobileDetails.map((column) => <div key={column.key} className="min-w-0"><dt className="text-[11px] font-medium text-muted-foreground">{column.label}</dt><dd className="mt-0.5 truncate text-sm text-foreground">{column.render(row)}</dd></div>)}
                    </dl>
                  </details>
                ) : null}
                {rowActions ? <div className="mt-4 flex justify-end border-t border-border pt-3">{rowActions(row)}</div> : null}
              </article>
            ))}
          </div>
        </>
      )}

      {!loading && pageRows.length > 0 ? (
        <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
          <p className="text-xs text-muted-foreground tabular-nums">Mostrando {(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, filtered.length)} de {filtered.length}</p>
          {filtered.length > pageSize ? (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon-sm" disabled={safePage === 1} onClick={() => setPage(safePage - 1)} aria-label="Página anterior">
                <Icon icon="ph:caret-left" aria-hidden="true" />
              </Button>
              <span className="px-1 font-mono text-xs font-medium text-foreground">{safePage} / {totalPages}</span>
              <Button variant="outline" size="icon-sm" disabled={safePage === totalPages} onClick={() => setPage(safePage + 1)} aria-label="Página siguiente">
                <Icon icon="ph:caret-right" aria-hidden="true" />
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
