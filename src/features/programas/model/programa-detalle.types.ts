import type { TNivelCurso } from "./programa.types";

export type { TNivelCurso };

export interface IProgramaCursoItem {
  cursoId: string;
  nombre: string;
  nivel: string;
  modalidad: string;
  orden: number;
}

export interface IProgramaObjetivoItem {
  id: string;
  objetivo: string;
  orden: number;
}

export interface IProgramaDetalle {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  objetivos: IProgramaObjetivoItem[];
  nivel: TNivelCurso | null;
  imagenPublicId: string | null;
  imagenTextoAlt: string | null;
  precioReferencial: string | null;
  etiquetaPrecio: string | null;
  mostrarPrecio: boolean;
  publicado: boolean;
  orden: number;
  cursos: IProgramaCursoItem[];
}
