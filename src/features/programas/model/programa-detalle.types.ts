import type { TNivelCurso } from "./programa.types";

export type { TNivelCurso };

export interface IProgramaCursoItem {
  cursoId: string;
  nombre: string;
  nivel: string;
  modalidad: string;
  orden: number;
}

export interface IProgramaDetalle {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  objetivos: string | null;
  instrumentoId: string | null;
  instrumento: string | null;
  nivel: TNivelCurso | null;
  publicado: boolean;
  orden: number;
  cursos: IProgramaCursoItem[];
}
