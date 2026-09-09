import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/shared/api/supabase/database.types";

import {
  getTeacherDashboard,
  getTeacherCatedras,
  getTeacherEstudiantes,
  getTeacherEvaluaciones,
  getTeacherMateriales,
  getTeacherSesiones,
  getTeacherPerfil,
} from "./api";
import { teacherQueryKeys } from "./model/query-keys";

type Client = SupabaseClient<Database>;

export function teacherDashboardQuery(supabase: Client) {
  return {
    queryKey: teacherQueryKeys.dashboard(),
    queryFn: async () => {
      const { data, error } = await getTeacherDashboard(supabase);
      if (error) throw new Error(error);
      return data;
    },
  };
}

export function teacherCatedrasQuery(supabase: Client) {
  return {
    queryKey: teacherQueryKeys.catedras(),
    queryFn: async () => {
      const { data, error } = await getTeacherCatedras(supabase);
      if (error) throw new Error(error);
      return data ?? [];
    },
  };
}

export function teacherEstudiantesQuery(supabase: Client) {
  return {
    queryKey: teacherQueryKeys.estudiantes(),
    queryFn: async () => {
      const { data, error } = await getTeacherEstudiantes(supabase);
      if (error) throw new Error(error);
      return data ?? [];
    },
  };
}

export function teacherEvaluacionesQuery(supabase: Client) {
  return {
    queryKey: teacherQueryKeys.evaluaciones(),
    queryFn: async () => {
      const { data, error } = await getTeacherEvaluaciones(supabase);
      if (error) throw new Error(error);
      return data ?? [];
    },
  };
}

export function teacherMaterialesQuery(supabase: Client) {
  return {
    queryKey: teacherQueryKeys.materiales(),
    queryFn: async () => {
      const { data, error } = await getTeacherMateriales(supabase);
      if (error) throw new Error(error);
      return data ?? [];
    },
  };
}

export function teacherSesionesQuery(supabase: Client) {
  return {
    queryKey: teacherQueryKeys.sesiones(),
    queryFn: async () => {
      const { data, error } = await getTeacherSesiones(supabase);
      if (error) throw new Error(error);
      return data ?? [];
    },
  };
}

export function teacherPerfilQuery(supabase: Client) {
  return {
    queryKey: teacherQueryKeys.perfil(),
    queryFn: async () => {
      const { data, error } = await getTeacherPerfil(supabase);
      if (error) throw new Error(error);
      return data;
    },
  };
}
