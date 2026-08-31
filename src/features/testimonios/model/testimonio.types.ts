export interface ITestimonioRow {
  id: string;
  autor: string;
  rol: string | null;
  cita: string;
  puntuacion: number | null;
  publicado: boolean;
}