import { TeachersGrid, TEACHERS } from "@/features/teachers";
import { CtaPanel } from "@/widgets/CtaPanel";

export const metadata = {
  title: "Profesores | GOSMEL Music Academy",
  description:
    "Conoce a los maestros de GOSMEL: un profesor dedicado por disciplina, formado en conservatorio.",
};

export default function TeachersPage() {
  return (
    <div className="flex-1 bg-background">
      <TeachersGrid teachers={TEACHERS} />
      <CtaPanel
        titleId="teachers-cta-title"
        title="¿Aún no sabes por dónde empezar?"
        description="Cuéntanos qué te gustaría aprender y te ayudamos a elegir el profesor y el programa que mejor se adaptan a tu momento."
        primary={{ label: "Reservar clase de prueba", href: "/contact" }}
        secondary={{ label: "Ver los programas", href: "/courses" }}
      />
    </div>
  );
}
