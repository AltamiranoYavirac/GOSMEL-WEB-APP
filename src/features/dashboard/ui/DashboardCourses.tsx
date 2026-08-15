import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { Card, CardContent } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import type { IDashboardCoursesProps } from "./DashboardCourses.types";

export default function DashboardCourses({
  courses,
  catalogHref,
}: IDashboardCoursesProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-cocoa dark:text-cream">
          Mis Cursos
        </h2>
        <Link
          href={catalogHref}
          className="text-ginger text-xs font-semibold uppercase tracking-widest hover:brightness-110 transition"
        >
          View Catalog
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {courses.map((course) => (
          <Card
            key={course.id}
            className="relative overflow-hidden border border-cocoa/10 dark:border-neutral-800 bg-cream/60 dark:bg-neutral-900"
          >
            <div className="relative h-32 w-full">
              <Image
                src={course.imageUrl}
                alt={course.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute top-3 left-3">
                <Badge className="bg-ginger text-black text-xs uppercase tracking-widest">
                  {course.instrument}
                </Badge>
              </div>
            </div>

            <CardContent className="flex flex-col gap-3 p-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-cocoa dark:text-cream font-bold text-sm leading-tight">
                  {course.title}
                </h3>
                <p className="text-cocoa/60 dark:text-neutral-400 text-xs">
                  Maestro: {course.teacher}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-ginger text-xs uppercase tracking-widest flex items-center gap-1">
                    <Icon icon="mdi:broadcast" width={12} height={12} />
                    {course.schedule}
                  </span>
                  <span className="text-cocoa/60 dark:text-neutral-400 text-xs">
                    {course.nextClass}
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className="border-ginger/40 text-ginger text-xs uppercase"
                >
                  {course.status}
                </Badge>
              </div>

              <Button
                asChild
                className="w-full bg-ginger hover:bg-burnt text-black font-bold uppercase tracking-widest text-xs"
              >
                <Link href={course.joinHref}>
                  Unirse a Sesión
                  <Icon icon="mdi:login" width={16} height={16} />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}