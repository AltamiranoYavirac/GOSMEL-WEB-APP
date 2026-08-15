import { Icon } from "@iconify/react";
import { Card, CardContent } from "@/shared/ui/card";
import type { IDashboardResourcesProps } from "./DashboardResources.types";

export default function DashboardResources({ resources }: IDashboardResourcesProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-cocoa dark:text-cream">
        Recursos de la Academia
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {resources.map((resource) => (
          <Card
            key={resource.id}
            className="border border-cocoa/10 dark:border-neutral-800 bg-cream/60 dark:bg-neutral-900"
          >
            <CardContent className="flex flex-col items-center text-center gap-3 p-6">
              <span className="text-ginger">
                <Icon icon={resource.icon} width={36} height={36} />
              </span>
              <h3 className="text-cocoa dark:text-cream font-bold text-sm">
                {resource.title}
              </h3>
              <p className="text-cocoa/60 dark:text-neutral-400 text-xs leading-relaxed">
                {resource.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}