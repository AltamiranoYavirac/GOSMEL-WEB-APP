import { createSupabaseBrowserClient } from "@/shared/api/supabase/client";

import type { ITopbarSummary } from "../model/topbar.types";

interface IGetTopbarSummaryResult {
  data: ITopbarSummary | null;
  error: string | null;
}

export async function getTopbarSummary(): Promise<IGetTopbarSummaryResult> {
  const supabase = createSupabaseBrowserClient();
  const today = new Date().toISOString().slice(0, 10);

  const [solicitudes, cuotas, sesiones, inscripciones, actividades] = await Promise.all([
    supabase
      .from("solicitudes")
      .select("id", { count: "exact", head: true })
      .in("estado", ["nueva", "contactada"]),
    supabase
      .from("cuotas")
      .select("id", { count: "exact", head: true })
      .in("estado", ["pendiente", "parcial"])
      .lt("fecha_vencimiento", today),
    supabase
      .from("sesiones")
      .select("id", { count: "exact", head: true })
      .eq("fecha", today)
      .eq("estado", "programada"),
    supabase.from("inscripciones").select("id", { count: "exact", head: true }).eq("estado", "pendiente"),
    supabase
      .from("actividades")
      .select("id, tipo, titulo, descripcion, created_at")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const firstError = [solicitudes, cuotas, sesiones, inscripciones, actividades]
    .map((result) => result.error)
    .find(Boolean);

  if (firstError) {
    return { data: null, error: firstError.message };
  }

  const solicitudesPendientes = solicitudes.count ?? 0;
  const cuotasVencidas = cuotas.count ?? 0;
  const sesionesHoy = sesiones.count ?? 0;
  const inscripcionesPendientes = inscripciones.count ?? 0;

  return {
    data: {
      counts: {
        solicitudesPendientes,
        cuotasVencidas,
        sesionesHoy,
        inscripcionesPendientes,
        totalPendientes: solicitudesPendientes + cuotasVencidas + inscripcionesPendientes,
      },
      activities: actividades.data ?? [],
    },
    error: null,
  };
}
