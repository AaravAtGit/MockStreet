"use client"

import { useGame } from "@/lib/game-context"
import { useEffect, useState } from "react"
import { Swords } from "lucide-react"

export function VersusOverlay() {
  const { player, opponent } = useGame()
  const [animationPhase, setAnimationPhase] = useState<"enter" | "versus" | "exit">("enter")

  useEffect(() => {
    const phases = [
      { phase: "versus" as const, delay: 800 },
      { phase: "exit" as const, delay: 3200 },
    ]

    const timeouts = phases.map(({ phase, delay }) => setTimeout(() => setAnimationPhase(phase), delay))

    return () => timeouts.forEach(clearTimeout)
  }, [])

  if (!opponent) return null

  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center overflow-hidden">
      {/* Subtle animated lines */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-transparent via-border to-transparent" />
        <div className="absolute top-1/2 left-0 w-full h-px bg-border/20" />
      </div>

      <div className="relative flex items-center justify-center gap-8 md:gap-20">
        {/* Player 1 */}
        <div
          className={`flex flex-col items-center transition-all duration-700 ease-out ${
            animationPhase === "enter"
              ? "-translate-x-full opacity-0"
              : animationPhase === "exit"
                ? "-translate-x-8 opacity-0 scale-90"
                : "translate-x-0 opacity-100"
          }`}
        >
          <div className="relative">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-2 border-foreground overflow-hidden bg-card">
              <img src={player.avatar || "/placeholder.svg"} alt={player.name} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-foreground flex items-center justify-center text-background font-mono text-sm">
              1
            </div>
          </div>
          <div className="mt-4 text-center">
            <h3 className="text-lg md:text-xl font-medium text-foreground">{player.name}</h3>
            <p className="text-xs text-muted-foreground mt-1">Win Rate: 68%</p>
          </div>
        </div>

        {/* VS Badge */}
        <div
          className={`relative transition-all duration-500 ${
            animationPhase === "enter"
              ? "scale-0 opacity-0"
              : animationPhase === "exit"
                ? "scale-150 opacity-0"
                : "scale-100 opacity-100"
          }`}
          style={{ transitionDelay: animationPhase === "versus" ? "200ms" : "0ms" }}
        >
          <div className="relative">
            <Swords className="w-12 h-12 md:w-16 md:h-16 text-foreground" />
          </div>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <span className="text-2xl md:text-3xl font-medium tracking-[0.3em] text-foreground">VS</span>
          </div>
        </div>

        {/* Player 2 */}
        <div
          className={`flex flex-col items-center transition-all duration-700 ease-out ${
            animationPhase === "enter"
              ? "translate-x-full opacity-0"
              : animationPhase === "exit"
                ? "translate-x-8 opacity-0 scale-90"
                : "translate-x-0 opacity-100"
          }`}
        >
          <div className="relative">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-2 border-muted-foreground overflow-hidden bg-card">
              <img
                src={opponent.avatar || "/placeholder.svg"}
                alt={opponent.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -left-2 w-7 h-7 rounded-full bg-muted-foreground flex items-center justify-center text-background font-mono text-sm">
              2
            </div>
          </div>
          <div className="mt-4 text-center">
            <h3 className="text-lg md:text-xl font-medium text-muted-foreground">{opponent.name}</h3>
            <p className="text-xs text-muted-foreground mt-1">Win Rate: 72%</p>
          </div>
        </div>
      </div>

      {/* Match info */}
      <div
        className={`absolute bottom-12 left-1/2 -translate-x-1/2 text-center transition-all duration-500 ${
          animationPhase === "versus" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
        style={{ transitionDelay: "400ms" }}
      >
        <div className="bg-card border border-border rounded-md px-6 py-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Trading Pair</p>
          <p className="text-base font-mono font-medium mt-1">BTC/USD</p>
        </div>
      </div>

      {/* Countdown text */}
      <div
        className={`absolute top-12 left-1/2 -translate-x-1/2 transition-all duration-500 ${
          animationPhase === "versus" ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDelay: "600ms" }}
      >
        <p className="text-sm text-muted-foreground animate-pulse uppercase tracking-wider">Get ready to trade</p>
      </div>
    </div>
  )
}
