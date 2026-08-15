import { AppImages } from "@/shared/config/images";
import type { IDashboardCourse } from "./dashboard.types";

export const DASHBOARD_COURSES: IDashboardCourse[] = [
  {
    id: "course-1",
    title: "Técnicas Avanzadas de Piano",
    teacher: "Pedro Pascuales",
    instrument: "Piano",
    nextClass: "24 Oct, 18:00 CET",
    schedule: "Próxima clase live",
    status: "activo",
    imageUrl: AppImages.DASHBOARD_COURSE_1,
    joinHref: "/coming-soon",
  },
  {
    id: "course-2",
    title: "Master Class",
    teacher: "Melany Burgos",
    instrument: "Guitarra",
    nextClass: "28 Oct, 20:00 CET",
    schedule: "Próxima clase live",
    status: "activo",
    imageUrl: AppImages.DASHBOARD_COURSE_2,
    joinHref: "/coming-soon",
  },
];