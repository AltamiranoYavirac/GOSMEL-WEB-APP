import { EstudianteExpediente } from "@/features/estudiantes";

export default async function EstudianteExpedientePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EstudianteExpediente estudianteId={id} />;
}
