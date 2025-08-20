"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Swords,
  Trophy,
  Clock,
  Target,
  Crown,
  Medal,
  Zap,
  Users,
  Play,
  TrendingUp,
  Shield,
  Gamepad2,
} from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/components/auth-provider"
import { toast } from "@/hooks/use-toast"

export default function BattlesPage() {
  const { user } = useAuth()
  const [onlineUsers, setOnlineUsers] = useState(247)
  const [activeBattles, setActiveBattles] = useState(12)

  // Simulate live stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers(prev => prev + Math.floor(Math.random() * 10) - 5)
      setActiveBattles(prev => Math.max(1, prev + Math.floor(Math.random() * 6) - 3))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const userStats = {
    battlePoints: 1847,
    winRate: 73,
    totalBattles: 34,
    currentRank: 12,
    currentStreak: 5,
    todayBattles: 3,
    todayWins: 2,
  }

  const quickStartBattle = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to start a battle.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "🚀 Starting Quick Battle",
      description: "Finding an opponent for you...",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Swords className="h-10 w-10 text-primary" />
            MockStreet Battles
            <Badge variant="outline" className="text-green-500 border-green-500/30 animate-pulse">
              LIVE
            </Badge>
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Real-time trading battles with instant matchmaking
          </p>
          
          {/* Live Stats */}
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>{onlineUsers} traders online</span>
            </div>
            <div className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              <span>{activeBattles} active battles</span>
            </div>
          </div>
        </div>

        {/* Main Battle Card */}
        <div className="mb-12">
          <Card className="bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-green-900/20 border-purple-500/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-2xl flex items-center gap-3">
                <Zap className="h-8 w-8 text-yellow-400" />
                Quick Battle Arena
                <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                  INSTANT MATCH
                </Badge>
              </CardTitle>
              <CardDescription className="text-lg">
                Get matched with a trader in seconds and start your 5-minute battle
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">How it works:</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                        1
                      </div>
                      <span>Click "Start Battle" and get matched instantly</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                        2
                      </div>
                      <span>Trade NIFTY options in real-time for 5 minutes</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                        3
                      </div>
                      <span>Highest P&L wins the battle!</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <Shield className="h-4 w-4" />
                      <span>Virtual money - No real risk</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <Target className="h-4 w-4" />
                      <span>Real market data and prices</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-purple-600">
                      <Gamepad2 className="h-4 w-4" />
                      <span>Gaming-style interface with live chat</span>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="mb-6">
                    <div className="text-3xl font-bold mb-2">₹1,00,000</div>
                    <div className="text-muted-foreground">Starting virtual capital</div>
                  </div>
                  
                  <Button 
                    size="lg" 
                    className="text-lg px-8 py-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all"
                    asChild
                  >
                    <Link href="/battles/room/matchmaking">
                      <Zap className="h-6 w-6 mr-2" />
                      Start Battle Now
                    </Link>
                  </Button>
                  
                  <p className="text-xs text-muted-foreground mt-3">
                    Average wait time: 3-8 seconds
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Stats */}
          <div className="lg:col-span-2 space-y-6">
            {user ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-primary" />
                      Your Battle Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{userStats.battlePoints.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Battle Points</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{userStats.winRate}%</div>
                        <div className="text-sm text-muted-foreground">Win Rate</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">#{userStats.currentRank}</div>
                        <div className="text-sm text-muted-foreground">Current Rank</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{userStats.currentStreak}</div>
                        <div className="text-sm text-muted-foreground">Win Streak</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Today's Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Battles Played</span>
                        <span className="font-bold">{userStats.todayBattles}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Battles Won</span>
                        <span className="font-bold text-green-600">{userStats.todayWins}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Win Rate Today</span>
                        <span className="font-bold">{Math.round((userStats.todayWins / userStats.todayBattles) * 100)}%</span>
                      </div>
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Daily Progress</span>
                          <span>{userStats.todayWins}/{userStats.todayBattles}</span>
                        </div>
                        <Progress value={(userStats.todayWins / userStats.todayBattles) * 100} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Join MockStreet Battles</CardTitle>
                </CardHeader>
                <CardContent className="text-center py-8">
                  <div className="space-y-4">
                    <div className="text-muted-foreground">
                      Sign in to track your battle stats and compete on the leaderboard
                    </div>
                    <Button asChild>
                      <Link href="/login">
                        Sign In to Battle
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Leaderboard & Rewards */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  Top Battlers
                </CardTitle>
                <CardDescription>This week's champions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "TradingKing", points: 12450, battles: 156, rank: 1 },
                    { name: "OptionsMaster", points: 11230, battles: 142, rank: 2 },
                    { name: "BullishBear", points: 10890, battles: 134, rank: 3 },
                    { name: "NiftyNinja", points: 9670, battles: 128, rank: 4 },
                    { name: "QuickTrader", points: 8940, battles: 119, rank: 5 },
                  ].map((player) => (
                    <div key={player.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        player.rank === 1 ? 'bg-yellow-500 text-white' :
                        player.rank === 2 ? 'bg-gray-400 text-white' :
                        player.rank === 3 ? 'bg-orange-500 text-white' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {player.rank}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{player.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {player.points.toLocaleString()} pts • {player.battles} battles
                        </div>
                      </div>
                      {player.rank <= 3 && (
                        <Medal className={`h-4 w-4 ${
                          player.rank === 1 ? 'text-yellow-500' :
                          player.rank === 2 ? 'text-gray-400' :
                          'text-orange-500'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href="/leaderboard">View Full Leaderboard</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Rewards
                </CardTitle>
                <CardDescription>Battle your way to prizes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium">1st Place</span>
                    </div>
                    <span className="text-sm font-bold">₹5,000</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Medal className="h-4 w-4 text-gray-600" />
                      <span className="font-medium">2nd Place</span>
                    </div>
                    <span className="text-sm font-bold">₹3,000</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Medal className="h-4 w-4 text-orange-600" />
                      <span className="font-medium">3rd Place</span>
                    </div>
                    <span className="text-sm font-bold">₹2,000</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-3 text-center">
                  Weekly rewards • Next payout in 3 days
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
