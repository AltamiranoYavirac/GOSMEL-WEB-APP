import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import type { IDashboardSidebarProps } from "./DashboardSidebar.types";

export default function DashboardSidebar({
  tips,
  events,
  recommended,
}: IDashboardSidebarProps) {
  return (
    <Card className="border border-cocoa/10 dark:border-neutral-800 bg-cream/60 dark:bg-neutral-900 h-fit">
      <CardContent className="flex flex-col gap-6 p-6">

        <div className="flex flex-col gap-3">
          <span className="text-ginger text-xs font-semibold uppercase tracking-widest">
            Consejos del Maestro
          </span>
          <div className="flex flex-col gap-4">
            {tips.map((tip) => (
              <div key={tip.id} className="flex items-start gap-3">
                <span className="mt-0.5 text-ginger shrink-0">
                  <Icon icon={tip.icon} width={16} height={16} />
                </span>
                <div className="flex flex-col gap-0.5">
                  <p className="text-cocoa dark:text-cream text-xs font-semibold">
                    {tip.title}
                  </p>
                  <p className="text-cocoa/60 dark:text-neutral-400 text-xs leading-relaxed">
                    {tip.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-cocoa/10 dark:bg-neutral-800" />

        <div className="flex flex-col gap-3">
          <span className="text-ginger text-xs font-semibold uppercase tracking-widest">
            Próximos Eventos
          </span>
          <div className="flex flex-col gap-3">
            {events.map((event) => (
              <div key={event.id} className="flex flex-col gap-1">
                <span className="text-ginger text-xs font-bold uppercase tracking-widest">
                  {event.date}
                </span>
                <p className="text-cocoa dark:text-cream text-xs font-semibold">
                  {event.title}
                </p>
                <span className="text-cocoa/60 dark:text-neutral-400 text-xs flex items-center gap-1">
                  <Icon icon="mdi:map-marker" width={12} height={12} />
                  {event.location}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-cocoa/10 dark:bg-neutral-800" />

        <div className="flex flex-col gap-3">
          <span className="text-ginger text-xs font-semibold uppercase tracking-widest">
            Cursos Recomendados
          </span>
          <div className="flex flex-col gap-3">
            {recommended.map((course) => (
              <div key={course.id} className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={course.imageUrl}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <p className="text-cocoa dark:text-cream text-xs font-semibold">
                    {course.title}
                  </p>
                  <p className="text-cocoa/60 dark:text-neutral-400 text-xs">
                    {course.schedule}
                  </p>
                </div>
                <Button
                  asChild
                  size="sm"
                  className="bg-ginger hover:bg-burnt text-black font-bold uppercase tracking-widest text-xs shrink-0"
                >
                  <Link href={course.enrollHref}>
                    Inscribirse
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>

      </CardContent>
    </Card>
  );
}