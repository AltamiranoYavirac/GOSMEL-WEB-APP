export interface ICursoOption {
  id: string
  nombre: string
}

export interface IDocenteOption {
  id: string
  nombre: string
}

export interface ICatedraOptions {
  cursos: ICursoOption[]
  docentes: IDocenteOption[]
  sugerenciaCodigo: string
}
