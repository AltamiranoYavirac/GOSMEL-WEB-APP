export interface IImageUploadFieldProps {
  value?: string | null;
  file?: File | null;
  onFileChange: (file: File | null) => void;
  onRemove: () => void;
  label?: string;
  helperText?: string;
  disabled?: boolean;
}
