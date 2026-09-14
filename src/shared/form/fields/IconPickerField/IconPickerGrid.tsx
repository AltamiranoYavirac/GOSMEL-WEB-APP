"use client"

import { Icon } from "@iconify/react"

import { cn } from "@/shared/lib/utils"
import type { IIconPickerGridProps } from "./IconPickerGrid.types"

export function IconPickerGrid({ options, selected, onSelect }: IIconPickerGridProps) {
  return (
    <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-8">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          title={option.label}
          aria-label={option.label}
          onClick={() => onSelect(option.value)}
          className={cn(
            "flex h-10 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary",
            selected === option.value && "border-primary bg-primary/10 text-primary"
          )}
        >
          <Icon icon={option.value} className="size-5" aria-hidden="true" />
        </button>
      ))}
    </div>
  )
}
