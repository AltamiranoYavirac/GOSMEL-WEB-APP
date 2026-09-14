export interface IMoverObjetivoProgramaItem {
  id: string;
  orden: number;
}

export interface IMoverObjetivoProgramaInput {
  origen: IMoverObjetivoProgramaItem;
  destino: IMoverObjetivoProgramaItem;
}
