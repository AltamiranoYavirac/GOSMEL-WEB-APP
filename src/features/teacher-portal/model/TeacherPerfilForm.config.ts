import { z } from "zod";

export const teacherPerfilFormSchema = z.object({
  tituloProfesional: z.string().max(100, "Máximo 100 caracteres").optional().or(z.literal("")),
  biografia: z.string().max(2000, "Máximo 2000 caracteres").optional().or(z.literal("")),
  fraseDestacada: z.string().max(250, "Máximo 250 caracteres").optional().or(z.literal("")),
  aniosExperiencia: z.number().min(0, "Mínimo 0 años").max(70, "Máximo 70 años").optional().nullable(),
  instagram: z.string().optional().or(z.literal("")),
  linkedin: z.string().optional().or(z.literal("")),
  youtube: z.string().optional().or(z.literal("")),
  facebook: z.string().optional().or(z.literal("")),
});

export type ITeacherPerfilFormValues = z.infer<typeof teacherPerfilFormSchema>;

export function getTeacherPerfilFormDefaults(): ITeacherPerfilFormValues {
  return {
    tituloProfesional: "",
    biografia: "",
    fraseDestacada: "",
    aniosExperiencia: 0,
    instagram: "",
    linkedin: "",
    youtube: "",
    facebook: "",
  };
}

export function mapTeacherPerfilToFormValues(data: {
  tituloProfesional: string | null;
  biografia: string | null;
  fraseDestacada: string | null;
  aniosExperiencia: number | null;
  redesSociales: Record<string, string>;
}): ITeacherPerfilFormValues {
  return {
    tituloProfesional: data.tituloProfesional ?? "",
    biografia: data.biografia ?? "",
    fraseDestacada: data.fraseDestacada ?? "",
    aniosExperiencia: data.aniosExperiencia ?? 0,
    instagram: data.redesSociales?.instagram ?? "",
    linkedin: data.redesSociales?.linkedin ?? "",
    youtube: data.redesSociales?.youtube ?? "",
    facebook: data.redesSociales?.facebook ?? "",
  };
}

export function buildTeacherPerfilPayload(values: ITeacherPerfilFormValues) {
  const redes: Record<string, string> = {};
  if (values.instagram?.trim()) redes.instagram = values.instagram.trim();
  if (values.linkedin?.trim()) redes.linkedin = values.linkedin.trim();
  if (values.youtube?.trim()) redes.youtube = values.youtube.trim();
  if (values.facebook?.trim()) redes.facebook = values.facebook.trim();

  return {
    titulo_profesional: values.tituloProfesional?.trim() || null,
    biografia: values.biografia?.trim() || null,
    frase_destacada: values.fraseDestacada?.trim() || null,
    anios_experiencia: values.aniosExperiencia ?? null,
    redes_sociales: redes,
  };
}
