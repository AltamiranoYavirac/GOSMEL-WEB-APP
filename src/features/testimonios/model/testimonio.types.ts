export interface ITestimonioRow {
  id: string
  autor: string
  rol: string | null
  cita: string
  puntuacion: number | null
  fotoPublicId: string | null
  cursoId: string | null
  curso: string | null
  docenteId: string | null
  docente: string | null
  orden: number
  publicado: boolean
}

export interface IPublicTestimonio {
  id: string
  autor: string
  rol: string | null
  cita: string
  puntuacion: number | null
  fotoPublicId: string | null
}

export interface ITestimonioCursoOption {
  id: string
  nombre: string
}

export interface ITestimonioDocenteOption {
  id: string
  nombre: string
}

export interface ITestimonioOptions {
  cursos: ITestimonioCursoOption[]
  docentes: ITestimonioDocenteOption[]
}
