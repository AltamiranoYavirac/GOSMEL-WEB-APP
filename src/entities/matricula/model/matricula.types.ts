import type { Database } from "@/shared/api/supabase/database.types";

export type TModalidadCurso = Database["public"]["Enums"]["modalidad_curso"];
export type TNivelCurso = Database["public"]["Enums"]["nivel_curso"];

export interface IInscripcionPendiente {
  id: string;
  fechaInscripcion: string;
  fechaInicio: string;
  fechaFin: string | null;
  estudiante: string;
  estudianteAvatarPublicId: string | null;
  estudianteFechaNacimiento: string | null;
  estudianteNivelMusical: TNivelCurso | null;
  estudianteEdad: number | null;
  estudianteCelular: string | null;
  estudianteEmail: string | null;
  esMenor: boolean;
  catedraCodigo: string | null;
  cursoNombre: string | null;
  cursoNivel: TNivelCurso | null;
  modalidad: TModalidadCurso | null;
  aula: string | null;
  docenteNombre: string | null;
  instrumentoNombre: string | null;
  instrumentoIcono: string | null;
  precioReferencial: number | null;
  horarioResumen: string | null;
  formatoClase: string | null;
  cursoPortadaPublicId: string | null;
  cupoMaximo: number | null;
  cuposOcupados: number;
  duracionSemanas: number | null;
  horasTotales: number | null;
  diasEspera: number;
  solicitadaPorNombre: string | null;
  representante: {
    nombre: string;
    parentesco: string;
  } | null;
  desdeSolicitud: boolean;
}
