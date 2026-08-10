export interface IFileUploadProps {
  value?: File | null
  onChange: (file: File | null) => void
  accept?: string
  maxSize?: number
  label?: string
  hint?: string
  disabled?: boolean
  error?: string
  icon?: React.ReactNode
}
