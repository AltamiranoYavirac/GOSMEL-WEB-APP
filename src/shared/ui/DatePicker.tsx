"use client"

import { useState } from "react"
import { format, isValid, parse } from "date-fns"
import { es } from "date-fns/locale"
import { Icon } from "@iconify/react"

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
  max,
  placeholder = "Selecciona una fecha",
}: IDatePickerProps) {
  const [open, setOpen] = useState(false)
  const selected = parseValue(value)
  const maxDate = parseValue(max ?? null)

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
            "h-auto w-full justify-start gap-2 rounded-lg border-input bg-background px-4 py-3 text-base font-normal text-foreground hover:bg-muted",
            !selected && "text-muted-foreground"
          )}
        >
          <Icon icon="ph:calendar" className="size-4 text-muted-foreground" aria-hidden="true" />
          {selected
            ? format(selected, "d 'de' MMMM 'de' yyyy", { locale: es })
            : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          locale={es}
          captionLayout="dropdown"
          selected={selected}
          defaultMonth={selected ?? maxDate}
          startMonth={new Date(new Date().getFullYear() - 100, 0)}
          endMonth={maxDate ?? new Date()}
          disabled={maxDate ? { after: maxDate } : undefined}
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
