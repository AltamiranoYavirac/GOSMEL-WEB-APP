export interface IResenaRow {
  id: string;
  cursoId: string;
  curso: string;
  estudianteId: string;
  estudiante: string;
  puntuacion: number;
  comentario: string | null;
  publicado: boolean;
  createdAt: string;
}
