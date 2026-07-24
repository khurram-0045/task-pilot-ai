"use client"

import { cn } from "@/lib/utils"

export function ProgressRing({
  value,
  size = 72,
  stroke = 7,
  color = "var(--primary)",
  track = "rgba(255,255,255,0.08)",
  children,
}: {
  value: number
  size?: number
  stroke?: number
  color?: string
  track?: string
  children?: React.ReactNode
}) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (value / 100) * c
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.9s cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  )
}

export function LinearProgress({
  value,
  color = "var(--primary)",
  className,
}: {
  value: number
  color?: string
  className?: string
}) {
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-white/8", className)}>
      <div
        className="h-full rounded-full transition-[width] duration-700"
        style={{ width: `${value}%`, backgroundColor: color }}
      />
    </div>
  )
}

const heatColors = [
  "rgba(255,255,255,0.05)",
  "rgba(124,45,79,0.4)",
  "rgba(124,45,79,0.65)",
  "rgba(168,85,247,0.7)",
  "rgba(168,85,247,1)",
]

export function Heatmap({
  data,
  cell = 13,
  gap = 4,
}: {
  data: number[][]
  cell?: number
  gap?: number
}) {
  return (
    <div className="flex" style={{ gap }}>
      {data.map((week, i) => (
        <div key={i} className="flex flex-col" style={{ gap }}>
          {week.map((v, j) => (
            <span
              key={j}
              className="rounded-[3px]"
              style={{
                width: cell,
                height: cell,
                backgroundColor: heatColors[v],
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
