export interface IAsignarEstudianteDialogProps {
  usuario: { id: string; nombre: string; cedula: string | null } | null;
  onClose: () => void;
}
