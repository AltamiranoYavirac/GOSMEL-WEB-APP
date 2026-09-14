import type { Database } from "@/shared/api/supabase/database.types";

export type TEstadoCatedra = Database["public"]["Enums"]["estado_catedra"];
export type TModalidadCurso = Database["public"]["Enums"]["modalidad_curso"];

export interface ICatedraRow {
  id: string;
  codigo: string;
  curso: string;
  cursoId: string;
  docente: string | null;
  docenteId: string;
  modalidad: TModalidadCurso;
  aula: string | null;
  cupoMaximo: number;
  fechaInicio: string;
  fechaFin: string | null;
  numHorarios: number;
  activos: number;
  pendientes: number;
  estado: TEstadoCatedra;
}