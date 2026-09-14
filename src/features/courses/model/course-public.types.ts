import type { Database } from "@/shared/api/supabase/database.types"

export type TPublicCourseCategory = Database["public"]["Enums"]["categoria_curso"]

export interface IPublicCourseTeacher {
  id: string
  slug: string
  name: string
  headline: string
  photo: string | null
  photoAlt: string
}

export interface IPublicCourseCard {
  id: string
  slug: string
  title: string
  category: string
  categoryValue: TPublicCourseCategory
  icon: string
  description: string
  learns: string[]
  image: string | null
  imageAlt: string
  priceLabel: string | null
  teachers: IPublicCourseTeacher[]
}

export interface IPublicCourseGalleryItem {
  id: string
  src: string
  alt: string
}

export interface IPublicCourseTestimonial {
  quote: string
  author: string
  role: string
}

export interface IPublicCourseLesson {
  id: string
  title: string
}

export interface IPublicCourseModule {
  id: string
  title: string
  description: string | null
  lessons: IPublicCourseLesson[]
}

export interface IPublicCourseDetail extends IPublicCourseCard {
  modules: IPublicCourseModule[]
  audienceAge: string
  audienceLevel: string
  classFormat: string
  schedule: string
  stageClosing: string
  gallery: IPublicCourseGalleryItem[]
  testimonial: IPublicCourseTestimonial | null
  ctaTitle: string
  ctaDescription: string
  ctaPrimaryText: string
  ctaSecondaryText: string
}
