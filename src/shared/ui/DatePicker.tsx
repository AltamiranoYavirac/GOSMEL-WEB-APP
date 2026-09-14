"use client"

import { useState } from "react"
import { addYears, format, isValid, parse } from "date-fns"
import { es } from "date-fns/locale/es"
import { Icon } from "@iconify/react"
import type { Matcher } from "react-day-picker"

import { cn } from "@/shared/lib/utils"
import { Button, Calendar, Popover, PopoverContent, PopoverTrigger } from "@/shared/ui"
import type { IDatePickerProps } from "./DatePicker.types"

const VALUE_FORMAT = "yyyy-MM-dd"

function parseValue(value: string | null) {
  if (!value) return undefined
  const parsed = parse(value, VALUE_FORMAT, new Date())
  return isValid(parsed) ? parsed : undefined
}

export function DatePicker({
  value,
  onChange,
  onBlur,
  disabled,
  min,
  max,
  placeholder = "Selecciona una fecha",
}: IDatePickerProps) {
  const [open, setOpen] = useState(false)
  const selected = parseValue(value)
  const minDate = parseValue(min ?? null)
  const maxDate = parseValue(max ?? null)
  const today = new Date()

  const matchers: Matcher[] = []
  if (minDate) matchers.push({ before: minDate })
  if (maxDate) matchers.push({ after: maxDate })

  return (
    <Popover open={open} onOpenChange={(nextOpen) => {
      setOpen(nextOpen)
      if (!nextOpen) onBlur?.()
    }}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "h-10 w-full min-w-0 max-w-full justify-start gap-2 rounded-lg border-input bg-background px-3 py-2 text-sm font-normal text-foreground hover:bg-muted overflow-hidden",
            !selected && "text-muted-foreground"
          )}
        >
          <Icon icon="ph:calendar" className="size-4 text-muted-foreground shrink-0" aria-hidden="true" />
          <span className="truncate min-w-0 flex-1 text-left">
            {selected
              ? format(selected, "d 'de' MMMM, yyyy", { locale: es })
              : placeholder}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0 z-50">
        <Calendar
          mode="single"
          locale={es}
          captionLayout="dropdown"
          selected={selected}
          defaultMonth={selected ?? minDate ?? maxDate}
          startMonth={minDate ?? addYears(today, -100)}
          endMonth={maxDate ?? addYears(today, 5)}
          disabled={matchers.length > 0 ? matchers : undefined}
          onSelect={(date) => {
            if (!date) return
            onChange(format(date, VALUE_FORMAT))
            setOpen(false)
            onBlur?.()
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
