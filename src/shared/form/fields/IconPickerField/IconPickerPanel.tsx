"use client"

import { Icon } from "@iconify/react"

import { Input, Spinner } from "@/shared/ui"
import { IconPickerGrid } from "./IconPickerGrid"
import type { IIconPickerPanelProps } from "./IconPickerPanel.types"

export function IconPickerPanel({
  query,
  onQueryChange,
  suggestedOptions,
  results,
  isSearching,
  isError,
  selected,
  onSelect,
}: IIconPickerPanelProps) {
  const searching = query.trim().length >= 2
  const resultOptions = results.map((value) => ({ value, label: value.replace("ph:", "") }))

  return (
    <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-3">
      <Input
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Buscar en inglés: drum, flute, saxophone..."
        icon={<Icon icon="ph:magnifying-glass" aria-hidden="true" />}
        iconPosition="start"
      />

      {searching ? (
        <div className="space-y-2">
          <p className="px-1 text-xs font-semibold text-muted-foreground">Resultados</p>
          {isSearching ? (
            <div className="flex items-center justify-center gap-2 py-4 text-xs text-muted-foreground">
              <Spinner className="size-3.5" />
              Buscando iconos...
            </div>
          ) : isError ? (
            <p className="px-1 py-3 text-xs text-destructive">
              No se pudo buscar en Iconify. Revisa la conexión e inténtalo de nuevo.
            </p>
          ) : resultOptions.length === 0 ? (
            <p className="px-1 py-3 text-xs text-muted-foreground">
              Sin resultados para “{query.trim()}”.
            </p>
          ) : (
            <IconPickerGrid options={resultOptions} selected={selected} onSelect={onSelect} />
          )}
        </div>
      ) : null}

      {suggestedOptions.length > 0 ? (
        <div className="space-y-2">
          <p className="px-1 text-xs font-semibold text-muted-foreground">Sugeridos</p>
          <IconPickerGrid options={suggestedOptions} selected={selected} onSelect={onSelect} />
        </div>
      ) : null}
    </div>
  )
}
