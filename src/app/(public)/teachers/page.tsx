import { TeachersGrid } from "@/features/teachers";

export const metadata = {
  title: "Profesores | GOSMEL Music Academy",
  description:
    "Conoce a los maestros de GOSMEL: un profesor dedicado por disciplina, formado en conservatorio.",
};

export default function TeachersPage() {
  return (
    <div className="flex-1 bg-background">
      <TeachersGrid />
    </div>
  );
}



