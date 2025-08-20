import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Zap, Target } from "lucide-react"

interface GameifiedPNLProps {
  label: string
  value: number
  isOpponent?: boolean
  multiplier?: number
  streak?: number
}

export function GameifiedPNL({ label, value, isOpponent = false, multiplier = 1, streak = 0 }: GameifiedPNLProps) {
  const isPositive = value >= 0
  const isWinning = !isOpponent ? value > 0 : value < 0

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        isWinning
          ? "bg-gradient-to-br from-green-900/20 to-black border-green-500/30"
          : "bg-gradient-to-br from-red-900/20 to-black border-red-500/30",
        isWinning && "animate-glow",
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-white flex items-center space-x-2">
          <span>{label}</span>
          {isWinning && <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />}
        </CardTitle>
        <div className="flex items-center space-x-2">
          {streak > 0 && (
            <Badge variant="outline" className="text-xs border-white/30 text-white">
              <Target className="w-3 h-3 mr-1" />
              {streak}x
            </Badge>
          )}
          {multiplier > 1 && (
            <Badge variant="outline" className="text-xs border-yellow-500/50 text-yellow-400">
              {multiplier}x
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <div className={cn("text-3xl font-bold font-mono", isPositive ? "text-green-400" : "text-red-400")}>
            {isPositive ? "+" : ""}
            {value.toLocaleString("en-IN", { style: "currency", currency: "INR" })}
          </div>
          {isPositive ? (
            <TrendingUp className="w-6 h-6 text-green-400" />
          ) : (
            <TrendingDown className="w-6 h-6 text-red-400" />
          )}
        </div>
        <div className="text-xs text-gray-400 mt-1">{isWinning ? "🔥 DOMINATING" : "⚡ FIGHTING BACK"}</div>
      </CardContent>
    </Card>
  )
}
