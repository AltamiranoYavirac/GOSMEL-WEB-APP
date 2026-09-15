import { notFound } from "next/navigation";

import { CourseDetail, getPublicCourseBySlug, getPublicCourseReviews } from "@/features/courses";
import { CtaPanel } from "@/widgets/CtaPanel";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: course } = await getPublicCourseBySlug(slug);

  if (!course) return {};
  return { title: `${course.title} | GOSMEL Music Academy`, description: course.description };
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: course, error } = await getPublicCourseBySlug(slug);

  if (error) throw new Error(error);
  if (!course) notFound();

  const { data: reviews, error: reviewsError } = await getPublicCourseReviews(course.id);
  if (reviewsError) throw new Error(reviewsError);

  return (
    <div className="flex-1 bg-background">
      <CourseDetail course={course} reviews={reviews} />
      {course.ctaTitle && course.ctaDescription ? (
        <CtaPanel
          titleId="course-cta-title"
          title={course.ctaTitle}
          description={course.ctaDescription}
          primary={{ label: course.ctaPrimaryText, href: "/contact" }}
          secondary={{ label: course.ctaSecondaryText, href: "/courses" }}
        />
      ) : null}
    </div>
  );
}
