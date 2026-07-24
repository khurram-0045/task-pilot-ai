"use client"

import { Sparkles } from "lucide-react"

export function SplashScreen({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="relative flex h-full flex-col items-center justify-between overflow-hidden bg-background px-8 py-16">
      {/* ambient glow */}
      <div className="pointer-events-none absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/25 blur-[90px]" />
      <div className="pointer-events-none absolute bottom-10 right-0 h-56 w-56 rounded-full bg-accent/20 blur-[90px]" />

      <div className="flex-1" />

      <div className="relative z-10 flex flex-col items-center text-center animate-float-up">
        <span className="animate-pulse-glow flex h-24 w-24 items-center justify-center rounded-[28px] bg-gradient-to-br from-primary to-accent">
          <Sparkles className="h-11 w-11 text-primary-foreground" />
        </span>
        <h1 className="mt-8 text-3xl font-semibold tracking-tight text-balance">TaskPilot AI</h1>
        <p className="mt-3 max-w-[15rem] text-pretty text-sm leading-relaxed text-muted-foreground">
          Your AI Productivity Workspace
        </p>
      </div>

      <div className="relative z-10 flex w-full flex-col items-center gap-6">
        <button
          onClick={onEnter}
          className="wine-glow w-full rounded-2xl bg-primary py-4 text-sm font-semibold text-primary-foreground transition-transform active:scale-95"
        >
          Get Started
        </button>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-6 rounded-full bg-primary" />
          <span className="h-1.5 w-1.5 rounded-full bg-muted" />
          <span className="h-1.5 w-1.5 rounded-full bg-muted" />
        </div>
      </div>
    </div>
  )
}
