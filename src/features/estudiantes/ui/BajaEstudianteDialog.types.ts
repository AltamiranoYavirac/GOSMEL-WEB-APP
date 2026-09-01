export interface IBajaEstudianteDialogProps {
  inscripcionId: string;
  estudianteNombre: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}
