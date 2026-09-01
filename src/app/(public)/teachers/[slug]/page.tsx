import { notFound } from "next/navigation";

import { TeacherProfile, TEACHERS, getTeacherBySlug } from "@/features/teachers";
import { CtaPanel } from "@/widgets/CtaPanel";

export function generateStaticParams() {
  return TEACHERS.map((teacher) => ({ slug: teacher.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const teacher = getTeacherBySlug(slug);

  if (!teacher) return {};

  return {
    title: `${teacher.name} | GOSMEL Music Academy`,
    description: teacher.bio,
  };
}

export default async function TeacherPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const teacher = getTeacherBySlug(slug);

  if (!teacher) notFound();

  return (
    <div className="flex-1 bg-background">
      <TeacherProfile teacher={teacher} />
      <CtaPanel
        titleId="teacher-cta-title"
        title={`Aprende ${teacher.instrument.toLowerCase()} con ${teacher.name.split(" ")[0]}.`}
        description="Reserva una clase de prueba gratuita y conoce su forma de enseñar."
        primary={{ label: "Reservar clase de prueba", href: "/contact" }}
        secondary={{ label: "Ver otros profesores", href: "/teachers" }}
      />
    </div>
  );
}
