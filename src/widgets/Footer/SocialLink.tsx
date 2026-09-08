import Link from "next/link";

import { Button } from "@/shared/ui";

import type { ISocialLinkProps } from "./SocialLink.types";

export default function SocialLink({
  href,
  children,
  "aria-label": ariaLabel,
}: ISocialLinkProps) {
  const isExternal = href.startsWith("http");

  return (
    <Button
      asChild
      variant="ghost"
      size="icon"
      className="rounded-full bg-muted border border-border text-muted-foreground hover:text-primary hover:border-primary"
    >
      <Link
        href={href}
        aria-label={ariaLabel}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
      >
        {children}
      </Link>
    </Button>
  );
}
