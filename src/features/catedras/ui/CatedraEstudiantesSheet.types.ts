import type { ICatedraRow } from "../model/catedra.types";

export interface ICatedraEstudiantesSheetProps {
  catedra: ICatedraRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "matriculados" | "pendientes";
}
