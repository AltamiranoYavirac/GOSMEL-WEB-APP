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

export interface ITeacher {
  slug: string;
  name: string;
  instrument: string;
  courseSlug?: string;
  photo: string;
  photoAlt: string;
  photoIsReference?: boolean;
  headline: string;
  bio: string;
  tags: string[];
  education: ITeacherEducation[];
  teachesNote?: string;
  philosophy?: string;
  studentTestimonials: ITeacherTestimonial[];


  id?: string;
  perfilId?: string;
  tituloProfesional?: string | null;
  fraseDestacada?: string | null;
  aniosExperiencia?: number | null;
  avatarPublicId?: string | null;
  formacionTexto?: string | null;
  formacion?: ITeacherFormacion[];
  orden?: number;
}


