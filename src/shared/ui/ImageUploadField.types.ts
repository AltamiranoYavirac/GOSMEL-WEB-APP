export interface IImageUploadFieldProps {
  value?: string | null;
  onChange: (value: string) => void;
  label?: string;
  folder?: string;
  helperText?: string;
  endpoint?: string;
  compress?: boolean;
}
