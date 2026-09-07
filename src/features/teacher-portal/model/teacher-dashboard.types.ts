import type { Database } from "@/shared/api/supabase/database.types";
import type { TBadgeVariant } from "@/shared/ui";

export type TModalidadCurso = Database["public"]["Enums"]["modalidad_curso"];
export type TEstadoCatedra = Database["public"]["Enums"]["estado_catedra"];
export type TEstadoSesion = Database["public"]["Enums"]["estado_sesion"];
export type TTipoMaterial = Database["public"]["Enums"]["tipo_material"];
export type TVisibilidadMaterial = Database["public"]["Enums"]["visibilidad_material"];
export type TTipoEvaluacion = Database["public"]["Enums"]["tipo_evaluacion"];
export type TEstadoAsistencia = Database["public"]["Enums"]["estado_asistencia"];
export type TTipoPortafolio = Database["public"]["Enums"]["tipo_portafolio"];

export interface ITeacherHorario {
  dia: number;
  inicio: string;
  fin: string;
}

export interface ITeacherCatedra {
  id: string;
  codigo: string;
  cursoId: string;
  curso: string;
  modalidad: TModalidadCurso;
  aula: string | null;
  cupoMaximo: number;
  inscritos: number;
  estado: TEstadoCatedra;
  horarios: ITeacherHorario[];
}

export interface ITeacherEstudiante {
  id: string;
  inscripcionId: string;
  nombre: string;
  email: string | null;
  celular: string | null;
  catedraId: string;
  catedraCodigo: string;
  cursoNombre: string;
  fechaInscripcion: string;
  promedioSobre10: number | null;
  evaluacionesRendidas: number;
  porcentajeAsistencia: number | null;
  asistenciasPresentes: number;
  totalAsistenciasRegistradas: number;
}

export interface ITeacherSesion {
  id: string;
  catedraId: string;
  catedra: string;
  curso: string;
  fecha: string;
  inicio: string;
  fin: string;
  tema: string | null;
  presentes: number;
  totalAsistencia: number;
  estado: TEstadoSesion;
}

export interface ITeacherMaterial {
  id: string;
  titulo: string;
  tipo: TTipoMaterial;
  visibilidad: TVisibilidadMaterial;
  destino: string | null;
  storagePath: string | null;
  urlExterna: string | null;
  catedraId: string | null;
  cursoId: string | null;
  subidoPor: string | null;
  createdAt: string;
}

export interface ITeacherEvaluacion {
  id: string;
  catedraId: string;
  titulo: string;
  tipo: TTipoEvaluacion;
  catedra: string;
  curso: string;
  fecha: string | null;
  ponderacion: number;
  notaMaxima: number;
  promedio: number | null;
  rendidas: number;
  totalEstudiantes: number;
}

export interface ITeacherDashboard {
  nombre: string;
  counts: {
    catedrasActivas: number;
    sesionesHoy: number;
    inscritos: number;
    evaluacionesPendientes: number;
  };
  catedras: ITeacherCatedra[];
  estudiantes: ITeacherEstudiante[];
  sesionesHoy: ITeacherSesion[];
  proximasSesiones: ITeacherSesion[];
  pendientesAsistencia: ITeacherSesion[];
  pendientesCalificar: ITeacherEvaluacion[];
}

export interface IEstudianteAsistenciaHistorialItem {
  sesionId: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  tema: string | null;
  estado: TEstadoAsistencia;
  observacion: string | null;
}

export interface ICursoTemarioLeccion {
  id: string;
  titulo: string;
  descripcion: string | null;
  duracionMinutos: number | null;
  orden: number;
  esMuestra: boolean;
}

export interface ICursoTemarioModulo {
  id: string;
  titulo: string;
  descripcion: string | null;
  orden: number;
  lecciones: ICursoTemarioLeccion[];
}

export interface ICursoTemario {
  cursoId: string;
  cursoNombre: string;
  modulos: ICursoTemarioModulo[];
}

