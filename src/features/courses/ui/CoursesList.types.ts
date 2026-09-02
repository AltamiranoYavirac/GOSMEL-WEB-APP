import type { ICourseCardTeacher } from "./CourseCard.types";

export interface ICoursesListProps {
  teachersByCourse: Record<string, ICourseCardTeacher[]>;
}
