export interface ISeccionRow {
  id: string;
  titulo: string;
  clave: string;
  contenido: string;
  imagenPublicId: string | null;
  imagenTextoAlt: string | null;
  orden: number;
  actualizado: string;
  publicado: boolean;
}

export interface IPublicSeccion {
  id: string;
  clave: string;
  titulo: string;
  contenido: string;
  imagenPublicId: string | null;
  imagenTextoAlt: string | null;
}