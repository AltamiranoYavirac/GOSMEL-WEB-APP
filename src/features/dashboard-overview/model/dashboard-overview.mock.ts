import type { IDashboardOverview } from "./dashboard-overview.types";

const MONTH_LABEL = new Intl.DateTimeFormat("es", { month: "short" });

function lastSixMonthLabels(): string[] {
  const labels: string[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(MONTH_LABEL.format(date));
  }
  return labels;
}

export function getMockDashboardOverview(): { data: IDashboardOverview; error: null } {
  const months = lastSixMonthLabels();

  return {
    data: {
      adminName: "Mauricio",
      solicitudesPendientes: 9,
      kpis: [
        {
          label: "Estudiantes activos",
          value: 128,
          format: "number",
          icon: "ph:students",
          href: "/dashboard/admin/estudiantes",
          trend: 4.2,
          trendLabel: "vs mes anterior",
          spark: [104, 110, 106, 118, 122, 128],
          tone: "violet",
        },
        {
          label: "Docentes",
          value: 14,
          format: "number",
          icon: "ph:chalkboard-teacher",
          href: "/dashboard/admin/docentes",
          trend: 2,
          trendLabel: "vs mes anterior",
          spark: [10, 11, 11, 12, 13, 14],
          tone: "primary",
        },
        {
          label: "Solicitudes pendientes",
          value: 9,
          format: "number",
          icon: "ph:tray",
          href: "/dashboard/admin/solicitudes",
          trend: -2.5,
          trendLabel: "vs semana anterior",
          spark: [12, 10, 14, 11, 8, 9],
          tone: "secondary",
          pill: "3 hoy",
        },
        {
          label: "Ingresos del mes",
          value: 4820.5,
          format: "currency",
          icon: "ph:currency-circle-dollar",
          href: "/dashboard/admin/pagos",
          trend: 8.2,
          trendLabel: "vs mes anterior",
          spark: [3980, 4120, 4300, 4450, 4610, 4820],
          tone: "accent",
        },
        { label: "Cátedras en curso", value: 22, format: "number", icon: "ph:chalkboard", href: "/dashboard/admin/catedras", tone: "primary" },
        {
          label: "Cuotas vencidas",
          value: 6,
          format: "number",
          icon: "ph:warning-circle",
          href: "/dashboard/admin/cuotas",
          tone: "destructive",
          pill: "Requieren atención",
        },
        { label: "Sesiones de hoy", value: 5, format: "number", icon: "ph:calendar-check", href: "/dashboard/admin/horarios", tone: "violet" },
        {
          label: "Inscripciones del mes",
          value: 15,
          format: "number",
          icon: "ph:user-plus",
          href: "/dashboard/admin/catedras",
          tone: "secondary",
          trend: 12.5,
          trendLabel: "vs mes anterior",
        },
      ],
      revenue: [
        { month: months[0], total: 2980 },
        { month: months[1], total: 3450 },
        { month: months[2], total: 3120 },
        { month: months[3], total: 3990 },
        { month: months[4], total: 4310 },
        { month: months[5], total: 4820.5 },
      ],
      solicitudesPorEstado: [
        { estado: "nueva", label: "Nuevas", total: 9 },
        { estado: "contactada", label: "Contactadas", total: 5 },
        { estado: "convertida", label: "Convertidas", total: 18 },
        { estado: "descartada", label: "Descartadas", total: 3 },
      ],
      instrumentosDemandados: [
        { instrumento: "Piano", total: 34 },
        { instrumento: "Guitarra", total: 29 },
        { instrumento: "Violín", total: 21 },
        { instrumento: "Canto", total: 17 },
        { instrumento: "Batería", total: 12 },
      ],
      solicitudesRecientes: [
        {
          id: "1",
          title: "María Fernanda Torres",
          subtitle: "Piano · Nivel intermedio",
          meta: "hoy",
          href: "/dashboard/admin/solicitudes",
          initials: "MT",
          badge: { label: "Clase de prueba", tone: "violet" },
        },
        {
          id: "2",
          title: "Carlos Andrés Pérez",
          subtitle: "Guitarra · Principiante",
          meta: "ayer",
          href: "/dashboard/admin/solicitudes",
          initials: "CP",
          badge: { label: "Admisión", tone: "primary" },
        },
        {
          id: "3",
          title: "Lucía Ramírez",
          subtitle: "Canto · Nivel avanzado",
          meta: "hace 2 días",
          href: "/dashboard/admin/solicitudes",
          initials: "LR",
          badge: { label: "Masterclass", tone: "accent" },
        },
        {
          id: "4",
          title: "Jorge Salazar",
          subtitle: "Violín · Sin nivel definido",
          meta: "hace 3 días",
          href: "/dashboard/admin/solicitudes",
          initials: "JS",
          badge: { label: "Contacto general", tone: "secondary" },
        },
        {
          id: "5",
          title: "Ana Belén Ruiz",
          subtitle: "Batería · Principiante",
          meta: "hace 4 días",
          href: "/dashboard/admin/solicitudes",
          initials: "AR",
          badge: { label: "Clase de prueba", tone: "violet" },
        },
      ],
      pagosRecientes: [
        {
          id: "1",
          title: "Sofía Guerrero",
          subtitle: "$85.00 · Cuota marzo",
          meta: "hoy",
          href: "/dashboard/admin/pagos",
          initials: "SG",
          badge: { label: "Completado", tone: "primary" },
        },
        {
          id: "2",
          title: "Mateo Andrade",
          subtitle: "$120.00 · Cuota marzo",
          meta: "ayer",
          href: "/dashboard/admin/pagos",
          initials: "MA",
          badge: { label: "Completado", tone: "primary" },
        },
        {
          id: "3",
          title: "Valentina Cruz",
          subtitle: "$60.00 · Matrícula",
          meta: "hace 2 días",
          href: "/dashboard/admin/pagos",
          initials: "VC",
          badge: { label: "Completado", tone: "primary" },
        },
        {
          id: "4",
          title: "Diego Herrera",
          subtitle: "$95.00 · Cuota febrero",
          meta: "hace 3 días",
          href: "/dashboard/admin/pagos",
          initials: "DH",
          badge: { label: "Pendiente", tone: "destructive" },
        },
        {
          id: "5",
          title: "Camila Ortiz",
          subtitle: "$75.50 · Matrícula",
          meta: "hace 5 días",
          href: "/dashboard/admin/pagos",
          initials: "CO",
          badge: { label: "Completado", tone: "primary" },
        },
      ],
    },
    error: null,
  };
}
