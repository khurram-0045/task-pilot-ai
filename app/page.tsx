"use client"

import { useState } from "react"
import { Sparkles } from "lucide-react"
import type { Screen } from "@/lib/app-data"
import { BottomNav } from "@/components/bottom-nav"
import { SideMenu } from "@/components/side-menu"
import { SplashScreen } from "@/components/screens/splash-screen"
import { DashboardScreen } from "@/components/screens/dashboard-screen"
import { ProjectsScreen } from "@/components/screens/projects-screen"
import { TasksScreen } from "@/components/screens/tasks-screen"
import { AiScreen } from "@/components/screens/ai-screen"
import { VaultScreen } from "@/components/screens/vault-screen"
import { HabitsScreen } from "@/components/screens/habits-screen"
import { AnalyticsScreen } from "@/components/screens/analytics-screen"
import { ProfileScreen } from "@/components/screens/profile-screen"

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-7 pt-3 pb-1 text-xs font-medium text-foreground">
      <span>9:41</span>
      <div className="flex items-center gap-1.5">
        {/* signal */}
        <svg width="17" height="11" viewBox="0 0 17 11" fill="none" aria-hidden="true">
          <rect x="0" y="7" width="3" height="4" rx="1" fill="currentColor" />
          <rect x="4.5" y="5" width="3" height="6" rx="1" fill="currentColor" />
          <rect x="9" y="2.5" width="3" height="8.5" rx="1" fill="currentColor" />
          <rect x="13.5" y="0" width="3" height="11" rx="1" fill="currentColor" opacity="0.4" />
        </svg>
        {/* wifi */}
        <svg width="16" height="11" viewBox="0 0 16 11" fill="none" aria-hidden="true">
          <path
            d="M8 10.5 1 3.5a10 10 0 0 1 14 0L8 10.5Z"
            fill="currentColor"
            opacity="0.9"
          />
        </svg>
        {/* battery */}
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none" aria-hidden="true">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke="currentColor" opacity="0.4" />
          <rect x="2" y="2" width="16" height="8" rx="1.5" fill="currentColor" />
          <rect x="23" y="4" width="1.5" height="4" rx="0.75" fill="currentColor" opacity="0.6" />
        </svg>
      </div>
    </div>
  )
}

export default function Page() {
  const [screen, setScreen] = useState<Screen>("splash")
  const [menuOpen, setMenuOpen] = useState(false)

  const navigate = (s: Screen) => setScreen(s)

  const showChrome = screen !== "splash"

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-neutral-950 p-0 sm:p-6">
      {/* ambient page glow */}
      <div className="pointer-events-none fixed inset-0 hidden sm:block">
        <div className="absolute left-1/2 top-1/4 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/3 h-[360px] w-[360px] rounded-full bg-accent/10 blur-[140px]" />
      </div>

      {/* device frame */}
      <div className="relative z-10 h-[100dvh] w-full max-w-[390px] overflow-hidden bg-background sm:h-[844px] sm:rounded-[46px] sm:border sm:border-white/10 sm:shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] sm:ring-1 sm:ring-black/40">
        {/* notch */}
        {showChrome && (
          <div className="pointer-events-none absolute left-1/2 top-3 z-40 hidden h-6 w-28 -translate-x-1/2 rounded-full bg-black sm:block" />
        )}

        <div className="relative flex h-full flex-col">
          {screen === "splash" ? (
            <SplashScreen onEnter={() => setScreen("dashboard")} />
          ) : (
            <>
              <StatusBar />
              <div className="relative flex-1 overflow-y-auto no-scrollbar pb-28">
                <div key={screen} className="animate-float-up">
                  {screen === "dashboard" && (
                    <DashboardScreen onNavigate={navigate} onMenu={() => setMenuOpen(true)} />
                  )}
                  {screen === "projects" && <ProjectsScreen onMenu={() => setMenuOpen(true)} />}
                  {screen === "tasks" && <TasksScreen onMenu={() => setMenuOpen(true)} />}
                  {screen === "ai" && <AiScreen />}
                  {screen === "vault" && <VaultScreen onMenu={() => setMenuOpen(true)} />}
                  {screen === "habits" && <HabitsScreen onMenu={() => setMenuOpen(true)} />}
                  {screen === "analytics" && <AnalyticsScreen onMenu={() => setMenuOpen(true)} />}
                  {screen === "profile" && <ProfileScreen onMenu={() => setMenuOpen(true)} />}
                </div>
              </div>

              {/* Floating AI button */}
              {screen !== "ai" && (
                <button
                  onClick={() => setScreen("ai")}
                  aria-label="Open AI Assistant"
                  className="animate-pulse-glow absolute bottom-24 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground transition-transform active:scale-90"
                >
                  <Sparkles className="h-6 w-6" />
                </button>
              )}

              <BottomNav active={screen} onNavigate={navigate} />
              <SideMenu
                open={menuOpen}
                active={screen}
                onClose={() => setMenuOpen(false)}
                onNavigate={navigate}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
