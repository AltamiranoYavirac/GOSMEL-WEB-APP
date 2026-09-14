import { TeachersGrid } from "@/features/teachers";
import { getPublicDocentesServer } from "@/features/teachers/server";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Profesores | GOSMEL Music Academy",
  description: "Conoce a los docentes publicados de GOSMEL Music Academy.",
};

export default async function TeachersPage() {
  const { data, error } = await getPublicDocentesServer();
  if (error) throw new Error(error);

  return (
    <div className="flex-1 bg-background">
      <TeachersGrid teachers={data ?? []} />
    </div>
  );
}
