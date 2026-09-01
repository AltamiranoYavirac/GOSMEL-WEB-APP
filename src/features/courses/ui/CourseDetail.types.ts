import type { COURSES, ICourseDetail } from "../model/courses.constants";

export interface ICourseDetailTeacher {
  name: string;
  slug: string;
  headline: string;
  photo: string;
  photoAlt: string;
}

export interface ICourseDetailProps {
  course: (typeof COURSES)[number];
  detail: ICourseDetail;
  teacher: ICourseDetailTeacher;
}
