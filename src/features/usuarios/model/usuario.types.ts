import type { Database } from "@/shared/api/supabase/database.types";
import type { TBadgeVariant } from "@/shared/ui";

export type TRolUsuario = Database["public"]["Enums"]["rol_usuario"];

export interface IUsuarioRow {
  id: string;
  nombre: string;
  email: string | null;
  cedula: string | null;
  celular: string | null;
  roles: TRolUsuario[];
  activo: boolean;
}

export const ROL_BADGE: Record<
  TRolUsuario,
  { label: string; variant: TBadgeVariant; className?: string }
> = {
  admin: { label: "Administrador", variant: "default" },
  docente: {
    label: "Docente",
    variant: "outline",
    className: "border-info-border bg-info-tint text-info-fg",
  },
  estudiante: { label: "Estudiante", variant: "outline" },
  representante: { label: "Representante", variant: "ghost" },
};