export interface IMetricaRow {
  id: string;
  etiqueta: string;
  valor: string;
  sufijo: string | null;
  icono: string | null;
  orden: number;
  publicado: boolean;
}