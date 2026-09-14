"use client"

import { useMemo, useState } from "react"
import { Icon } from "@iconify/react"
import type { FieldValues } from "react-hook-form"

import { cn } from "@/shared/lib/utils"
import { Button, FormField } from "@/shared/ui"
import { useConnectedField } from "../useConnectedField"
import { IconPickerPanel } from "./IconPickerPanel"
import type { IIconPickerFieldProps } from "./IconPickerField.types"
import { useIconPickerSearch } from "./useIconPickerSearch"

export function IconPickerField<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  required,
  hint,
  disabled,
  className,
  errorIcon,
  errorClassName,
  suggestedIcons = [],
  placeholder = "Elegir icono",
}: IIconPickerFieldProps<TFieldValues>) {
  const { fieldValue, fieldOnChange, fieldOnBlur, error, touched } =
    useConnectedField<TFieldValues>(name)
  const [expanded, setExpanded] = useState(false)
  const [query, setQuery] = useState("")
  const search = useIconPickerSearch(query)

  const value = (fieldValue ?? "") as string
  const showError = touched && !!error

  const filteredSuggestions = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return suggestedIcons
    return suggestedIcons.filter(
      (option) =>
        option.label.toLowerCase().includes(q) || option.value.toLowerCase().includes(q)
    )
  }, [query, suggestedIcons])

  const onSelect = (icon: string) => {
    fieldOnChange(icon)
    fieldOnBlur()
    setExpanded(false)
    setQuery("")
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
      <div className="space-y-2">
        <Button
          id={name}
          type="button"
          variant="outline"
          disabled={disabled}
          aria-invalid={showError || undefined}
          onClick={() => setExpanded((prev) => !prev)}
          className={cn("w-full justify-between", !value && "text-muted-foreground")}
        >
          <span className="flex items-center gap-2.5">
            <Icon
              icon={value || "ph:shapes"}
              className={cn("size-5", value && "text-primary")}
              aria-hidden="true"
            />
            {value ? value : placeholder}
          </span>
          <Icon
            icon={expanded ? "ph:caret-up" : "ph:caret-down"}
            className="size-4 text-muted-foreground"
            aria-hidden="true"
          />
        </Button>

        {expanded ? (
          <IconPickerPanel
            query={query}
            onQueryChange={setQuery}
            suggestedOptions={filteredSuggestions}
            results={search.data ?? []}
            isSearching={search.isFetching}
            isError={search.isError}
            selected={value}
            onSelect={onSelect}
          />
        ) : null}
      </div>
    </FormField>
  )
}
