"use client"

import { useState } from "react"
import { Icon } from "@iconify/react"
import type { FieldValues } from "react-hook-form"

import { Badge, Button, Checkbox, FormField, Popover, PopoverContent, PopoverTrigger } from "@/shared/ui"
import { UI_ICONS } from "@/shared/config"
import { useConnectedField } from "../useConnectedField"
import type { IMultiSelectFieldProps } from "./MultiSelectField.types"

export function MultiSelectField<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  required,
  hint,
  disabled,
  className,
  errorIcon,
  errorClassName,
  options,
  placeholder = "Seleccione opciones",
  emptyLabel = "Sin opciones disponibles",
}: IMultiSelectFieldProps<TFieldValues>) {
  const { fieldValue, fieldOnChange, fieldOnBlur, error, touched } =
    useConnectedField<TFieldValues>(name)
  const [open, setOpen] = useState(false)
  const selected = Array.isArray(fieldValue) ? (fieldValue as string[]) : []
  const showError = touched && !!error

  const toggle = (value: string) => {
    fieldOnChange(
      selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]
    )
  }

  return (
    <FormField
      label={label}
      name={name}
      required={required}
      hint={hint}
      error={error}
      touched={touched}
      errorIcon={errorIcon}
      errorClassName={errorClassName}
      className={className}
    >
      <Popover
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          if (!next) fieldOnBlur()
        }}
      >
        <PopoverTrigger asChild>
          <Button
            id={name}
            type="button"
            variant="outline"
            disabled={disabled}
            aria-invalid={showError || undefined}
            className="h-auto min-h-9 w-full justify-between gap-2 py-1.5 font-normal"
          >
            {selected.length === 0 ? (
              <span className="truncate text-muted-foreground">{placeholder}</span>
            ) : (
              <span className="flex flex-wrap items-center gap-1">
                {selected.map((value) => (
                  <Badge key={value} variant="secondary">
                    {options.find((option) => option.value === value)?.label ?? value}
                  </Badge>
                ))}
              </span>
            )}
            <Icon icon={UI_ICONS.caretDown} className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start" className="w-72 p-1">
          {options.length === 0 ? (
            <p className="px-2 py-1.5 text-sm text-muted-foreground">{emptyLabel}</p>
          ) : (
            <div role="listbox" aria-multiselectable="true" className="max-h-60 overflow-y-auto">
              {options.map((option) => {
                const checked = selected.includes(option.value)
                return (
                  <div
                    key={option.value}
                    role="option"
                    aria-selected={checked}
                    tabIndex={0}
                    onClick={() => toggle(option.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault()
                        toggle(option.value)
                      }
                    }}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none hover:bg-accent focus-visible:bg-accent"
                  >
                    <Checkbox checked={checked} tabIndex={-1} className="pointer-events-none" />
                    <span className="truncate">{option.label}</span>
                  </div>
                )
              })}
            </div>
          )}
        </PopoverContent>
      </Popover>
    </FormField>
  )
}
