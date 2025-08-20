"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Search, Zap, Trophy } from "lucide-react"

interface Player {
  id: string
  name: string
  level: number
  winRate: number
  status: "online" | "in-battle" | "offline"
}

const mockPlayers: Player[] = [
  { id: "1", name: "TraderX", level: 15, winRate: 78, status: "online" },
  { id: "2", name: "BullMaster", level: 12, winRate: 65, status: "online" },
  { id: "3", name: "BearHunter", level: 18, winRate: 82, status: "in-battle" },
  { id: "4", name: "NiftyKing", level: 9, winRate: 71, status: "online" },
  { id: "5", name: "OptionsPro", level: 21, winRate: 89, status: "online" },
]

interface MatchmakingProps {
  onBattleStart: () => void
}

export function Matchmaking({ onBattleStart }: MatchmakingProps) {
  const [isSearching, setIsSearching] = useState(false)
  const [searchProgress, setSearchProgress] = useState(0)
  const [matchFound, setMatchFound] = useState(false)
  const [opponent, setOpponent] = useState<Player | null>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isSearching && !matchFound) {
      interval = setInterval(() => {
        setSearchProgress((prev) => {
          if (prev >= 100) {
            // Simulate finding a match
            const availablePlayers = mockPlayers.filter((p) => p.status === "online")
            const randomOpponent = availablePlayers[Math.floor(Math.random() * availablePlayers.length)]
            setOpponent(randomOpponent)
            setMatchFound(true)
            setIsSearching(false)
            return 100
          }
          return prev + Math.random() * 15
        })
      }, 500)
    }
    return () => clearInterval(interval)
  }, [isSearching, matchFound])

  const handleStartSearch = () => {
    setIsSearching(true)
    setSearchProgress(0)
    setMatchFound(false)
    setOpponent(null)
  }

  const handleCancelSearch = () => {
    setIsSearching(false)
    setSearchProgress(0)
  }

  const handleAcceptBattle = () => {
    onBattleStart()
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      {/* Header */}
      <Card className="bg-black border-white/20 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white text-black rounded-sm flex items-center justify-center font-bold text-lg">
                M
              </div>
              <span className="text-2xl font-bold text-white">MockStreet</span>
              <Badge variant="outline" className="text-white border-white/30">
                MATCHMAKING
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-green-400 border-green-400/30">
              <Users className="w-3 h-3 mr-1" />
              {mockPlayers.filter((p) => p.status === "online").length} ONLINE
            </Badge>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Matchmaking Panel */}
        <Card className="bg-black border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Search className="w-5 h-5 text-blue-400" />
              <span>Find Battle</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isSearching && !matchFound && (
              <div className="text-center space-y-4">
                <div className="text-gray-400">Ready to battle other traders?</div>
                <Button onClick={handleStartSearch} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <Zap className="w-4 h-4 mr-2" />
                  Start Matchmaking
                </Button>
              </div>
            )}

            {isSearching && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-white mb-2">Searching for opponent...</div>
                  <div className="animate-spin w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <Progress value={searchProgress} className="w-full" />
                  <div className="text-gray-400 text-sm mt-2">{Math.round(searchProgress)}% complete</div>
                </div>
                <Button
                  onClick={handleCancelSearch}
                  variant="outline"
                  className="w-full border-white/30 text-white bg-transparent"
                >
                  Cancel Search
                </Button>
              </div>
            )}

            {matchFound && opponent && (
              <div className="space-y-4">
                <div className="text-center text-green-400 font-bold">MATCH FOUND!</div>
                <Card className="bg-gray-900 border-green-500/30 p-4">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback className="bg-blue-600 text-white">{opponent.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                      <div className="text-white font-bold">{opponent.name}</div>
                      <div className="text-gray-400 text-sm">
                        Level {opponent.level} • {opponent.winRate}% Win Rate
                      </div>
                    </div>
                    <Badge variant="outline" className="text-green-400 border-green-400/30">
                      READY
                    </Badge>
                  </div>
                </Card>
                <div className="grid grid-cols-2 gap-2">
                  <Button onClick={handleAcceptBattle} className="bg-green-600 hover:bg-green-700 text-white">
                    <Trophy className="w-4 h-4 mr-2" />
                    Accept
                  </Button>
                  <Button
                    onClick={() => {
                      setMatchFound(false)
                      setOpponent(null)
                    }}
                    variant="outline"
                    className="border-white/30 text-white"
                  >
                    Decline
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Online Players */}
        <Card className="bg-black border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Users className="w-5 h-5 text-green-400" />
              <span>Online Players</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockPlayers.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-900 border border-white/10"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback className="bg-blue-600 text-white">{player.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-white font-medium">{player.name}</div>
                      <div className="text-gray-400 text-sm">
                        Level {player.level} • {player.winRate}% Win Rate
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      player.status === "online"
                        ? "text-green-400 border-green-400/30"
                        : player.status === "in-battle"
                          ? "text-yellow-400 border-yellow-400/30"
                          : "text-gray-400 border-gray-400/30"
                    }
                  >
                    {player.status === "online" ? "ONLINE" : player.status === "in-battle" ? "IN BATTLE" : "OFFLINE"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
