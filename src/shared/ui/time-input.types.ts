export interface ITimeInputProps {
  value?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  disabled?: boolean
  id?: string
  className?: string
  size?: "default" | "lg"
  placeholder?: string
  "aria-label"?: string
  "aria-invalid"?: boolean | "true" | "false"
}
