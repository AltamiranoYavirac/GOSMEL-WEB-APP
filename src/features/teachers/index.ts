export { default as TeachersGrid } from "./ui/TeachersGrid";
export { default as TeacherCard } from "./ui/TeacherCard";
export { default as TeacherProfile } from "./ui/TeacherProfile";
export { usePublicDocentes } from "./hooks";
export { getPublicDocentes } from "./api";
export { teachersPublicQueryKeys } from "./model/query-keys";
export {
  TEACHERS,
  getTeacherBySlug,
  getTeacherByCourseSlug,
} from "./model/teachers.constants";
export type { ITeacher, ITeacherFormacion } from "./model/teachers.types";

