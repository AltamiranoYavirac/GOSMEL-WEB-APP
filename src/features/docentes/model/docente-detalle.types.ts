import type { Database } from "@/shared/api/supabase/database.types";
import type { TBadgeVariant } from "@/shared/ui";

export type TModalidadCurso = Database["public"]["Enums"]["modalidad_curso"];
export type TEstadoCatedra = Database["public"]["Enums"]["estado_catedra"];
export type TTipoPortafolio = Database["public"]["Enums"]["tipo_portafolio"];

export interface IDocenteFormacion {
  id: string;
  institucion: string;
  titulo: string;
  anioInicio: number | null;
  anioFin: number | null;
  descripcion: string | null;
}

export interface IDocenteReconocimiento {
  id: string;
  titulo: string;
  anio: number | null;
  entidadOtorgante: string | null;
  descripcion: string | null;
}

export interface IDocentePortafolio {
  id: string;
  tipo: TTipoPortafolio;
  titulo: string | null;
  urlExterna: string | null;
}

export interface IDocenteCatedra {
  id: string;
  codigo: string;
  curso: string;
  modalidad: TModalidadCurso;
  estado: TEstadoCatedra;
}

export interface IDocenteDetalle {
  id: string;
  nombre: string;
  email: string | null;
  titulo: string | null;
  biografia: string | null;
  aniosExperiencia: number | null;
  destacado: boolean;
  publicado: boolean;
  instrumentos: string[];
  formacion: IDocenteFormacion[];
  reconocimientos: IDocenteReconocimiento[];
  portafolio: IDocentePortafolio[];
  catedras: IDocenteCatedra[];
}

export const MODALIDAD_BADGE: Record<TModalidadCurso, { label: string; variant: TBadgeVariant }> = {
  presencial: { label: "Presencial", variant: "default" },
  virtual: { label: "Virtual", variant: "secondary" },
  hibrido: { label: "Híbrido", variant: "outline" },
};

export const CATEDRA_ESTADO_BADGE: Record<TEstadoCatedra, { label: string; variant: TBadgeVariant }> = {
  planificada: { label: "Planificada", variant: "outline" },
  en_curso: { label: "En curso", variant: "default" },
  finalizada: { label: "Finalizada", variant: "ghost" },
  cancelada: { label: "Cancelada", variant: "destructive" },
};

export const PORTAFOLIO_TIPO_LABEL: Record<TTipoPortafolio, string> = {
  imagen: "Imagen",
  video: "Video",
  audio: "Audio",
};