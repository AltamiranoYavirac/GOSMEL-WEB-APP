export interface ICatedraEstudianteItem {
  inscripcionId: string;
  estudianteId: string;
  estudianteNombre: string;
  cedula: string | null;
  email: string | null;
  celular: string | null;
  fechaInscripcion: string;
  estado: string;
  montoMensual: number | null;
  diaCobro: number | null;
  acuerdoEstado: string | null;
}

export interface ICatedraSolicitudItem {
  inscripcionId: string;
  estudianteId: string;
  estudianteNombre: string;
  solicitadaPor: string | null;
  fechaInscripcion: string;
  precioReferencial: number | null;
}

export interface ICatedraDetalleEstudiantes {
  catedraId: string;
  codigo: string;
  curso: string;
  precioReferencial: number | null;
  matriculados: ICatedraEstudianteItem[];
  pendientes: ICatedraSolicitudItem[];
}
