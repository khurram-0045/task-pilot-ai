"use client"

import { Menu } from "lucide-react"
import type { ReactNode } from "react"

export function ScreenHeader({
  title,
  subtitle,
  onMenu,
  action,
}: {
  title: string
  subtitle?: string
  onMenu?: () => void
  action?: ReactNode
}) {
  return (
    <header className="flex items-center justify-between px-5 pb-4 pt-2">
      <div className="flex items-center gap-3">
        {onMenu && (
          <button
            onClick={onMenu}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary/70 text-foreground transition-transform active:scale-90"
          >
            <Menu className="h-[18px] w-[18px]" />
          </button>
        )}
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {action}
    </header>
  )
}
