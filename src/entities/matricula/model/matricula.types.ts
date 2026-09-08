export interface IInscripcionPendiente {
  id: string;
  fechaInscripcion: string;
  fechaInicio: string;
  estudiante: string;
  catedraCodigo: string | null;
  cursoNombre: string | null;
  desdeSolicitud: boolean;
}
