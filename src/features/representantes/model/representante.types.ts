export interface IRepresentanteRow {
  id: string;
  nombres: string | null;
  apellidos: string | null;
  nombre: string;
  cedula: string | null;
  celular: string | null;
  email: string | null;
  direccion: string | null;
  ocupacion: string | null;
  perfil_id: string | null;
  hijos: number;
}

export interface IRepresentadoEstudiante {
  id: string;
  nombre: string;
  cedula: string | null;
  fecha_nacimiento: string;
  edad: number;
  parentesco: string;
  es_contacto_principal: boolean;
  autoriza_retiro: boolean;
  catedra_nombre?: string | null;
  saldo_pendiente?: number;
}

export interface IRepresentanteDetalle extends IRepresentanteRow {
  representados: IRepresentadoEstudiante[];
  total_saldo_familiar: number;
}

export interface ICreateRepresentanteInput {
  nombres: string;
  apellidos: string;
  celular: string;
  email?: string;
  cedula?: string;
  direccion?: string;
  ocupacion?: string;
}

export interface IUpdateRepresentanteInput {
  id: string;
  nombres: string;
  apellidos: string;
  celular: string;
  email?: string;
  cedula?: string;
  direccion?: string;
  ocupacion?: string;
}