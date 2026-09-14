export interface ITestimonioRow {
  id: string
  autor: string
  rol: string | null
  cita: string
  puntuacion: number | null
  cursoId: string | null
  curso: string | null
  orden: number
  publicado: boolean
}

export interface ITestimonioCursoOption {
  id: string
  nombre: string
}
