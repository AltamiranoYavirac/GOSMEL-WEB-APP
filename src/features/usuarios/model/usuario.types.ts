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
    className:
      "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:border-violet-400/40 dark:bg-violet-500/15 dark:text-violet-300",
  },
  estudiante: { label: "Estudiante", variant: "outline" },
  representante: { label: "Representante", variant: "ghost" },
};