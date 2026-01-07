"use client"

import { useEffect, useState } from "react"
import { useGame } from "@/lib/game-context"
import { Loader2, Search, Clock } from "lucide-react"

export function Matchmaking() {
  const { phase, currentRoom } = useGame()
  const [dots, setDots] = useState("")
  const [searchingText, setSearchingText] = useState("Searching for opponent")

  const isWaiting = phase === "waiting"

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 500)

    const textInterval = setInterval(() => {
      setSearchingText((prev) => {
        if (isWaiting) {
          const texts = ["Waiting for opponent", "Room created", "Searching for challenger", "Almost there"]
          const currentIndex = texts.indexOf(prev)
          return texts[(currentIndex + 1) % texts.length]
        } else {
          const texts = ["Searching for opponent", "Finding worthy challenger", "Matching skill level", "Almost there"]
          const currentIndex = texts.indexOf(prev)
          return texts[(currentIndex + 1) % texts.length]
        }
      })
    }, 2000)

    return () => {
      clearInterval(dotInterval)
      clearInterval(textInterval)
    }
  }, [isWaiting])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-8">
        <div className="relative w-40 h-40 mx-auto">
          <div
            className="absolute inset-0 rounded-full border border-border/30 animate-ping"
            style={{ animationDuration: "2s" }}
          />
          <div
            className="absolute inset-4 rounded-full border border-border/50 animate-ping"
            style={{ animationDuration: "2s", animationDelay: "0.3s" }}
          />
          <div
            className="absolute inset-8 rounded-full border border-border/70 animate-ping"
            style={{ animationDuration: "2s", animationDelay: "0.6s" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-card border border-border flex items-center justify-center">
              {isWaiting ? (
                <Clock className="w-7 h-7 text-foreground animate-pulse" />
              ) : (
                <Search className="w-7 h-7 text-foreground animate-pulse" />
              )}
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h2 className="text-xl font-medium">
            {searchingText}
            {dots}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isWaiting 
              ? "Waiting for another player to join your room" 
              : "This may take a few seconds"}
          </p>
        </div>

        {/* Room info if waiting */}
        {isWaiting && currentRoom && (
          <div className="bg-card border border-border rounded-md p-4 text-sm">
            <div className="text-muted-foreground">Room Created</div>
            <div className="font-mono text-foreground mt-1">{currentRoom.name}</div>
            <div className="text-xs text-muted-foreground mt-2">
              Symbol: <span className="text-foreground">{currentRoom.symbol}</span>
            </div>
          </div>
        )}

        {/* Loading indicator */}
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-xs uppercase tracking-wider">
            {isWaiting ? "Room active - waiting for opponent" : "Connecting to matchmaking server"}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 text-xs text-muted-foreground">
          <div>
            <span className="text-foreground font-mono">2,847</span> players online
          </div>
          <div>
            Avg. wait: <span className="text-foreground font-mono">~15s</span>
          </div>
        </div>
      </div>
    </div>
  )
}
