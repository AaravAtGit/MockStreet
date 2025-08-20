import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, Zap, Target, Clock, X } from "lucide-react"

interface MockStreetHeaderProps {
  battleTime: string
  userLevel: number
  userStreak: number
  onExit?: () => void
}

export function MockStreetHeader({ battleTime, userLevel, userStreak, onExit }: MockStreetHeaderProps) {
  return (
    <Card className="bg-black border-white/20 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-14 h-14 rounded-md flex items-center justify-center">
              <img src="/placeholder-logo.svg" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-2xl font-bold text-white">MockStreet</span>
            <Badge variant="outline" className="text-white border-white/30">
              BATTLE MODE
            </Badge>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-white">
            <Clock className="w-4 h-4" />
            <span className="font-mono text-lg">{battleTime}</span>
          </div>

          <div className="flex items-center space-x-2 text-white">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span>Level {userLevel}</span>
          </div>

          <div className="flex items-center space-x-2 text-white">
            <Zap className="w-4 h-4 text-blue-400" />
            <span>{userStreak} Streak</span>
          </div>

          <div className="flex items-center space-x-2 text-white">
            <Target className="w-4 h-4 text-green-400" />
            <span className="animate-pulse">LIVE</span>
          </div>

          {onExit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onExit}
              className="text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
              Exit Battle
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
