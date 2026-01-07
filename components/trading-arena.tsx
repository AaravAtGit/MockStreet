"use client"

import dynamic from "next/dynamic"
import { useGame } from "@/lib/game-context"
import { PlayerCard } from "@/components/player-card"
import { TradingControls } from "@/components/trading-controls"
import { ChatBox } from "@/components/chat-box"
import { GameTimer } from "@/components/game-timer"

const TradingChart = dynamic(() => import("@/components/trading-chart").then((mod) => mod.TradingChart), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#131313]">
      <div className="text-muted-foreground text-sm">Loading chart...</div>
    </div>
  ),
})

export function TradingArena() {
  const { player, opponent, tradingPair, currentPrice } = useGame()

  if (!opponent) return null

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header - chess.com style */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-border bg-card">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-sm font-semibold">Trading Duel</span>
          <div className="flex items-center gap-2 px-2 py-0.5 bg-muted rounded">
            <span className="text-xs font-mono">{tradingPair}</span>
            <span className="text-xs text-muted-foreground">|</span>
            <span className="text-xs font-mono font-medium">${currentPrice.toLocaleString()}</span>
          </div>
        </div>
        <GameTimer />
        <div className="flex-1" />
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - You */}
        <div className="w-64 xl:w-72 border-r border-border flex flex-col bg-card/50">
          <div className="p-3 border-b border-border">
            <PlayerCard player={player} />
          </div>
          <div className="flex-1 p-3 overflow-hidden flex flex-col">
            <TradingControls />
          </div>
        </div>

        {/* Center - Chart */}
        <div className="flex-1 min-w-0">
          <TradingChart />
        </div>

        {/* Right Panel - Opponent */}
        <div className="w-64 xl:w-72 border-l border-border flex flex-col bg-card/50">
          <div className="p-3 border-b border-border">
            <PlayerCard player={opponent} isOpponent />
          </div>
          <div className="flex-1 p-3 overflow-hidden flex flex-col">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Match Chat</p>
            <ChatBox />
          </div>
        </div>
      </div>
    </div>
  )
}
