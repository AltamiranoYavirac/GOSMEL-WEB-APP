import type { COURSES } from "../model/courses.constants";

export interface ICourseCardTeacher {
  slug: string;
  name: string;
  photo: string;
  photoAlt: string;
}

export interface ICourseCardProps {
  course: (typeof COURSES)[number];
  teachers: ICourseCardTeacher[];
  number: string;
}
