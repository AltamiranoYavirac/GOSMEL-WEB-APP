export interface ICursoOption {
  id: string
  nombre: string
  instrumentoId: string | null
}

export interface IDocenteOption {
  id: string
  nombre: string
  instrumentoIds: string[]
}

export interface ICatedraOptions {
  cursos: ICursoOption[]
  docentes: IDocenteOption[]
  sugerenciaCodigo: string
}
