"use client"

import type { Player } from "@/lib/game-context"
import { TrendingUp, TrendingDown } from "lucide-react"

interface PlayerCardProps {
  player: Player
  isOpponent?: boolean
}

export function PlayerCard({ player, isOpponent = false }: PlayerCardProps) {
  const isProfitable = player.pnl >= 0

  return (
    <div className="bg-card rounded-md">
      {/* Player identity row */}
      <div className="flex items-center gap-2 mb-3">
        <div className="relative">
          <div className="w-10 h-10 rounded overflow-hidden bg-muted">
            <img src={player.avatar || "/placeholder.svg"} alt={player.name} className="w-full h-full object-cover" />
          </div>
          {/* Online indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-card" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">{player.name}</h3>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
            {isOpponent ? "Opponent" : "You"}
          </p>
        </div>
      </div>

      {/* Stats grid - more compact */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-muted/50 rounded px-2 py-1.5">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Balance</p>
          <p className="font-mono text-xs">
            ${player.balance.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="bg-muted/50 rounded px-2 py-1.5">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Positions</p>
          <p className="font-mono text-xs">{player.positions.length}</p>
        </div>
      </div>

      {/* P&L highlight bar */}
      <div className={`mt-2 rounded px-2 py-1.5 ${isProfitable ? "bg-success/10" : "bg-destructive/10"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {isProfitable ? (
              <TrendingUp className="w-3 h-3 text-success" />
            ) : (
              <TrendingDown className="w-3 h-3 text-destructive" />
            )}
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">P&L</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`font-mono text-xs font-medium ${isProfitable ? "text-success" : "text-destructive"}`}>
              {isProfitable ? "+" : ""}${player.pnl.toFixed(2)}
            </span>
            <span className={`font-mono text-[10px] ${isProfitable ? "text-success" : "text-destructive"}`}>
              ({isProfitable ? "+" : ""}
              {player.pnlPercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
