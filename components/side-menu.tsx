"use client"

import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Sparkles,
  Vault,
  BarChart3,
  Flame,
  Settings,
  Info,
  LogOut,
  X,
} from "lucide-react"
import type { Screen } from "@/lib/app-data"
import { cn } from "@/lib/utils"

const links: { screen: Screen | null; label: string; icon: typeof LayoutDashboard }[] = [
  { screen: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { screen: "projects", label: "Projects", icon: FolderKanban },
  { screen: "tasks", label: "Tasks", icon: CheckSquare },
  { screen: "vault", label: "Vault", icon: Vault },
  { screen: "ai", label: "AI Assistant", icon: Sparkles },
  { screen: "analytics", label: "Analytics", icon: BarChart3 },
  { screen: "habits", label: "Habits", icon: Flame },
]

const secondary: { label: string; icon: typeof Settings }[] = [
  { label: "Settings", icon: Settings },
  { label: "About", icon: Info },
]

export function SideMenu({
  open,
  active,
  onClose,
  onNavigate,
}: {
  open: boolean
  active: Screen
  onClose: () => void
  onNavigate: (s: Screen) => void
}) {
  if (!open) return null

  return (
    <div className="absolute inset-0 z-50">
      <button
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-scale-in"
      />
      <div className="glass-strong animate-slide-in-left absolute inset-y-0 left-0 flex w-[78%] flex-col rounded-r-[36px] p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground wine-glow">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold leading-tight">TaskPilot AI</p>
              <p className="text-xs text-muted-foreground">Pro Workspace</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-muted-foreground active:scale-90"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-8 flex items-center gap-3 rounded-2xl bg-secondary/60 p-3">
          <img
            src="/avatar-woman.png"
            alt="Profile"
            className="h-11 w-11 rounded-full object-cover"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Maya Chen</p>
            <p className="truncate text-xs text-muted-foreground">maya@taskpilot.ai</p>
          </div>
        </div>

        <nav className="mt-6 flex-1 space-y-1 overflow-y-auto no-scrollbar">
          {links.map((l) => {
            const isActive = active === l.screen
            const Icon = l.icon
            return (
              <button
                key={l.label}
                onClick={() => {
                  if (l.screen) onNavigate(l.screen)
                  onClose()
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-colors active:scale-[0.98]",
                  isActive
                    ? "bg-primary/20 text-foreground"
                    : "text-muted-foreground hover:bg-secondary/60",
                )}
              >
                <Icon className={cn("h-[18px] w-[18px]", isActive && "text-primary")} />
                {l.label}
              </button>
            )
          })}

          <div className="my-3 h-px bg-border" />

          {secondary.map((l) => {
            const Icon = l.icon
            return (
              <button
                key={l.label}
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/60 active:scale-[0.98]"
              >
                <Icon className="h-[18px] w-[18px]" />
                {l.label}
              </button>
            )
          })}
        </nav>

        <button className="mt-4 flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 active:scale-[0.98]">
          <LogOut className="h-[18px] w-[18px]" />
          Logout
        </button>
      </div>
    </div>
  )
}
