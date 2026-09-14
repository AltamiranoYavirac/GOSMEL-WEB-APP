export interface IDatePickerProps {
  value: string | null
  onChange: (value: string) => void
  onBlur?: () => void
  disabled?: boolean
  min?: string
  max?: string
  placeholder?: string
}
