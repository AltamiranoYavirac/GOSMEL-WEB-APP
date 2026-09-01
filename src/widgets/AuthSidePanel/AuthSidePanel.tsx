import Image from "next/image";

import { AUTH_PANEL_CHIPS } from "./authSidePanel.constants";
import type { IAuthSidePanelProps } from "./AuthSidePanel.types";

export default function AuthSidePanel({ image, imageAlt, quote }: IAuthSidePanelProps) {
  return (
    <aside className="relative hidden overflow-hidden bg-surface-dark text-surface-dark-foreground lg:block">
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="50vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/95 via-surface-dark/55 to-surface-dark/25" />

      <div className="absolute inset-x-0 top-0 flex items-center gap-3 p-11 xl:p-14">
        <span className="flex h-[18px] items-end gap-[3px]">
          <span className="w-[3px] bg-surface-dark-foreground" style={{ height: "9px" }} />
          <span className="w-[3px] bg-surface-dark-foreground" style={{ height: "16px" }} />
          <span className="w-[3px] bg-surface-dark-foreground" style={{ height: "12px" }} />
          <span className="w-[3px] bg-surface-dark-foreground" style={{ height: "18px" }} />
        </span>
        <span className="text-[15px] font-semibold tracking-[0.24em]">GOSMEL</span>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-11 xl:p-14">
        <p className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-stage-accent">
          Academia de música
        </p>
        <p className="max-w-[420px] text-[28px] font-light italic leading-[1.3] xl:text-[30px]">
          &ldquo;{quote}&rdquo;
        </p>
        <div className="mt-8 flex flex-wrap gap-2.5">
          {AUTH_PANEL_CHIPS.map((chip) => (
            <span
              key={chip}
              className="rounded-full bg-surface-dark-foreground/10 px-4 py-2 text-[12.5px] font-medium"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}
