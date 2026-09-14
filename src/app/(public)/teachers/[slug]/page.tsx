import { notFound } from "next/navigation";

import { TeacherProfile } from "@/features/teachers";
import { getPublicDocentesServer } from "@/features/teachers/server";
import { CtaPanel } from "@/widgets/CtaPanel";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data } = await getPublicDocentesServer();
  const teacher = (data ?? []).find((item) => item.slug === slug);
  if (!teacher) return {};
  return { title: `${teacher.name} | GOSMEL Music Academy`, description: teacher.bio };
}

export default async function TeacherPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data, error } = await getPublicDocentesServer();
  if (error) throw new Error(error);

  const teacher = (data ?? []).find((item) => item.slug === slug);
  if (!teacher) notFound();

  return (
    <div className="flex-1 bg-background">
      <TeacherProfile teacher={teacher} />
      <CtaPanel
        titleId="teacher-cta-title"
        title={`Aprende ${teacher.instrument.toLowerCase() || "música"} con ${teacher.name.split(" ")[0]}.`}
        description="Reserva una clase de prueba gratuita y conoce su forma de enseñar."
        primary={{ label: "Reservar clase de prueba", href: "/contact" }}
        secondary={{ label: "Ver otros profesores", href: "/teachers" }}
      />
    </div>
  );
}
