import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Heart, Shield, Sword, TrendingUp } from "lucide-react"

interface BattleStatsProps {
  playerName: string
  health: number
  accuracy: number
  totalTrades: number
  winRate: number
  isOpponent?: boolean
}

export function BattleStats({
  playerName,
  health,
  accuracy,
  totalTrades,
  winRate,
  isOpponent = false,
}: BattleStatsProps) {
  const healthColor = health > 60 ? "bg-green-500" : health > 30 ? "bg-yellow-500" : "bg-red-500"

  return (
    <Card className="bg-black border-white/20">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-sm font-medium">{isOpponent ? "🎯 OPPONENT" : "⚡ YOU"}</CardTitle>
          <Badge variant={isOpponent ? "destructive" : "default"} className="text-xs">
            {playerName}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1">
              <Heart className="w-3 h-3 text-red-400" />
              <span className="text-white">Health</span>
            </div>
            <span className="text-white font-mono">{health}%</span>
          </div>
          <Progress value={health} className={`h-2 ${healthColor}`} />
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Sword className="w-3 h-3 text-blue-400" />
            </div>
            <div className="text-white font-mono">{accuracy}%</div>
            <div className="text-gray-400">Accuracy</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Shield className="w-3 h-3 text-purple-400" />
            </div>
            <div className="text-white font-mono">{totalTrades}</div>
            <div className="text-gray-400">Trades</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
            </div>
            <div className="text-white font-mono">{winRate}%</div>
            <div className="text-gray-400">Win Rate</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
