export interface IEditarLeccionDialogProps {
  cursoId: string;
  leccion: {
    id: string;
    titulo: string;
    descripcion: string | null;
    duracionMinutos?: number | null;
    esMuestra?: boolean;
    orden?: number;
  };
}
