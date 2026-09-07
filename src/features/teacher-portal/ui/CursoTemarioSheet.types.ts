export interface ICursoTemarioSheetProps {
  cursoId: string;
  cursoNombre: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
