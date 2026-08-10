export interface IDatePickerProps {
  value: string | null
  onChange: (value: string) => void
  onBlur?: () => void
  disabled?: boolean
  max?: string
  placeholder?: string
}
