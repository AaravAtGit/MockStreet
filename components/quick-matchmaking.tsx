"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Users, Zap, Target, Clock } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { io, Socket } from "socket.io-client"
import { useAuth } from "@/components/auth-provider"

const API_URL = "https://api.mockstreet.com"

interface QuickMatchmakingProps {
  onBattleStart: (roomId: string, username: string) => void
}

export function QuickMatchmaking({ onBattleStart }: QuickMatchmakingProps) {
  const { user } = useAuth()
  const [isSearching, setIsSearching] = useState(false)
  const [searchTime, setSearchTime] = useState(0)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [matchedPlayer, setMatchedPlayer] = useState<string | null>(null)

  useEffect(() => {
    const newSocket = io(API_URL)
    setSocket(newSocket)

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server')
    })

    newSocket.on('match_found', (data) => {
      setMatchedPlayer(data.opponent)
      toast({
        title: "🎯 Match Found!",
        description: `Matched with ${data.opponent}. Starting battle...`,
      })
      
      setTimeout(() => {
        onBattleStart(data.room_id, user?.name || user?.email || 'Player')
      }, 2000)
    })

    newSocket.on('battle_ready', (data) => {
      onBattleStart(data.room_id, user?.name || user?.email || 'Player')
    })

    return () => {
      newSocket.disconnect()
    }
  }, [user, onBattleStart])

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isSearching) {
      interval = setInterval(() => {
        setSearchTime(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isSearching])

  const checkUserStatus = useCallback(async () => {
    if (!user) return

    try {
      const response = await fetch(`${API_URL}/user/${user.name || user.email}/status`)
      if (response.ok) {
        const data = await response.json()
        if (data.status === 'in_battle') {
          toast({
            title: "🚀 Welcome Back!",
            description: "Redirecting you to your ongoing battle...",
          })
          onBattleStart(data.room_id, user.name || user.email || 'Player')
          return true
        }
      }
    } catch (error) {
      console.error("Failed to check user status:", error)
    }
    return false
  }, [user, onBattleStart])

  const startQuickMatch = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to start a battle.",
        variant: "destructive",
      })
      return
    }

    // Check if user is already in a battle
    const inBattle = await checkUserStatus()
    if (inBattle) return

    setIsSearching(true)
    setSearchTime(0)
    setMatchedPlayer(null)

    try {
      // Try to connect to real API first
      const response = await fetch(`${API_URL}/matchmaking/quick-match`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: user.name || user.email,
          userId: user.id,
        }),
      })

      if (response.ok) {
        // Socket will handle the match found event
        return
      }
    } catch (error) {
      console.log("API not available, using mock matchmaking")
    }

    // Fallback to mock matchmaking for development
    const mockMatchmakingTime = 3000 + Math.random() * 7000 // 3-10 seconds

    setTimeout(() => {
      if (isSearching) {
        const opponent = 'Trader_' + Math.random().toString(36).substr(2, 6)
        const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        
        setMatchedPlayer(opponent)
        toast({
          title: "🎯 Match Found!",
          description: `Matched with ${opponent}. Starting battle...`,
        })
        
        setTimeout(() => {
          onBattleStart(roomId, user?.name || user?.email || 'Player')
        }, 2000)
      }
    }, mockMatchmakingTime)
  }

  const cancelSearch = async () => {
    if (!user) return

    try {
      await fetch(`${API_URL}/matchmaking/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: user.name || user.email,
          userId: user.id,
        }),
      })
    } catch (error) {
      console.error("Failed to cancel matchmaking:", error)
    }

    setIsSearching(false)
    setSearchTime(0)
    setMatchedPlayer(null)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!user) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Authentication Required</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-4">
            Please log in to access battle matchmaking.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* User Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Battle Ready
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{user.name || user.email}</p>
              <p className="text-sm text-muted-foreground">Ready to battle</p>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Online
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Matchmaking Card */}
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <Zap className="h-6 w-6 text-yellow-500" />
            Quick Match
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isSearching && !matchedPlayer && (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    5 min battles
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    1v1 Trading
                  </div>
                </div>
                <p className="text-muted-foreground">
                  Get matched instantly with another trader for a quick 5-minute battle!
                </p>
              </div>
              
              <Button 
                size="lg" 
                onClick={startQuickMatch}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Zap className="h-4 w-4 mr-2" />
                Find Match
              </Button>
            </>
          )}

          {isSearching && !matchedPlayer && (
            <div className="space-y-6">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Finding opponent...</h3>
                  <p className="text-muted-foreground">
                    Searching for another trader to battle
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    <span className="font-mono">{formatTime(searchTime)}</span>
                  </div>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                onClick={cancelSearch}
                className="w-full"
              >
                Cancel Search
              </Button>
            </div>
          )}

          {matchedPlayer && (
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-green-600">Match Found!</h3>
                  <p className="text-muted-foreground">
                    Matched with <strong>{matchedPlayer}</strong>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Preparing battle room...
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
