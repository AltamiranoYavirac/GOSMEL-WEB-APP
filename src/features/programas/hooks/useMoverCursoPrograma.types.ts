export interface IMoverCursoProgramaItem {
  cursoId: string;
  orden: number;
}

export interface IMoverCursoProgramaInput {
  origen: IMoverCursoProgramaItem;
  destino: IMoverCursoProgramaItem;
}
