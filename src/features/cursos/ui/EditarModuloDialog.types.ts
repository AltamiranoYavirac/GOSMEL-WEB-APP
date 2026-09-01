export interface IEditarModuloDialogProps {
  cursoId: string;
  modulo: {
    id: string;
    titulo: string;
    descripcion: string | null;
    orden?: number;
  };
}