export interface ITeacherFormacionItem {
  id: string;
  institucion: string;
  titulo: string;
  anioInicio: number | null;
  anioFin: number | null;
  descripcion: string | null;
  orden: number;
}

export interface ITeacherReconocimientoItem {
  id: string;
  titulo: string;
  anio: number | null;
  entidadOtorgante: string | null;
  descripcion: string | null;
  orden: number;
}

export interface ITeacherPortafolioItem {
  id: string;
  tipo: TTipoPortafolio;
  titulo: string;
  urlExterna: string | null;
  orden: number;
}

export interface ITeacherInstrumentoItem {
  instrumentoId: string;
  nombre: string;
  esPrincipal: boolean;
}

export interface ITeacherPerfil {
  id: string;
  nombre: string;
  email: string | null;
  tituloProfesional: string | null;
  biografia: string | null;
  fraseDestacada: string | null;
  aniosExperiencia: number | null;
  redesSociales: Record<string, string>;
  formacion: ITeacherFormacionItem[];
  reconocimientos: ITeacherReconocimientoItem[];
  portafolio: ITeacherPortafolioItem[];
  instrumentos: ITeacherInstrumentoItem[];
}

export interface ITeacherCatalogoOption {
  id: string;
  codigo: string;
  cursoNombre: string;
}

export interface ITeacherInstrumentoOption {
  id: string;
  nombre: string;
}

export interface ITeacherCatalogos {
  catedras: ITeacherCatalogoOption[];
  instrumentos: ITeacherInstrumentoOption[];
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

export const CATEDRA_ESTADO_BADGE: Record<TEstadoCatedra, { label: string; variant: TBadgeVariant }> = {
  planificada: { label: "Planificada", variant: "outline" },
  en_curso: { label: "En curso", variant: "default" },
  finalizada: { label: "Finalizada", variant: "ghost" },
  cancelada: { label: "Cancelada", variant: "destructive" },
};

export const MODALIDAD_BADGE: Record<TModalidadCurso, { label: string; variant: TBadgeVariant }> = {
  presencial: { label: "Presencial", variant: "default" },
  virtual: { label: "Virtual", variant: "secondary" },
  hibrido: { label: "Híbrido", variant: "outline" },
};

export const SESION_ESTADO_BADGE: Record<TEstadoSesion, { label: string; variant: TBadgeVariant }> = {
  programada: { label: "Programada", variant: "outline" },
  realizada: { label: "Realizada", variant: "default" },
  cancelada: { label: "Cancelada", variant: "destructive" },
  reprogramada: { label: "Reprogramada", variant: "secondary" },
};

export const MATERIAL_TIPO_BADGE: Record<TTipoMaterial, { label: string; variant: TBadgeVariant }> = {
  partitura: { label: "Partitura", variant: "default" },
  audio: { label: "Audio", variant: "secondary" },
  video: { label: "Video", variant: "outline" },
  pdf: { label: "PDF", variant: "default" },
  enlace: { label: "Enlace", variant: "outline" },
};

export const EVALUACION_TIPO_BADGE: Record<TTipoEvaluacion, { label: string; variant: TBadgeVariant }> = {
  diagnostica: { label: "Diagnóstica", variant: "outline" },
  formativa: { label: "Formativa", variant: "secondary" },
  sumativa: { label: "Sumativa", variant: "default" },
  recital: { label: "Recital", variant: "default" },
  examen_practico: { label: "Examen Práctico", variant: "default" },
  examen_teorico: { label: "Examen Teórico", variant: "outline" },
};

export const ASISTENCIA_ESTADO_BADGE: Record<TEstadoAsistencia, { label: string; variant: TBadgeVariant }> = {
  presente: { label: "Presente", variant: "default" },
  ausente: { label: "Ausente", variant: "destructive" },
  justificado: { label: "Justificado", variant: "secondary" },
  atraso: { label: "Atraso", variant: "outline" },
};