"use client"

import { useGame } from "@/lib/game-context"

export function GameTimer() {
  const { timeRemaining } = useGame()

  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60

  const isLowTime = timeRemaining < 60

  return (
    <div className="flex items-center justify-center">
      <div
        className={`px-4 py-1.5 rounded font-mono text-lg font-semibold tracking-wider transition-colors ${
          isLowTime ? "bg-destructive/20 text-destructive" : "bg-muted text-foreground"
        }`}
      >
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </div>
    </div>
  )
}
