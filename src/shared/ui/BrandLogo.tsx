import Link from "next/link";

export default function BrandLogo() {
  return (
    <Link
      href="/"
      aria-label="GOSMEL Academia de Música"
      className="inline-flex items-center gap-2.5 text-foreground outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="flex h-4 items-end gap-0.5 sm:h-[18px]" aria-hidden="true">
        <span className="h-2 w-0.5 bg-current sm:h-[9px] sm:w-[3px]" />
        <span className="h-3.5 w-0.5 bg-current sm:h-4 sm:w-[3px]" />
        <span className="h-2.5 w-0.5 bg-current sm:h-3 sm:w-[3px]" />
        <span className="h-4 w-0.5 bg-current sm:h-[18px] sm:w-[3px]" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[13px] font-semibold tracking-[0.22em] sm:text-sm sm:tracking-[0.24em]">
          GOSMEL
        </span>
        <span className="mt-[3px] text-[7px] tracking-[0.18em] text-muted-foreground sm:text-[7.5px] sm:tracking-[0.2em]">
          ACADEMIA DE MÚSICA
        </span>
      </span>
    </Link>
  );
}
