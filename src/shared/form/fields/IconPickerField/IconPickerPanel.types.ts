import type { IIconPickerOption } from "./IconPickerField.types"

export interface IIconPickerPanelProps {
  query: string
  onQueryChange: (value: string) => void
  suggestedOptions: IIconPickerOption[]
  results: string[]
  isSearching: boolean
  isError: boolean
  selected: string
  onSelect: (value: string) => void
}
