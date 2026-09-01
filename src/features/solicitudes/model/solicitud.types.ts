import type { Database } from "@/shared/api/supabase/database.types";

export type TSolicitudTipo = Database["public"]["Enums"]["tipo_solicitud"];
export type TSolicitudEstado = Database["public"]["Enums"]["estado_solicitud"];
export type TParentesco = Database["public"]["Enums"]["parentesco"];

export interface ISolicitudRow {
  id: string;
  fecha: string;
  nombre: string;
  email: string;
  telefono: string | null;
  tipo: TSolicitudTipo;
  estado: TSolicitudEstado;
  interes: string | null;
  estudianteNombre: string | null;
  estudianteFechaNacimiento: string | null;
  paraMenor: boolean;
  parentesco: TParentesco | null;
}