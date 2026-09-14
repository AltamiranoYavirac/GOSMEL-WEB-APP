import type { IIconPickerOption } from "./IconPickerField.types"

export interface IIconPickerGridProps {
  options: IIconPickerOption[]
  selected: string
  onSelect: (value: string) => void
}
