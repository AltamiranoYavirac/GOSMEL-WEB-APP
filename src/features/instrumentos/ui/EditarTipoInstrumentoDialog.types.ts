import type { ITipoInstrumentoRow } from "../model/instrumento.types";

export interface IEditarTipoInstrumentoDialogProps {
  tipo: ITipoInstrumentoRow;
  instrumentosAsociados: number;
}
