export interface IMetricaRow {
  id: string;
  etiqueta: string;
  valor: string;
  sufijo: string | null;
  icono: string | null;
  orden: number;
  publicado: boolean;
}

export interface IPublicMetrica {
  id: string;
  etiqueta: string;
  valor: string;
  sufijo: string | null;
  icono: string | null;
}