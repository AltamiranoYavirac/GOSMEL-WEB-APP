import { Icon } from "@iconify/react"

import { cn } from "@/shared/lib/utils"
import { UI_ICONS } from "@/shared/config"

function Spinner({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Icon>, "icon">) {
  return (
    <Icon icon={UI_ICONS.spinner} data-slot="spinner" role="status" aria-label="Loading" className={cn("size-4 animate-spin", className)} {...props} />
  )
}

export { Spinner }
