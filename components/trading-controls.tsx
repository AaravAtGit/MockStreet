"use client"

import { useState } from "react"
import { useGame } from "@/lib/game-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TrendingUp, TrendingDown, X, Minus, Plus, Loader2, AlertCircle } from "lucide-react"

export function TradingControls() {
  const { player, currentPrice, openPosition, closePosition, error, clearError } = useGame()
  const [lots, setLots] = useState(0.1)
  const [leverage, setLeverage] = useState(10)
  const [activeTab, setActiveTab] = useState<"open" | "closed">("open")
  const [isOpening, setIsOpening] = useState(false)
  const [closingPositionId, setClosingPositionId] = useState<string | null>(null)

  const margin = lots * 1000
  const canTrade = player.balance >= margin && lots >= 0.01 && !isOpening

  const adjustLots = (delta: number) => {
    const newValue = Math.round((lots + delta) * 100) / 100
    if (newValue >= 0.01 && newValue <= 10) {
      setLots(newValue)
    }
  }

  const handleOpenPosition = async (type: "long" | "short") => {
    setIsOpening(true)
    clearError()
    try {
      await openPosition(type, lots, leverage)
    } finally {
      setIsOpening(false)
    }
  }

  const handleClosePosition = async (positionId: string) => {
    setClosingPositionId(positionId)
    clearError()
    try {
      await closePosition(positionId)
    } finally {
      setClosingPositionId(null)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Error display */}
      {error && (
        <div className="flex items-center gap-2 p-2 mb-2 text-xs text-destructive bg-destructive/10 rounded">
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={clearError} className="text-xs hover:underline">×</button>
        </div>
      )}

      {/* Lot & Leverage - more compact */}
      <div className="space-y-3 mb-3">
        <div>
          <div className="flex justify-between text-[10px] mb-1.5">
            <span className="text-muted-foreground uppercase tracking-wider">Lot Size</span>
            <span className="text-muted-foreground font-mono">${margin.toLocaleString()} margin</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 shrink-0 bg-transparent"
              onClick={() => adjustLots(-0.1)}
              disabled={lots <= 0.1 || isOpening}
            >
              <Minus className="w-3 h-3" />
            </Button>
            <Input
              type="number"
              value={lots}
              onChange={(e) => {
                const val = Number.parseFloat(e.target.value)
                if (!isNaN(val) && val >= 0.01 && val <= 10) {
                  setLots(Math.round(val * 100) / 100)
                }
              }}
              step={0.01}
              min={0.01}
              max={10}
              disabled={isOpening}
              className="text-center font-mono h-8 text-sm"
            />
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 shrink-0 bg-transparent"
              onClick={() => adjustLots(0.1)}
              disabled={lots >= 10 || isOpening}
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Leverage - simplified */}
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">Leverage</p>
          <div className="grid grid-cols-5 gap-1">
            {[5, 10, 25, 50, 100].map((lev) => (
              <Button
                key={lev}
                variant={leverage === lev ? "default" : "outline"}
                size="sm"
                className="h-7 text-[10px] font-mono px-0"
                onClick={() => setLeverage(lev)}
                disabled={isOpening}
              >
                {lev}x
              </Button>
            ))}
          </div>
        </div>

        {/* Trade Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => handleOpenPosition("long")}
            disabled={!canTrade}
            className="bg-success hover:bg-success/90 text-success-foreground font-medium h-10
                       transition-all duration-200 active:scale-[0.98]"
          >
            {isOpening ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <TrendingUp className="w-4 h-4 mr-1.5" />
                Long
              </>
            )}
          </Button>
          <Button
            onClick={() => handleOpenPosition("short")}
            disabled={!canTrade}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-medium h-10
                       transition-all duration-200 active:scale-[0.98]"
          >
            {isOpening ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <TrendingDown className="w-4 h-4 mr-1.5" />
                Short
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Positions tabs */}
      <div className="flex-1 flex flex-col min-h-0 border-t border-border pt-2">
        <div className="flex mb-2">
          <button
            onClick={() => setActiveTab("open")}
            className={`flex-1 pb-1.5 text-[10px] font-medium uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === "open"
                ? "text-foreground border-foreground"
                : "text-muted-foreground border-transparent hover:text-foreground"
            }`}
          >
            Open ({player.positions.length})
          </button>
          <button
            onClick={() => setActiveTab("closed")}
            className={`flex-1 pb-1.5 text-[10px] font-medium uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === "closed"
                ? "text-foreground border-foreground"
                : "text-muted-foreground border-transparent hover:text-foreground"
            }`}
          >
            Closed ({player.closedPositions.length})
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1.5">
          {activeTab === "open" ? (
            player.positions.length > 0 ? (
              player.positions.map((pos) => (
                <div key={pos.id} className="bg-muted/30 rounded p-2 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`font-medium px-1 py-0.5 rounded ${
                          pos.type === "long" ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                        }`}
                      >
                        {pos.type === "long" ? "LONG" : "SHORT"}
                      </span>
                      <span className="text-muted-foreground font-mono">
                        {pos.lots} @ {pos.leverage}x
                      </span>
                    </div>
                    <span className={`font-mono ${pos.pnl >= 0 ? "text-success" : "text-destructive"}`}>
                      {pos.pnl >= 0 ? "+" : ""}${pos.pnl.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                    <span>Entry: ${pos.entryPrice.toFixed(2)}</span>
                    <span>Curr: ${pos.currentPrice.toFixed(2)}</span>
                  </div>
                   <div className="flex justify-between items-center mt-1">
                    <span className="text-[9px] text-muted-foreground">{pos.entryTime ? new Date(pos.entryTime).toLocaleTimeString() : '-'}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleClosePosition(pos.id)}
                      disabled={closingPositionId === pos.id}
                      className="h-5 px-2 text-[10px] hover:bg-destructive/20 hover:text-destructive h-auto py-0.5"
                    >
                      {closingPositionId === pos.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        "Close"
                      )}
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[10px] text-muted-foreground text-center py-3">No open positions</p>
            )
          ) : player.closedPositions.length > 0 ? (
            player.closedPositions.map((pos) => (
              <div key={pos.id} className="bg-muted/30 rounded p-2 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`font-medium px-1 py-0.5 rounded ${
                        pos.type === "long" ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                      }`}
                    >
                      {pos.type === "long" ? "LONG" : "SHORT"}
                    </span>
                    <span className="text-muted-foreground font-mono">
                      {pos.lots} @ {pos.leverage}x
                    </span>
                  </div>
                  <span className={`font-mono ${pos.pnl >= 0 ? "text-success" : "text-destructive"}`}>
                    {pos.pnl >= 0 ? "+" : ""}${pos.pnl.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </span>
                </div>
                 <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                    <span>Entry: ${pos.entryPrice.toFixed(2)}</span>
                    <span>Exit: ${pos.exitPrice.toFixed(2)}</span>
                  </div>
                   <div className="flex justify-between text-[9px] text-muted-foreground mt-0.5">
                    <span>{pos.entryTime ? new Date(pos.entryTime).toLocaleTimeString() : '-'}</span>
                    <span>{pos.exitTime ? new Date(pos.exitTime).toLocaleTimeString() : '-'}</span>
                   </div>
              </div>
            ))
          ) : (
            <p className="text-[10px] text-muted-foreground text-center py-3">No closed positions</p>
          )}
        </div>
      </div>
    </div>
  )
}
