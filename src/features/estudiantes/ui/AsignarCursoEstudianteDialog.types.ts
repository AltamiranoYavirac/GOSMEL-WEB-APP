export interface IAsignarCursoEstudianteDialogProps {
  estudianteId?: string;
  estudianteNombre?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}
