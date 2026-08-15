import { Navbar } from "@/widgets/Navbar";
import { Footer } from "@/widgets/Footer";
import {
  DashboardWelcome,
  DashboardCourses,
  DashboardResources,
  DashboardSidebar,
} from "@/features/dashboard";
import { DASHBOARD_COURSES } from "@/features/dashboard/model/courses.data";
import { DASHBOARD_RESOURCES } from "@/features/dashboard/model/resources.data";
import {
  DASHBOARD_TIPS,
  DASHBOARD_EVENTS,
  DASHBOARD_RECOMMENDED,
} from "@/features/dashboard/model/sidebar.data";

export const metadata = {
  title: "Mi Estudio | GOSMEL Academia de Música",
  description: "Accede a tus cursos y recursos como estudiante de GOSMEL.",
};

export default function StudentDashboardPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background dark:bg-neutral-950 px-4 pt-28 pb-16">
        <div className="max-w-6xl mx-auto flex flex-col gap-10">

          <DashboardWelcome studentName="Alexander" />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
            <div className="flex flex-col gap-10">
              <DashboardCourses
                courses={DASHBOARD_COURSES}
                catalogHref="/courses"
              />
              <DashboardResources resources={DASHBOARD_RESOURCES} />
            </div>

            <DashboardSidebar
              tips={DASHBOARD_TIPS}
              events={DASHBOARD_EVENTS}
              recommended={DASHBOARD_RECOMMENDED}
            />
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}