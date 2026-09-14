import type { IPublicCourseCard } from "../model/course-public.types"

export interface ICourseCardProps {
  course: IPublicCourseCard
  number: string
  total: string
  isFirst: boolean
  isLast: boolean
}
