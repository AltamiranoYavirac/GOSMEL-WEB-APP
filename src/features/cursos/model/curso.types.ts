import type { Database } from "@/shared/api/supabase/database.types";
import type { TBadgeVariant } from "@/shared/ui";

export type TNivelCurso = Database["public"]["Enums"]["nivel_curso"];
export type TModalidadCurso = Database["public"]["Enums"]["modalidad_curso"];
export type TCategoriaCurso = Database["public"]["Enums"]["categoria_curso"];

export interface ICursoRow {
  id: string;
  nombre: string;
  nivel: TNivelCurso;
  modalidad: TModalidadCurso;
  instrumento: string | null;
  rating: number;
  totalResenas: number;
  modulos: number;
  publicado: boolean;
}

export interface ICursoDetalle {
  id: string;
  nombre: string;
  resumen: string;
  descripcion: string;
  instrumentoId: string;
  categoria: TCategoriaCurso;
  nivel: TNivelCurso;
  modalidad: TModalidadCurso;
  duracionSemanas: string;
  horasTotales: string;
  precioReferencial: string;
  etiquetaPrecio: string;
  mostrarPrecio: boolean;
  portadaPublicId: string;
  portadaTextoAlt: string;
  publicoEdad: string;
  publicoNivel: string;
  formatoClase: string;
  horarioResumen: string;
  cierreEtapa: string;
  ctaTitulo: string;
  ctaDescripcion: string;
  ctaPrimarioTexto: string;
  ctaSecundarioTexto: string;
  publicado: boolean;
  orden: number;
}

export const NIVEL_BADGE: Record<TNivelCurso, { label: string; variant: TBadgeVariant }> = {
  iniciacion: { label: "Iniciación", variant: "secondary" },
  basico: { label: "Básico", variant: "outline" },
  intermedio: { label: "Intermedio", variant: "default" },
  avanzado: { label: "Avanzado", variant: "default" },
  maestria: { label: "Maestría", variant: "ghost" },
};

export const MODALIDAD_BADGE: Record<TModalidadCurso, { label: string; variant: TBadgeVariant }> = {
  presencial: { label: "Presencial", variant: "default" },
  virtual: { label: "Virtual", variant: "secondary" },
  hibrido: { label: "Híbrido", variant: "outline" },
};
