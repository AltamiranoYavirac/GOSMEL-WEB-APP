import type { Database } from "@/shared/api/supabase/database.types";

export type TSolicitudTipo = Database["public"]["Enums"]["tipo_solicitud"];
export type TSolicitudEstado = Database["public"]["Enums"]["estado_solicitud"];

export interface ISolicitudRow {
  id: string;
  fecha: string;
  nombre: string;
  email: string;
  telefono: string | null;
  tipo: TSolicitudTipo;
  estado: TSolicitudEstado;
  mensaje: string | null;
  origenUrl: string | null;
  interes: string | null;
  creadaPor: string | null;
  consentimientoDatos: boolean;
  consentimientoEn: string;
  consentimientoOtorgadoPor: string;
  notasInternas: string | null;
  responsableNombre: string | null;
  responsableAvatarPublicId: string | null;
}
