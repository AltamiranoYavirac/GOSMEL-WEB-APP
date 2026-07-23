import Link from "next/link";

interface ISocialLinkProps {
  href: string;
  "aria-label": string;
  children: React.ReactNode;
}

export default function SocialLink({
  href,
  children,
  "aria-label": ariaLabel,
}: ISocialLinkProps) {
  const isExternal = href.startsWith("http");

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="w-10 h-10 rounded-full bg-neutral-700/30 border border-neutral-600/40 flex items-center justify-center text-neutral-300/60 hover:text-ginger hover:border-ginger transition-all"
    >
      {children}
    </Link>
  );
}
