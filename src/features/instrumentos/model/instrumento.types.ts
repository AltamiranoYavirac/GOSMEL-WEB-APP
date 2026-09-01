export interface ITipoInstrumentoRow {
  id: string;
  nombre: string;
  orden: number;
  activo: boolean;
}

export interface IInstrumentoRow {
  id: string;
  nombre: string;
  slug: string;
  tipoInstrumentoId: string;
  tipo: string;
  icono: string | null;
  imagenPublicId: string | null;
  orden: number;
  activo: boolean;
}
