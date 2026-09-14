"use client"

import { useEffect, useRef, useState } from "react"
import { Icon } from "@iconify/react"

import { cn } from "@/shared/lib/utils"
import { Button, Popover, PopoverContent, PopoverTrigger } from "@/shared/ui"
import type { ITimeInputProps } from "./time-input.types"

type TPeriod = "am" | "pm"

const HOURS = Array.from({ length: 12 }, (_, index) => index + 1)
const MINUTES = Array.from({ length: 60 }, (_, index) => index)
const PERIODS: TPeriod[] = ["am", "pm"]

function parseTime(value?: string) {
  const match = /^(\d{1,2}):(\d{2})/.exec(value ?? "")
  if (!match) return null
  const hours = Number(match[1])
  const minutes = Number(match[2])
  if (hours > 23 || minutes > 59) return null
  return { hours, minutes }
}

function toHour12(hours: number) {
  const hour12 = hours % 12
  return hour12 === 0 ? 12 : hour12
}

function toPeriod(hours: number): TPeriod {
  return hours < 12 ? "am" : "pm"
}

function buildValue(hour12: number, minutes: number, period: TPeriod) {
  const hours = period === "am" ? hour12 % 12 : (hour12 % 12) + 12
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
}

function formatTime(hour12: number, minutes: number, period: TPeriod) {
  const label = period === "am" ? "a. m." : "p. m."
  return `${String(hour12).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${label}`
}

export function TimeInput({
  value,
  onChange,
  onBlur,
  disabled,
  id,
  className,
  size = "lg",
  placeholder = "--:-- --",
  "aria-label": ariaLabel,
  "aria-invalid": ariaInvalid,
}: ITimeInputProps) {
  const [open, setOpen] = useState(false)
  const columnsRef = useRef<Array<HTMLDivElement | null>>([])

  const parsed = parseTime(value)
  const hours = parsed?.hours ?? 8
  const minutes = parsed?.minutes ?? 0
  const hour12 = toHour12(hours)
  const period = toPeriod(hours)

  const select = (nextHour12: number, nextMinutes: number, nextPeriod: TPeriod) => {
    onChange?.(buildValue(nextHour12, nextMinutes, nextPeriod))
  }

  useEffect(() => {
    if (!open) return
    for (const column of columnsRef.current) {
      if (!column) continue
      const selected = column.querySelector<HTMLElement>('[data-selected="true"]')
      if (selected) {
        column.scrollTop = selected.offsetTop - column.clientHeight / 2 + selected.clientHeight / 2
      }
    }
  }, [open])

  const columns = [
    {
      key: "hour",
      label: "Hora",
      width: "w-14",
      items: HOURS as Array<number | TPeriod>,
      isSelected: (item: number | TPeriod) => item === hour12,
      format: (item: number | TPeriod) => String(item).padStart(2, "0"),
      onSelect: (item: number | TPeriod) => select(Number(item), minutes, period),
    },
    {
      key: "minute",
      label: "Minutos",
      width: "w-14",
      items: MINUTES as Array<number | TPeriod>,
      isSelected: (item: number | TPeriod) => item === minutes,
      format: (item: number | TPeriod) => String(item).padStart(2, "0"),
      onSelect: (item: number | TPeriod) => select(hour12, Number(item), period),
    },
    {
      key: "period",
      label: "Periodo",
      width: "w-20",
      items: PERIODS as Array<number | TPeriod>,
      isSelected: (item: number | TPeriod) => item === period,
      format: (item: number | TPeriod) => (item === "am" ? "a. m." : "p. m."),
      onSelect: (item: number | TPeriod) => select(hour12, minutes, item as TPeriod),
    },
  ]

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) onBlur?.()
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          id={id}
          disabled={disabled}
          aria-label={ariaLabel}
          aria-invalid={ariaInvalid}
          className={cn(
            "w-full justify-start gap-2 rounded-lg border-input bg-background px-3 text-sm font-normal text-foreground",
            size === "lg" ? "h-auto py-3" : "h-8",
            !parsed && "text-muted-foreground",
            className
          )}
        >
          <Icon icon="ph:clock" className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span className="truncate tabular-nums">
            {parsed ? formatTime(hour12, minutes, period) : placeholder}
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-auto gap-0 p-3">
        <p className="pb-2 text-center text-sm font-semibold tabular-nums text-foreground">
          {formatTime(hour12, minutes, period)}
        </p>

        <div className="flex gap-1.5">
          {columns.map((column, index) => (
            <div
              key={column.key}
              ref={(element) => {
                columnsRef.current[index] = element
              }}
              role="listbox"
              aria-label={column.label}
              className={cn(
                "relative flex h-52 flex-col gap-0.5 overflow-y-auto overscroll-contain rounded-md p-0.5 [scrollbar-width:thin]",
                column.width
              )}
            >
              {column.items.map((item) => {
                const selected = column.isSelected(item)
                return (
                  <button
                    key={String(item)}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    data-selected={selected || undefined}
                    onClick={() => column.onSelect(item)}
                    className={cn(
                      "flex h-8 shrink-0 items-center justify-center rounded-md text-sm tabular-nums transition-colors",
                      selected
                        ? "bg-primary font-semibold text-primary-foreground"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    {column.format(item)}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
