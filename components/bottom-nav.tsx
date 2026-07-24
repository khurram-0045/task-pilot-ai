"use client"

import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Sparkles,
  Vault,
  BarChart3,
  User,
} from "lucide-react"
import type { Screen } from "@/lib/app-data"
import { cn } from "@/lib/utils"

const items: { screen: Screen; label: string; icon: typeof LayoutDashboard }[] = [
  { screen: "dashboard", label: "Home", icon: LayoutDashboard },
  { screen: "projects", label: "Projects", icon: FolderKanban },
  { screen: "tasks", label: "Tasks", icon: CheckSquare },
  { screen: "ai", label: "AI", icon: Sparkles },
  { screen: "vault", label: "Vault", icon: Vault },
  { screen: "analytics", label: "Stats", icon: BarChart3 },
  { screen: "habits", label: "Habits", icon: User },
]

export function BottomNav({
  active,
  onNavigate,
}: {
  active: Screen
  onNavigate: (s: Screen) => void
}) {
  return (
    <nav className="glass-strong absolute inset-x-0 bottom-0 z-30 rounded-b-[42px] px-2 pb-5 pt-2">
      <div className="flex items-end justify-between">
        {items.map((item) => {
          const isActive = active === item.screen
          const isAi = item.screen === "ai"
          const Icon = item.icon

          if (isAi) {
            return (
              <button
                key={item.screen}
                onClick={() => onNavigate(item.screen)}
                className="flex flex-1 flex-col items-center gap-1"
                aria-label={item.label}
              >
                <span
                  className={cn(
                    "-mt-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground transition-transform active:scale-90",
                    "animate-pulse-glow",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span
                  className={cn(
                    "text-[9px] font-medium",
                    isActive ? "text-accent" : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </span>
              </button>
            )
          }

          return (
            <button
              key={item.screen}
              onClick={() => onNavigate(item.screen)}
              className="flex flex-1 flex-col items-center gap-1 py-1.5 transition-transform active:scale-90"
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                className={cn(
                  "h-[18px] w-[18px] transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground",
                )}
              />
              <span
                className={cn(
                  "text-[9px] font-medium transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {item.label}
              </span>
              <span
                className={cn(
                  "h-1 w-1 rounded-full transition-all",
                  isActive ? "bg-primary" : "bg-transparent",
                )}
              />
            </button>
          )
        })}
      </div>
    </nav>
  )
}
