export interface ICrearEstudianteDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultRepresentanteId?: string;
  onSuccess?: (id: string) => void;
}
