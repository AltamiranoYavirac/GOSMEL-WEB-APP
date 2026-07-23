import type { ComponentProps, ReactNode } from "react";

export interface IInputProps
  extends Omit<ComponentProps<"input">, "className"> {
  error?: boolean;
  icon?: ReactNode;
  iconPosition?: "start" | "end";
  className?: string;
}
