export interface ICobranzaRow {
  id: string;
  representante: string;
  celular: string | null;
  hijosConCuota: number;
  saldoTotal: number;
  totalMes: number;
  diasMoraMax: number | null;
  periodoMes: string;
}