"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { Icon } from "@iconify/react"

import { UI_ICONS } from "@/shared/config"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <Icon icon={UI_ICONS.success} className="size-4" aria-hidden="true" />
        ),
        info: (
          <Icon icon={UI_ICONS.info} className="size-4" aria-hidden="true" />
        ),
        warning: (
          <Icon icon={UI_ICONS.warning} className="size-4" aria-hidden="true" />
        ),
        error: (
          <Icon icon={UI_ICONS.error} className="size-4" aria-hidden="true" />
        ),
        loading: (
          <Icon icon={UI_ICONS.spinner} className="size-4 animate-spin" aria-hidden="true" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
