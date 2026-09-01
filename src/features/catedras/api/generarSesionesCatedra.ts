import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

export interface IGenerarSesionesInput {
  catedraId: string;
  fechaDesde: string;
  fechaHasta: string;
}

export async function generarSesionesCatedra(input: IGenerarSesionesInput): Promise<{
  data: number | null;
  error: string | null;
}> {
  const supabase = createSupabaseBrowserClient();

  const { data: rpcData, error: rpcError } = await supabase.rpc("generar_sesiones_catedra" as any, {
    p_catedra_id: input.catedraId,
    p_fecha_desde: input.fechaDesde,
    p_fecha_hasta: input.fechaHasta,
  });

  if (!rpcError && rpcData !== null && rpcData !== undefined) {
    return { data: Number(rpcData) || 0, error: null };
  }

  if (rpcError && !rpcError.message.includes("Could not find the function")) {
    return { data: null, error: rpcError.message };
  }

  const { data: horarios, error: horError } = await supabase
    .from("catedra_horarios")
    .select("dia_semana, hora_inicio, hora_fin")
    .eq("catedra_id", input.catedraId);

  if (horError) {
    return { data: null, error: horError.message };
  }

  if (!horarios || horarios.length === 0) {
    return { data: 0, error: null };
  }

  const { data: existingSesiones } = await supabase
    .from("sesiones")
    .select("fecha, hora_inicio")
    .eq("catedra_id", input.catedraId)
    .gte("fecha", input.fechaDesde)
    .lte("fecha", input.fechaHasta);

  const existingSet = new Set(
    (existingSesiones ?? []).map((s) => `${s.fecha}_${s.hora_inicio}`)
  );

  const start = new Date(`${input.fechaDesde}T00:00:00`);
  const end = new Date(`${input.fechaHasta}T00:00:00`);
  const toInsert: Array<{
    catedra_id: string;
    fecha: string;
    hora_inicio: string;
    hora_fin: string;
    estado: "programada";
  }> = [];

  const current = new Date(start);
  while (current <= end) {
    let dayOfWeek = current.getDay();
    if (dayOfWeek === 0) dayOfWeek = 7;

    const dateStr = current.toISOString().slice(0, 10);

    for (const h of horarios) {
      if (h.dia_semana === dayOfWeek) {
        const key = `${dateStr}_${h.hora_inicio}`;
        if (!existingSet.has(key)) {
          toInsert.push({
            catedra_id: input.catedraId,
            fecha: dateStr,
            hora_inicio: h.hora_inicio,
            hora_fin: h.hora_fin,
            estado: "programada",
          });
          existingSet.add(key);
        }
      }
    }

    current.setDate(current.getDate() + 1);
  }

  if (toInsert.length > 0) {
    const { error: insError } = await supabase.from("sesiones").insert(toInsert);
    if (insError) {
      return { data: null, error: insError.message };
    }
  }

  return { data: toInsert.length, error: null };
}
