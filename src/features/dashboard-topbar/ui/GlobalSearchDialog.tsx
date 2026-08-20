"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

import { cn } from "@/shared/lib/utils";
import { Button, Spinner } from "@/shared/ui";

import { useEntitySearch } from "../hooks/useEntitySearch";
import { GROUP_META } from "../model/topbar-constants";
import type { TSearchGroup } from "../model/topbar.types";
import type { IFlatSearchResult } from "./GlobalSearchDialog.types";

export default function GlobalSearchDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const search = useEntitySearch(query);
  const results = search.data;

  const flat = useMemo<IFlatSearchResult[]>(() => {
    if (!results) return [];
    return (Object.keys(results) as TSearchGroup[]).flatMap((group) =>
      results[group].map((item) => ({ group, item }))
    );
  }, [results]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  function openDialog() {
    setQuery("");
    setActiveIndex(0);
    setOpen(true);
  }

  function closeDialog() {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }

  function onQueryChange(next: string) {
    setQuery(next);
    setActiveIndex(0);
  }

  function selectResult(entry: IFlatSearchResult) {
    closeDialog();
    router.push(entry.item.href);
  }

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, flat.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const entry = flat[activeIndex];
      if (entry) selectResult(entry);
    }
  }

  return (
    <>
      <Button
        variant="outline"
        className="hidden h-9 w-56 justify-between gap-2 border-border bg-background px-3 text-muted-foreground xl:flex"
        onClick={openDialog}
      >
        <span className="flex items-center gap-2">
          <Icon icon="ph:magnifying-glass" width={16} height={16} aria-hidden="true" />
          Buscar…
        </span>
        <kbd className="rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
          ⌘K
        </kbd>
      </Button>

      <Button
        variant="ghost"
        size="icon-lg"
        className="xl:hidden"
        aria-label="Buscar"
        onClick={openDialog}
      >
        <Icon icon="ph:magnifying-glass" width={20} height={20} aria-hidden="true" />
      </Button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="Buscar">
          <button
            type="button"
            aria-label="Cerrar búsqueda"
            className="absolute inset-0 bg-scrim-strong backdrop-blur-sm"
            onClick={closeDialog}
          />

          <div className="relative w-full max-w-xl overflow-hidden rounded-xl border border-border bg-popover shadow-2xl">
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Icon icon="ph:magnifying-glass" width={18} height={18} className="shrink-0 text-muted-foreground" aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="Busca estudiantes, docentes o cursos…"
                className="h-12 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <kbd className="shrink-0 rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                ESC
              </kbd>
            </div>

            <div className="max-h-[55vh] overflow-y-auto p-2">
              {search.isPending ? (
                <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
                  <Spinner />
                  Buscando…
                </div>
              ) : query.trim().length < 2 ? (
                <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                  Escribe al menos 2 caracteres para buscar.
                </p>
              ) : flat.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                  Sin resultados para «{query.trim()}».
                </p>
              ) : (
                <div className="space-y-1">
                  {flat.map((entry, index) => {
                    const meta = GROUP_META[entry.group];
                    const showHeader = index === 0 || flat[index - 1].group !== entry.group;
                    return (
                      <div key={entry.item.id}>
                        {showHeader ? (
                          <p className="flex items-center gap-1.5 px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                            <Icon icon={meta.icon} width={12} height={12} aria-hidden="true" />
                            {meta.label}
                          </p>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => selectResult(entry)}
                          onMouseEnter={() => setActiveIndex(index)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors",
                            index === activeIndex ? "bg-primary-tint text-foreground" : "text-foreground/90"
                          )}
                        >
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium">{entry.item.label}</span>
                            <span className="block truncate text-xs text-muted-foreground">{entry.item.subtitle}</span>
                          </span>
                          {index === activeIndex ? (
                            <Icon icon="ph:arrow-right" width={14} height={14} className="shrink-0 text-muted-foreground" aria-hidden="true" />
                          ) : null}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
