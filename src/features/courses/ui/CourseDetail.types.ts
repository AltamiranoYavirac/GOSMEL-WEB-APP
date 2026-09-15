import type { IPublicCourseDetail, IPublicCourseReview } from "../model/course-public.types"

export interface ICourseDetailProps {
  course: IPublicCourseDetail
  reviews: IPublicCourseReview[]
}
