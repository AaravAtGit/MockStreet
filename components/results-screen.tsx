"use client"

import { useGame } from "@/lib/game-context"
import { Button } from "@/components/ui/button"
import { Trophy, TrendingUp, TrendingDown, RotateCcw } from "lucide-react"

export function ResultsScreen() {
  const { player, opponent, gameEndData, playerPosition, resetGame } = useGame()

  if (!opponent) return null

  // Use server-determined winner if available, otherwise fallback to local calculation
  let playerWon = player.pnl > opponent.pnl
  let isDraw = player.pnl === opponent.pnl

  if (gameEndData?.winner) {
    if (gameEndData.winner.tie) {
      isDraw = true
      playerWon = false
    } else if (gameEndData.winner.position) {
      playerWon = gameEndData.winner.position === playerPosition
      isDraw = false
    }
  }

  const winner = playerWon ? player : opponent

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-lg w-full">
        {/* Result Banner */}
        <div className="animate-in fade-in slide-in-from-top-4 duration-700">
          {isDraw ? (
            <div className="text-3xl font-medium text-muted-foreground">Draw</div>
          ) : (
            <div className="space-y-2">
              <div className={`text-4xl font-medium ${playerWon ? "text-success" : "text-destructive"}`}>
                {playerWon ? "Victory" : "Defeat"}
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                <Trophy className="w-4 h-4" />
                <span>{winner.name} wins the duel</span>
              </div>
            </div>
          )}
        </div>

        {/* Players Comparison */}
        <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          {/* Player */}
          <div className={`bg-card border rounded-md p-5 ${playerWon ? "border-foreground" : "border-border"}`}>
            <div className="w-14 h-14 mx-auto rounded-full border-2 border-foreground overflow-hidden mb-3">
              <img src={player.avatar || "/placeholder.svg"} alt={player.name} className="w-full h-full object-cover" />
            </div>
            <h3 className="font-medium">{player.name}</h3>
            <div
              className={`text-xl font-mono font-medium mt-2 ${player.pnl >= 0 ? "text-success" : "text-destructive"}`}
            >
              {player.pnl >= 0 ? "+" : ""}${player.pnl.toFixed(2)}
            </div>
            <div className={`text-xs ${player.pnl >= 0 ? "text-success" : "text-destructive"}`}>
              {player.pnlPercent >= 0 ? "+" : ""}
              {player.pnlPercent.toFixed(2)}%
            </div>
            {player.pnl >= 0 ? (
              <TrendingUp className="w-5 h-5 mx-auto mt-2 text-success" />
            ) : (
              <TrendingDown className="w-5 h-5 mx-auto mt-2 text-destructive" />
            )}
          </div>

          {/* Opponent */}
          <div
            className={`bg-card border rounded-md p-5 ${!playerWon && !isDraw ? "border-muted-foreground" : "border-border"}`}
          >
            <div className="w-14 h-14 mx-auto rounded-full border-2 border-muted-foreground overflow-hidden mb-3">
              <img
                src={opponent.avatar || "/placeholder.svg"}
                alt={opponent.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-medium text-muted-foreground">{opponent.name}</h3>
            <div
              className={`text-xl font-mono font-medium mt-2 ${opponent.pnl >= 0 ? "text-success" : "text-destructive"}`}
            >
              {opponent.pnl >= 0 ? "+" : ""}${opponent.pnl.toFixed(2)}
            </div>
            <div className={`text-xs ${opponent.pnl >= 0 ? "text-success" : "text-destructive"}`}>
              {opponent.pnlPercent >= 0 ? "+" : ""}
              {opponent.pnlPercent.toFixed(2)}%
            </div>
            {opponent.pnl >= 0 ? (
              <TrendingUp className="w-5 h-5 mx-auto mt-2 text-success" />
            ) : (
              <TrendingDown className="w-5 h-5 mx-auto mt-2 text-destructive" />
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <Button
            size="lg"
            onClick={() => resetGame()}
            className="bg-foreground hover:bg-foreground/90 text-background font-medium px-8"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Play Again
          </Button>
        </div>
      </div>
    </div>
  )
}
