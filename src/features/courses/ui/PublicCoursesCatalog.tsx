import { getPublicCourses } from "../api/getPublicCourses";
import CoursesCatalog from "./CoursesCatalog";

export default async function PublicCoursesCatalog() {
  const { data, error } = await getPublicCourses();

  if (error || !data) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 px-4 text-center">
        <p className="font-heading text-2xl text-foreground">No se pudieron cargar los cursos.</p>
        <p className="text-sm text-muted-foreground">Intenta de nuevo más tarde.</p>
      </div>
    );
  }

  return <CoursesCatalog courses={data} />;
}