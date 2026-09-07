import type { Database } from "@/shared/api/supabase/database.types";
import type { TBadgeVariant } from "@/shared/ui";

export type TNivelCurso = Database["public"]["Enums"]["nivel_curso"];
export type TEstadoInscripcion = Database["public"]["Enums"]["estado_inscripcion"];
export type TEstadoCuota = Database["public"]["Enums"]["estado_cuota"];
export type TEstadoSesion = Database["public"]["Enums"]["estado_sesion"];
export type TEstadoAsistencia = Database["public"]["Enums"]["estado_asistencia"];
export type TTipoEvaluacion = Database["public"]["Enums"]["tipo_evaluacion"];
export type TTipoMaterial = Database["public"]["Enums"]["tipo_material"];
export type TModalidadCurso = Database["public"]["Enums"]["modalidad_curso"];
export type TEstadoCatedra = Database["public"]["Enums"]["estado_catedra"];
export type TEstadoAcuerdo = Database["public"]["Enums"]["estado_acuerdo"];

export interface IStudentContextEstudiante {
  id: string;
  nombre: string;
  avatarPublicId: string | null;
  nivelMusical: TNivelCurso | null;
  esMenor: boolean;
  tieneCuenta: boolean;
  instrumentos: string[];
}

export interface IStudentContext {
  nombreUsuario: string;
  estudiantes: IStudentContextEstudiante[];
  roles: string[];
}

export interface IStudentProximaClase {
  sesionId: string;
  fecha: string;
  horaInicio: string | null;
  horaFin: string | null;
  tema: string | null;
  catedra: string;
  curso: string;
  docente: string | null;
  aula: string | null;
  modalidad: TModalidadCurso;
}

export type TEstadoPagosEstudiante = "al_dia" | "por_vencer" | "cuota_vencida";

export interface IStudentActividad {
  id: string;
  tipo: string;
  titulo: string;
  descripcion: string | null;
  creadaEn: string;
}

export interface IStudentOverview {
  proximaClase: IStudentProximaClase | null;
  promedioSobre10: number | null;
  evaluacionesRendidas: number;
  practicaSemanalMinutos: number;
  estadoPagos: TEstadoPagosEstudiante;
  saldoPendiente: number;
  cuotasVencidas: number;
  actividades: IStudentActividad[];
}

export interface IStudentHorario {
  dia: number;
  inicio: string;
  fin: string;
}

export interface IStudentCatedra {
  inscripcionId: string;
  catedraId: string;
  cursoId: string;
  codigo: string;
  curso: string;
  nivel: TNivelCurso | null;
  modalidad: TModalidadCurso;
  aula: string | null;
  docente: string | null;
  estado: TEstadoInscripcion;
  progresoPct: number;
  horarios: IStudentHorario[];
}

export interface IStudentSesion {
  id: string;
  fecha: string;
  horaInicio: string | null;
  horaFin: string | null;
  tema: string | null;
  estado: TEstadoSesion;
  catedra: string;
  curso: string;
}

export interface IStudentSessions {
  proximas: IStudentSesion[];
  pasadas: IStudentSesion[];
}

export interface IStudentLeccion {
  id: string;
  titulo: string;
  duracionMinutos: number | null;
  completada: boolean;
}

export interface IStudentModulo {
  id: string;
  titulo: string;
  descripcion: string | null;
  lecciones: IStudentLeccion[];
}

export interface IStudentCursoPlan {
  cursoId: string;
  curso: string;
  catedra: string;
  progresoPct: number;
  modulos: IStudentModulo[];
}

export interface IStudentCalificacion {
  id: string;
  titulo: string;
  tipo: TTipoEvaluacion;
  fecha: string | null;
  notaMaxima: number;
  ponderacion: number | null;
  nota: number | null;
  observacion: string | null;
  catedra: string;
  curso: string;
}

export interface IStudentAsistencia {
  sesionId: string;
  fecha: string;
  estado: TEstadoAsistencia;
  observacion: string | null;
  catedra: string;
}

export interface IStudentAttendance {
  items: IStudentAsistencia[];
  presentes: number;
  atrasos: number;
  ausentes: number;
  justificados: number;
  total: number;
  porcentajeAsistencia: number;
}

export interface IStudentPracticeLog {
  id: string;
  fecha: string;
  minutos: number;
  nota: string | null;
  catedra: string | null;
}

export interface IStudentPractice {
  logs: IStudentPracticeLog[];
  rachaDias: number;
  semana: { dia: string; minutos: number }[];
}

export interface IStudentMaterial {
  id: string;
  titulo: string;
  tipo: TTipoMaterial;
  href: string;
  destino: string | null;
}

export interface IStudentCuotaEstado {
  cuotaId: string;
  periodo: string;
  monto: number;
  montoPagado: number;
  saldo: number;
  fechaVencimiento: string | null;
  estadoEfectivo: string;
  diasMora: number;
}

