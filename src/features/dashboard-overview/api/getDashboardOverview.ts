import { createSupabaseServerClient } from "@/shared/api/supabase/server";

import { formatActivityMeta, formatActivitySubtitleDate, initialsOf } from "../model/format-activity-date";
import type {
  IDashboardOverview,
  IInstrumentDemand,
  IRecentActivityItem,
  IRevenuePoint,
  ISolicitudEstadoCount,
  TAccentTone,
} from "../model/dashboard-overview.types";

const SOLICITUD_ESTADO_LABEL: Record<ISolicitudEstadoCount["estado"], string> = {
  nueva: "Nuevas",
  contactada: "Contactadas",
  convertida: "Convertidas",
  descartada: "Descartadas",
};

const SOLICITUD_TIPO_BADGE: Record<string, { label: string; tone: TAccentTone }> = {
  clase_prueba: { label: "Clase de prueba", tone: "violet" },
  admision: { label: "Admisión", tone: "primary" },
  masterclass: { label: "Masterclass", tone: "accent" },
  contacto_general: { label: "Contacto general", tone: "secondary" },
};

const MONTH_LABEL = new Intl.DateTimeFormat("es", { month: "short" });

function monthsAgo(count: number) {
  const date = new Date();
  date.setDate(1);
  date.setMonth(date.getMonth() - count);
  return date;
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function percentChange(current: number, previous: number): number | undefined {
  if (previous === 0) return current > 0 ? 100 : undefined;
  return ((current - previous) / previous) * 100;
}

export async function getDashboardOverview(): Promise<{
  data: IDashboardOverview | null;
  error: string | null;
}> {
  const supabase = await createSupabaseServerClient();
  const now = new Date();
  const startOfMonth = toIsoDate(new Date(now.getFullYear(), now.getMonth(), 1));
  const startOfPrevMonth = toIsoDate(monthsAgo(1));
  const sixMonthsAgo = toIsoDate(monthsAgo(5));
  const today = toIsoDate(now);
  const sevenDaysAgo = toIsoDate(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000));
  const fourteenDaysAgo = toIsoDate(new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000));

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [
    perfilAdmin,
    estudiantesActivos,
    docentesTotal,
    solicitudesPendientes,
    catedrasEnCurso,
    sesionesHoy,
    pagosDelMes,
    pagosMesAnterior,
    cuotasVencidas,
    inscripcionesDelMes,
    inscripcionesMesAnterior,
    pagosSeisMeses,
    estudiantesSeisMeses,
    solicitudesUltimos7,
    solicitudesPrevios7,
    solicitudEstadoNueva,
    solicitudEstadoContactada,
    solicitudEstadoConvertida,
    solicitudEstadoDescartada,
    instrumentosEstudiantes,
    solicitudesRecientes,
    pagosRecientes,
  ] = await Promise.all([
    user ? supabase.from("perfiles").select("nombres").eq("id", user.id).maybeSingle() : Promise.resolve({ data: null, error: null }),
    supabase.from("estudiantes").select("id", { count: "exact", head: true }).eq("activo", true),
    supabase.from("docentes").select("perfil_id", { count: "exact", head: true }),
    supabase.from("solicitudes").select("id", { count: "exact", head: true }).in("estado", ["nueva", "contactada"]),
    supabase.from("catedras").select("id", { count: "exact", head: true }).eq("estado", "en_curso"),
    supabase.from("sesiones").select("id", { count: "exact", head: true }).eq("fecha", today),
    supabase.from("pagos").select("monto").gte("fecha_pago", startOfMonth),
    supabase.from("pagos").select("monto").gte("fecha_pago", startOfPrevMonth).lt("fecha_pago", startOfMonth),
    supabase
      .from("cuotas")
      .select("id", { count: "exact", head: true })
      .in("estado", ["pendiente", "parcial"])
      .lt("fecha_vencimiento", today),
    supabase.from("inscripciones").select("id", { count: "exact", head: true }).gte("fecha_inscripcion", startOfMonth),
    supabase
      .from("inscripciones")
      .select("id", { count: "exact", head: true })
      .gte("fecha_inscripcion", startOfPrevMonth)
      .lt("fecha_inscripcion", startOfMonth),
    supabase.from("pagos").select("monto, fecha_pago").gte("fecha_pago", sixMonthsAgo),
    supabase.from("estudiantes").select("created_at").gte("created_at", sixMonthsAgo),
    supabase.from("solicitudes").select("id", { count: "exact", head: true }).gte("created_at", sevenDaysAgo),
    supabase
      .from("solicitudes")
      .select("id", { count: "exact", head: true })
      .gte("created_at", fourteenDaysAgo)
      .lt("created_at", sevenDaysAgo),
    supabase.from("solicitudes").select("id", { count: "exact", head: true }).eq("estado", "nueva"),
    supabase.from("solicitudes").select("id", { count: "exact", head: true }).eq("estado", "contactada"),
    supabase.from("solicitudes").select("id", { count: "exact", head: true }).eq("estado", "convertida"),
    supabase.from("solicitudes").select("id", { count: "exact", head: true }).eq("estado", "descartada"),
    supabase.from("estudiante_instrumento").select("instrumento_id, instrumentos(nombre)").limit(500),
    supabase
      .from("solicitudes")
      .select("id, nombre_completo, tipo, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("pagos")
      .select("id, monto, fecha_pago, created_at, cuotas(acuerdos_pago(estudiantes(nombres, apellidos)))")
      .order("fecha_pago", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const firstError = [
    perfilAdmin.error,
    estudiantesActivos.error,
    docentesTotal.error,
    solicitudesPendientes.error,
    catedrasEnCurso.error,
    sesionesHoy.error,
    pagosDelMes.error,
    pagosMesAnterior.error,
    cuotasVencidas.error,
    inscripcionesDelMes.error,
    inscripcionesMesAnterior.error,
    pagosSeisMeses.error,
    estudiantesSeisMeses.error,
    solicitudesUltimos7.error,
    solicitudesPrevios7.error,
    solicitudEstadoNueva.error,
    solicitudEstadoContactada.error,
    solicitudEstadoConvertida.error,
    solicitudEstadoDescartada.error,
    instrumentosEstudiantes.error,
    solicitudesRecientes.error,
    pagosRecientes.error,
  ].find(Boolean);

  if (firstError) {
    return { data: null, error: firstError.message };
  }

  const ingresosDelMes = (pagosDelMes.data ?? []).reduce((sum, pago) => sum + Number(pago.monto), 0);
  const ingresosMesAnterior = (pagosMesAnterior.data ?? []).reduce((sum, pago) => sum + Number(pago.monto), 0);

  const revenueByMonth = new Map<string, number>();
  for (let i = 5; i >= 0; i--) {
    revenueByMonth.set(monthKey(monthsAgo(i)), 0);
  }
  for (const pago of pagosSeisMeses.data ?? []) {
    const key = monthKey(new Date(pago.fecha_pago));
    revenueByMonth.set(key, (revenueByMonth.get(key) ?? 0) + Number(pago.monto));
  }
  const revenue: IRevenuePoint[] = Array.from(revenueByMonth.entries()).map(([key, total]) => {
    const [year, month] = key.split("-").map(Number);
    return { month: MONTH_LABEL.format(new Date(year, month - 1, 1)), total };
  });
  const revenueSpark = revenue.map((point) => point.total);

  const estudiantesByMonth = new Map<string, number>();
  for (let i = 5; i >= 0; i--) {
    estudiantesByMonth.set(monthKey(monthsAgo(i)), 0);
  }
  for (const estudiante of estudiantesSeisMeses.data ?? []) {
    const key = monthKey(new Date(estudiante.created_at));
    if (estudiantesByMonth.has(key)) {
      estudiantesByMonth.set(key, (estudiantesByMonth.get(key) ?? 0) + 1);
    }
  }
  let acumulado = Math.max((estudiantesActivos.count ?? 0) - (estudiantesSeisMeses.data?.length ?? 0), 0);
  const estudiantesSpark: number[] = [];
  for (let i = 5; i >= 0; i--) {
    acumulado += estudiantesByMonth.get(monthKey(monthsAgo(i))) ?? 0;
    estudiantesSpark.push(acumulado);
  }

  const estadoCounts: Record<ISolicitudEstadoCount["estado"], number> = {
    nueva: solicitudEstadoNueva.count ?? 0,
    contactada: solicitudEstadoContactada.count ?? 0,
    convertida: solicitudEstadoConvertida.count ?? 0,
    descartada: solicitudEstadoDescartada.count ?? 0,
  };
  const solicitudesPorEstado: ISolicitudEstadoCount[] = (
    Object.keys(SOLICITUD_ESTADO_LABEL) as ISolicitudEstadoCount["estado"][]
  ).map((estado) => ({
    estado,
    label: SOLICITUD_ESTADO_LABEL[estado],
    total: estadoCounts[estado],
  }));

  const instrumentCounts = new Map<string, number>();
  for (const registro of instrumentosEstudiantes.data ?? []) {
    const nombre = registro.instrumentos?.nombre ?? "Sin instrumento";
    instrumentCounts.set(nombre, (instrumentCounts.get(nombre) ?? 0) + 1);
  }
  const instrumentosDemandados: IInstrumentDemand[] = Array.from(instrumentCounts.entries())
    .map(([instrumento, total]) => ({ instrumento, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const solicitudesRecientesItems: IRecentActivityItem[] = (solicitudesRecientes.data ?? []).map((solicitud) => {
    const nombre = solicitud.nombre_completo ?? "Sin nombre";
    const fecha = new Date(solicitud.created_at);
    const badge = SOLICITUD_TIPO_BADGE[solicitud.tipo] ?? {
      label: solicitud.tipo.replaceAll("_", " "),
      tone: "secondary" as TAccentTone,
    };
    return {
      id: solicitud.id,
      title: nombre,
      subtitle: formatActivitySubtitleDate(fecha),
      meta: formatActivityMeta(fecha),
      href: "/dashboard/admin/solicitudes",
      initials: initialsOf(nombre),
      badge,
    };
  });

  const pagosRecientesItems: IRecentActivityItem[] = (pagosRecientes.data ?? []).map((pago) => {
    const estudiante = pago.cuotas?.acuerdos_pago?.estudiantes;
    const nombre = estudiante ? `${estudiante.nombres} ${estudiante.apellidos}` : "Estudiante";
    return {
      id: pago.id,
      title: nombre,
      subtitle: `$${Number(pago.monto).toFixed(2)}`,
      meta: formatActivityMeta(new Date(pago.fecha_pago)),
      href: "/dashboard/admin/pagos",
      initials: initialsOf(nombre),
      badge: { label: "Pago", tone: "primary" },
    };
  });

  const solicitudesPendientesCount = solicitudesPendientes.count ?? 0;

  return {
    data: {
      adminName: perfilAdmin.data?.nombres ?? "administrador",
      solicitudesPendientes: solicitudesPendientesCount,
      kpis: [
        {
          label: "Estudiantes activos",
          value: estudiantesActivos.count ?? 0,
          format: "number",
          icon: "ph:students",
          href: "/dashboard/admin/estudiantes",
          tone: "violet",
          spark: estudiantesSpark,
        },
        {
          label: "Docentes",
          value: docentesTotal.count ?? 0,
          format: "number",
          icon: "ph:chalkboard-teacher",
          href: "/dashboard/admin/docentes",
          tone: "primary",
        },
        {
          label: "Solicitudes pendientes",
          value: solicitudesPendientesCount,
          format: "number",
          icon: "ph:tray",
          href: "/dashboard/admin/solicitudes",
          tone: "secondary",
          trend: percentChange(solicitudesUltimos7.count ?? 0, solicitudesPrevios7.count ?? 0),
          trendLabel: "últimos 7 días",
        },
        {
          label: "Ingresos del mes",
          value: ingresosDelMes,
          format: "currency",
          icon: "ph:currency-circle-dollar",
          href: "/dashboard/admin/pagos",
          tone: "accent",
          trend: percentChange(ingresosDelMes, ingresosMesAnterior),
          trendLabel: "vs mes anterior",
          spark: revenueSpark,
        },
        {
          label: "Cátedras en curso",
          value: catedrasEnCurso.count ?? 0,
          format: "number",
          icon: "ph:chalkboard",
          href: "/dashboard/admin/catedras",
          tone: "primary",
        },
        {
          label: "Cuotas vencidas",
          value: cuotasVencidas.count ?? 0,
          format: "number",
          icon: "ph:warning-circle",
          href: "/dashboard/admin/cuotas",
          tone: "destructive",
          pill: cuotasVencidas.count ? "Requieren atención" : undefined,
        },
        {
          label: "Sesiones de hoy",
          value: sesionesHoy.count ?? 0,
          format: "number",
          icon: "ph:calendar-check",
          href: "/dashboard/admin/horarios",
          tone: "violet",
        },
        {
          label: "Inscripciones del mes",
          value: inscripcionesDelMes.count ?? 0,
          format: "number",
          icon: "ph:user-plus",
          href: "/dashboard/admin/catedras",
          tone: "secondary",
          trend: percentChange(inscripcionesDelMes.count ?? 0, inscripcionesMesAnterior.count ?? 0),
          trendLabel: "vs mes anterior",
        },
      ],
      revenue,
      solicitudesPorEstado,
      instrumentosDemandados,
      solicitudesRecientes: solicitudesRecientesItems,
      pagosRecientes: pagosRecientesItems,
    },
    error: null,
  };
}
