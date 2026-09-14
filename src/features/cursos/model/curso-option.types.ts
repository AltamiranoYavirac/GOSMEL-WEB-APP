export interface IInstrumentoOption {
  id: string
  nombre: string
}

export interface ICursoOptions {
  instrumentos: IInstrumentoOption[]
  nextOrden: number
}
