export type TAccentTone = "primary" | "secondary" | "accent" | "violet" | "destructive";

export interface IDashboardKpi {
  label: string;
  value: number;
  format: "number" | "currency";
  icon: string;
  href: string;
  trend?: number;
  trendLabel?: string;
  spark?: number[];
  tone?: TAccentTone;
  pill?: string;
}

export interface IRevenuePoint {
  month: string;
  total: number;
}

export interface ISolicitudEstadoCount {
  estado: "nueva" | "contactada" | "convertida" | "descartada";
  label: string;
  total: number;
}

export interface IInstrumentDemand {
  instrumento: string;
  total: number;
}

export interface IActivityBadge {
  label: string;
  tone: TAccentTone;
}

export interface IRecentActivityItem {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  href: string;
  initials: string;
  badge?: IActivityBadge;
}

export interface IDashboardOverview {
  adminName: string;
  solicitudesPendientes: number;
  kpis: IDashboardKpi[];
  revenue: IRevenuePoint[];
  solicitudesPorEstado: ISolicitudEstadoCount[];
  instrumentosDemandados: IInstrumentDemand[];
  solicitudesRecientes: IRecentActivityItem[];
  pagosRecientes: IRecentActivityItem[];
}
