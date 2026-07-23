import { forwardRef } from "react";

import { inputVariants } from "./Input.variants";
import type { IInputProps } from "./Input.types";

export const Input = forwardRef<HTMLInputElement, IInputProps>(function Input(
  { error, icon, iconPosition = "end", className, ...props },
  ref,
) {
  const position = icon ? iconPosition : "none";
  const { root, field, icon: iconSlot } = inputVariants({
    state: error ? "error" : "default",
    iconPosition: position,
  });

  return (
    <div className={root({ class: className })}>
      <input
        ref={ref}
        aria-invalid={error || undefined}
        className={field()}
        {...props}
      />
      {icon && <span className={iconSlot()}>{icon}</span>}
    </div>
  );
});
