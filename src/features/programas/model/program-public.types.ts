export interface IPublicProgramCourse {
  id: string
  slug: string
  name: string
}

export interface IPublicProgram {
  id: string
  slug: string
  title: string
  description: string
  objectives: string[]
  level: string | null
  priceLabel: string | null
  instrument: string | null
  image: string | null
  imageAlt: string
  courses: IPublicProgramCourse[]
}
