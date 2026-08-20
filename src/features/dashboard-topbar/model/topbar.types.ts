export interface ITopbarCounts {
  solicitudesPendientes: number;
  cuotasVencidas: number;
  sesionesHoy: number;
  inscripcionesPendientes: number;
  totalPendientes: number;
}

export interface ITopbarActivity {
  id: string;
  tipo: string;
  titulo: string;
  descripcion: string | null;
  created_at: string;
}

export interface ITopbarSummary {
  counts: ITopbarCounts;
  activities: ITopbarActivity[];
}

export type TSearchGroup = "estudiantes" | "docentes" | "cursos";

export interface ISearchResultItem {
  id: string;
  label: string;
  subtitle: string;
  href: string;
}

export type ISearchResults = Record<TSearchGroup, ISearchResultItem[]>;
