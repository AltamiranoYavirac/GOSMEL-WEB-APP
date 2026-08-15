import type { IDashboardCourse } from "../model/dashboard.types";

export interface IDashboardCoursesProps {
  courses: IDashboardCourse[];
  catalogHref: string;
}