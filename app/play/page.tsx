"use client"

import { GameProvider, useGame } from "@/lib/game-context"
import { Lobby } from "@/components/lobby"
import { Matchmaking } from "@/components/matchmaking"
import { VersusOverlay } from "@/components/versus-overlay"
import { TradingArena } from "@/components/trading-arena"
import { ResultsScreen } from "@/components/results-screen"

function GameContent() {
  const { phase } = useGame()

  switch (phase) {
    case "lobby":
      return <Lobby />
    case "matchmaking":
    case "waiting":
      return <Matchmaking />
    case "versus":
      return <VersusOverlay />
    case "trading":
      return <TradingArena />
    case "results":
      return <ResultsScreen />
    default:
      return <Lobby />
  }
}

export default function PlayPage() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  )
}
