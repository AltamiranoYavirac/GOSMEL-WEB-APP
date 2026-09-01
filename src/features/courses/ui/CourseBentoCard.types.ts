import type { COURSES } from "../model/courses.constants";

export interface ICourseBentoCardProps {
  course: (typeof COURSES)[number];
  number: string;
  spanClass?: string;
  featured?: boolean;
}
