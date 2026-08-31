import type { Database } from "@/shared/api/supabase/database.types";

export type TNivelCurso = Database["public"]["Enums"]["nivel_curso"];

export interface IEstudianteRow {
  id: string;
  perfilId: string | null;
  nombres: string;
  apellidos: string;
  nombreCompleto: string;
  email: string | null;
  cedula: string | null;
  celular: string | null;
  edad: number | null;
  fechaNacimiento: string | null;
  nivel: TNivelCurso | null;
  instrumentos: string[];
  representante: string | null;
  activo: boolean;
}