import type { Database } from "@/shared/api/supabase/database.types";

export type TTipoPortafolio = Database["public"]["Enums"]["tipo_portafolio"];

export interface ITeacherEducation {
  title: string;
  detail: string;
}

export interface ITeacherTestimonial {
  quote: string;
  author: string;
  role: string;
}

export interface ITeacherFormacion {
  institucion: string;
  titulo: string;
  descripcion?: string | null;
  orden?: number;
}

export interface ITeacherInstrument {
  nombre: string;
  esPrincipal: boolean;
}

export interface ITeacherPortafolio {
  tipo: TTipoPortafolio;
  titulo: string | null;
  urlExterna: string | null;
}

export interface ITeacherReconocimiento {
  titulo: string;
  anio: number | null;
  entidadOtorgante: string | null;
  descripcion: string | null;
}

export interface ITeacher {
  slug: string;
  name: string;
  instrument: string;
  instruments: ITeacherInstrument[];
  courseSlug?: string;
  photo: string;
  photoAlt: string;
  photoIsReference?: boolean;
  headline: string;
  bio: string;
  tags: string[];
  education: ITeacherEducation[];
  studentTestimonials: ITeacherTestimonial[];

  id?: string;
  perfilId?: string;
  tituloProfesional?: string | null;
  fraseDestacada?: string | null;
  aniosExperiencia?: number | null;
  avatarPublicId?: string | null;
  formacionTexto?: string | null;
  formacion?: ITeacherFormacion[];
  redesSociales: Record<string, string>;
  portafolio: ITeacherPortafolio[];
  reconocimientos: ITeacherReconocimiento[];
  orden?: number;
}