export interface IStudentPago {
  id: string;
  fecha: string;
  monto: number;
  metodo: string;
  referencia: string | null;
  comprobantePath: string | null;
  periodo: string;
}

export interface IStudentAcuerdo {
  montoMensual: number;
  moneda: string;
  diaCobro: number | null;
  estado: TEstadoAcuerdo;
}

export interface IContactoInstitucional {
  telefono: string | null;
  whatsapp: string | null;
  emailGeneral: string | null;
  horarioAtencion: string | null;
}

export interface IStudentFinanzas {
  acuerdo: IStudentAcuerdo | null;
  cuotas: IStudentCuotaEstado[];
  pagos: IStudentPago[];
  contacto: IContactoInstitucional;
}

export interface IStudentCertificado {
  id: string;
  codigoVerificacion: string;
  fechaEmision: string;
  storagePath: string;
  curso: string;
  catedra: string;
}

export interface IStudentResena {
  id: string;
  cursoId: string;
  curso: string;
  puntuacion: number;
  comentario: string | null;
  publicado: boolean;
  creadaEn: string;
}

export interface IStudentFavorito {
  cursoId: string;
  nombre: string;
  nivel: TNivelCurso | null;
  portadaPublicId: string | null;
}

export interface ICatedraDisponible {
  id: string;
  codigo: string;
  curso: string;
  modalidad: TModalidadCurso;
  aula: string | null;
  estado: TEstadoCatedra;
}

export const DIAS_SEMANA: Record<number, string> = {
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
  7: "Domingo",
};

export const INSCRIPCION_ESTADO_BADGE: Record<TEstadoInscripcion, { label: string; variant: TBadgeVariant }> = {
  pendiente: { label: "Pendiente", variant: "secondary" },
  activa: { label: "Activa", variant: "default" },
  finalizada: { label: "Finalizada", variant: "ghost" },
  cancelada: { label: "Cancelada", variant: "destructive" },
  retirada: { label: "Retirada", variant: "destructive" },
};

export const SESION_ESTADO_BADGE: Record<TEstadoSesion, { label: string; variant: TBadgeVariant }> = {
  programada: { label: "Programada", variant: "default" },
  realizada: { label: "Realizada", variant: "success" },
  cancelada: { label: "Cancelada", variant: "destructive" },
  reprogramada: { label: "Reprogramada", variant: "warning" },
};

export const ASISTENCIA_ESTADO_BADGE: Record<TEstadoAsistencia, { label: string; variant: TBadgeVariant }> = {
  presente: { label: "Presente", variant: "success" },
  ausente: { label: "Ausente", variant: "destructive" },
  justificado: { label: "Justificado", variant: "default" },
  atraso: { label: "Atraso", variant: "warning" },
};

export const EVALUACION_TIPO_BADGE: Record<TTipoEvaluacion, { label: string; variant: TBadgeVariant }> = {
  diagnostica: { label: "Diagnóstica", variant: "ghost" },
  formativa: { label: "Formativa", variant: "secondary" },
  sumativa: { label: "Sumativa", variant: "default" },
  recital: { label: "Recital", variant: "warning" },
  examen_practico: { label: "Examen práctico", variant: "default" },
  examen_teorico: { label: "Examen teórico", variant: "outline" },
};

export const ESTADO_EFECTIVO_BADGE: Record<string, { label: string; variant: TBadgeVariant }> = {
  pagada: { label: "Pagada", variant: "success" },
  parcial: { label: "Parcial", variant: "outline" },
  pendiente: { label: "Pendiente", variant: "secondary" },
  vencida: { label: "Vencida", variant: "destructive" },
  condonada: { label: "Condonada", variant: "ghost" },
};

export const MATERIAL_TIPO_BADGE: Record<TTipoMaterial, { label: string; variant: TBadgeVariant }> = {
  pdf: { label: "PDF", variant: "outline" },
  audio: { label: "Audio", variant: "secondary" },
  video: { label: "Video", variant: "default" },
  partitura: { label: "Partitura", variant: "default" },
  enlace: { label: "Enlace", variant: "ghost" },
};

export const NIVEL_CURSO_LABEL: Record<TNivelCurso, string> = {
  iniciacion: "Iniciación",
  basico: "Básico",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
  maestria: "Maestría",
};

export const MODALIDAD_CURSO_LABEL: Record<TModalidadCurso, string> = {
  presencial: "Presencial",
  virtual: "Virtual",
  hibrido: "Híbrido",
};

export const TIPO_MATERIAL_LABEL: Record<TTipoMaterial, string> = {
  pdf: "Documento",
  audio: "Audio",
  video: "Video",
  partitura: "Partitura",
  enlace: "Enlace",
};