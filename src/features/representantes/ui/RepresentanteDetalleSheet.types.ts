export interface IRepresentanteDetalleSheetProps {
  representanteId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: () => void;
  onMatricularHijo?: (representanteId: string) => void;
}
