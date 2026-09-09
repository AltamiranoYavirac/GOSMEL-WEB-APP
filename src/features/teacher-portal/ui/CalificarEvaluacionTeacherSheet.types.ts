export interface ICalificarEvaluacionTeacherSheetProps {
  evaluacionId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface ICalificacionOverride {
  nota?: string;
  observacion?: string;
}
