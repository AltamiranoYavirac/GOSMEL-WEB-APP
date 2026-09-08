"use client";

import { useMemo, useState } from "react";
import { Icon } from "@iconify/react";

import { cn } from "@/shared/lib/utils";
import { Button, Input, Skeleton, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui";

import type { IAdminDataTableProps } from "./AdminDataTable.types";

const DEFAULT_PAGE_SIZE = 10;

function chipClasses(active: boolean) {
  return cn(
    "shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-colors",
    active
      ? "bg-foreground/10 text-foreground"
      : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
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
}: IAdminDataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [filterValue, setFilterValue] = useState<string>("all");
  const [page, setPage] = useState(1);

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

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex flex-col gap-4 p-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {filters ? (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setFilterValue("all")}
                aria-pressed={filterValue === "all"}
                className={chipClasses(filterValue === "all")}
              >
                Todos
              </button>
              {filters.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setFilterValue(item.value)}
                  aria-pressed={filterValue === item.value}
                  className={chipClasses(filterValue === item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ) : null}

          {searchKeys ? (
            <Input
              icon={<Icon icon="ph:magnifying-glass" aria-hidden="true" />}
              iconPosition="start"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-[9px] border-border bg-sidebar lg:w-72"
            />
          ) : null}
        </div>

        {loading ? (
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.key}>{column.label}</TableHead>
                ))}
                {rowActions ? <TableHead className="text-right">Acciones</TableHead> : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 6 }).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                  ))}
                  {rowActions ? (
                    <TableCell>
                      <Skeleton className="h-5 w-16" />
                    </TableCell>
                  ) : null}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : pageRows.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <Icon icon="ph:tray" className="size-8 text-muted-foreground/60" aria-hidden="true" />
            <p className="font-heading text-lg text-foreground">{emptyTitle}</p>
            {emptyDescription ? <p className="text-sm text-muted-foreground font-light">{emptyDescription}</p> : null}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.key} className={column.headerClassName}>
                    {column.label}
                  </TableHead>
                ))}
                {rowActions ? <TableHead className="text-right">Acciones</TableHead> : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.map((row) => (
                <TableRow key={keyId(row)} className="transition-colors hover:bg-muted/30">
                  {columns.map((column) => (
                    <TableCell key={column.key} className={column.cellClassName}>
                      {column.render(row)}
                    </TableCell>
                  ))}
                  {rowActions ? <TableCell className="text-right">{rowActions(row)}</TableCell> : null}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {!loading && filtered.length > pageSize ? (
        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <p className="font-mono text-xs text-muted-foreground">
            {filtered.length} {countLabel}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              disabled={safePage === 1}
              onClick={() => setPage(safePage - 1)}
              aria-label="Página anterior"
              className="rounded-lg border-border"
            >
              <Icon icon="ph:caret-left" aria-hidden="true" />
            </Button>
            <span className="px-2 font-mono text-xs font-bold text-foreground">
              {safePage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon-sm"
              disabled={safePage === totalPages}
              onClick={() => setPage(safePage + 1)}
              aria-label="Página siguiente"
              className="rounded-lg border-border"
            >
              <Icon icon="ph:caret-right" aria-hidden="true" />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}