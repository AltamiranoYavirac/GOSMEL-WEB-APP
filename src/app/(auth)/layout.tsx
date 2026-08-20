import Link from "next/link";
import { Icon } from "@iconify/react";

import { Button, ThemeToggle } from "@/shared/ui";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex-1 min-h-screen bg-background flex flex-col overflow-x-hidden">
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between p-4 sm:p-6">
        <Button
          asChild
          variant="ghost"
          className="gap-2 border border-border bg-background/70 backdrop-blur-md"
        >
          <Link href="/">
            <Icon icon="ph:arrow-left" className="size-4" aria-hidden="true" />
            Inicio
          </Link>
        </Button>
        <ThemeToggle className="border border-border bg-background/70 backdrop-blur-md" />
      </div>
      {children}
    </main>
  );
}
