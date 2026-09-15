import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export interface IVincularRepresentanteInput {
  estudianteId: string;
  representanteId: string;
  parentesco: "madre" | "padre" | "abuelo" | "tio" | "hermano" | "tutor_legal" | "otro";
  esContactoPrincipal: boolean;
  autorizaRetiro: boolean;
}

export async function vincularRepresentante(input: IVincularRepresentanteInput): Promise<{ error: string | null }> {
  const { error } = await createSupabaseBrowserClient().rpc("vincular_representante_estudiante", {
    p_estudiante_id: input.estudianteId,
    p_representante_id: input.representanteId,
    p_parentesco: input.parentesco,
    p_contacto_principal: input.esContactoPrincipal,
    p_autoriza_retiro: input.autorizaRetiro,
  });
  return { error: error?.message ?? null };
}
