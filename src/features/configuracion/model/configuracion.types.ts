import type { Json } from "@/shared/api/supabase/database.types";

export interface IConfiguracionSitio {
  ciudad: string | null;
  direccion: string | null;
  telefono: string | null;
  whatsapp: string | null;
  emailGeneral: string | null;
  emailAdmisiones: string | null;
  horarioAtencion: string | null;
  mapaEmbed: string | null;
  redesSociales: Json;
  actualizado: string;
}