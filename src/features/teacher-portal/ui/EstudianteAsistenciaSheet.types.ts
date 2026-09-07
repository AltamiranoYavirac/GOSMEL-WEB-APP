export interface IEstudianteAsistenciaSheetProps {
  inscripcionId: string;
  estudianteNombre: string;
  cursoNombre: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
