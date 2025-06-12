import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Medal, Crown, TrendingUp, Target, Zap, Gift } from "lucide-react"
import { Navbar } from "@/components/navbar"

export default function LeaderboardPage() {
  const monthlyLeaderboard = [
    {
      rank: 1,
      name: "Arjun Mehta",
      points: 2450,
      battles: 45,
      winRate: "82%",
      avatar: "/placeholder.svg?height=40&width=40",
      tier: "Elite",
      streak: 8,
    },
    {
      rank: 2,
      name: "Kavya Reddy",
      points: 2380,
      battles: 38,
      winRate: "79%",
      avatar: "/placeholder.svg?height=40&width=40",
      tier: "Pro",
      streak: 5,
    },
    {
      rank: 3,
      name: "Rohit Gupta",
      points: 2290,
      battles: 52,
      winRate: "76%",
      avatar: "/placeholder.svg?height=40&width=40",
      tier: "Pro",
      streak: 3,
    },
    {
      rank: 4,
      name: "Anita Desai",
      points: 2180,
      battles: 41,
      winRate: "73%",
      avatar: "/placeholder.svg?height=40&width=40",
      tier: "Pro",
      streak: 2,
    },
    {
      rank: 5,
      name: "Suresh Kumar",
      points: 2120,
      battles: 47,
      winRate: "71%",
      avatar: "/placeholder.svg?height=40&width=40",
      tier: "Basic",
      streak: 4,
    },
    {
      rank: 6,
      name: "Deepika Shah",
      points: 2050,
      battles: 35,
      winRate: "69%",
      avatar: "/placeholder.svg?height=40&width=40",
      tier: "Pro",
      streak: 1,
    },
    {
      rank: 7,
      name: "Manish Agarwal",
      points: 1980,
      battles: 43,
      winRate: "67%",
      avatar: "/placeholder.svg?height=40&width=40",
      tier: "Basic",
      streak: 6,
    },
    {
      rank: 8,
      name: "Pooja Jain",
      points: 1920,
      battles: 39,
      winRate: "65%",
      avatar: "/placeholder.svg?height=40&width=40",
      tier: "Basic",
      streak: 2,
    },
    {
      rank: 9,
      name: "Vikram Singh",
      points: 1880,
      battles: 33,
      winRate: "64%",
      avatar: "/placeholder.svg?height=40&width=40",
      tier: "Basic",
      streak: 1,
    },
    {
      rank: 10,
      name: "Priya Sharma",
      points: 1850,
      battles: 41,
      winRate: "63%",
      avatar: "/placeholder.svg?height=40&width=40",
      tier: "Pro",
      streak: 3,
    },
    {
      rank: 11,
      name: "Amit Patel",
      points: 1820,
      battles: 37,
      winRate: "62%",
      avatar: "/placeholder.svg?height=40&width=40",
      tier: "Basic",
      streak: 2,
    },
    {
      rank: 12,
      name: "Neha Gupta",
      points: 1790,
      battles: 44,
      winRate: "61%",
      avatar: "/placeholder.svg?height=40&width=40",
      tier: "Basic",
      streak: 1,
    },
  ]

  const weeklyLeaderboard = [
    {
      rank: 1,
      name: "Kavya Reddy",
      points: 450,
      battles: 8,
      winRate: "88%",
      avatar: "/placeholder.svg?height=40&width=40",
      tier: "Pro",
    },
    {
      rank: 2,
      name: "Arjun Mehta",
      points: 420,
      battles: 6,
      winRate: "83%",
      avatar: "/placeholder.svg?height=40&width=40",
      tier: "Elite",
    },
    {
      rank: 3,
      name: "Vikram Singh",
      points: 380,
      battles: 9,
      winRate: "78%",
      avatar: "/placeholder.svg?height=40&width=40",
      tier: "Basic",
    },
  ]

  const rewards = [
    { rank: "1st Place", reward: "₹5,000 Cash + Amazon Gift Card ₹2,000", icon: Crown, color: "text-yellow-500" },
    { rank: "2nd Place", reward: "₹3,000 Cash + Swiggy Voucher ₹1,500", icon: Medal, color: "text-gray-400" },
    { rank: "3rd Place", reward: "₹2,000 Cash + Trading Course Access", icon: Medal, color: "text-orange-500" },
    { rank: "4th-10th", reward: "₹500 Cash + Premium Features", icon: Trophy, color: "text-blue-500" },
    { rank: "11th-25th", reward: "₹200 Trading Credits", icon: Gift, color: "text-green-500" },
  ]

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />
    if (rank === 3) return <Medal className="h-5 w-5 text-orange-500" />
    return <Trophy className="h-4 w-4 text-muted-foreground" />
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Elite":
        return "bg-purple-500"
      case "Pro":
        return "bg-blue-500"
      case "Basic":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Trophy className="h-8 w-8 text-primary" />
            MockStreet Leaderboard
          </h1>
          <p className="text-muted-foreground">Compete with the best traders and climb the ranks</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Leaderboard */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="monthly" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="alltime">All Time</TabsTrigger>
              </TabsList>

              <TabsContent value="monthly">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5" />
                      Monthly Leaderboard
                    </CardTitle>
                    <CardDescription>Top performers this month - compete for amazing rewards!</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Top 3 Podium */}
                    <div className="grid grid-cols-3 gap-4 mb-8 p-6 bg-muted/50 rounded-lg">
                      {monthlyLeaderboard.slice(0, 3).map((player, index) => (
                        <div
                          key={player.rank}
                          className={`text-center ${index === 0 ? "order-2" : index === 1 ? "order-1" : "order-3"}`}
                        >
                          <div className={`relative ${index === 0 ? "scale-110" : ""}`}>
                            <Avatar
                              className={`w-16 h-16 mx-auto mb-2 ${index === 0 ? "ring-4 ring-yellow-500" : index === 1 ? "ring-2 ring-gray-400" : "ring-2 ring-orange-500"}`}
                            >
                              <AvatarImage src={player.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {player.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute -top-2 -right-2">{getRankIcon(player.rank)}</div>
                          </div>
                          <h3 className="font-bold text-sm">{player.name}</h3>
                          <p className="text-2xl font-bold text-primary">{player.points}</p>
                          <p className="text-xs text-muted-foreground">{player.winRate} win rate</p>
                          <Badge variant="outline" className={`mt-1 ${getTierColor(player.tier)} text-white`}>
                            {player.tier}
                          </Badge>
                        </div>
                      ))}
                    </div>

                    {/* Rest of the leaderboard */}
                    <div className="space-y-2">
                      {monthlyLeaderboard.slice(3).map((player) => (
                        <div
                          key={player.rank}
                          className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted text-sm font-bold">
                            #{player.rank}
                          </div>

                          <Avatar className="w-10 h-10">
                            <AvatarImage src={player.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {player.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{player.name}</h3>
                              <Badge variant="outline" className={`${getTierColor(player.tier)} text-white text-xs`}>
                                {player.tier}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {player.battles} battles • {player.winRate} win rate
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-lg font-bold text-primary">{player.points}</p>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Zap className="h-3 w-3" />
                              {player.streak} streak
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="weekly">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Weekly Leaderboard
                    </CardTitle>
                    <CardDescription>This week's top performers</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {weeklyLeaderboard.map((player) => (
                      <div key={player.rank} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                          #{player.rank}
                        </div>

                        <Avatar className="w-10 h-10">
                          <AvatarImage src={player.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {player.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{player.name}</h3>
                            <Badge variant="outline" className={`${getTierColor(player.tier)} text-white text-xs`}>
                              {player.tier}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {player.battles} battles • {player.winRate} win rate
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-bold text-primary">{player.points}</p>
                          <p className="text-sm text-muted-foreground">points</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="alltime">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="h-5 w-5" />
                      All Time Legends
                    </CardTitle>
                    <CardDescription>The greatest traders of all time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">All-time leaderboard coming soon!</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Your Rank */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Your Rank
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">#12</div>
                <p className="text-muted-foreground mb-4">1,847 points</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Battles Won</span>
                    <span className="font-medium">25</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Win Rate</span>
                    <span className="font-medium text-green-600">73%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Streak</span>
                    <span className="font-medium">4</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Rewards */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Monthly Rewards
                </CardTitle>
                <CardDescription>What you can win this month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {rewards.map((reward, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    <reward.icon className={`h-5 w-5 mt-0.5 ${reward.color}`} />
                    <div>
                      <p className="font-medium text-sm">{reward.rank}</p>
                      <p className="text-xs text-muted-foreground">{reward.reward}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Battle Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Battle Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">34</div>
                  <div className="text-sm text-muted-foreground">Total Battles</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-green-600">25</div>
                    <div className="text-xs text-muted-foreground">Wins</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-red-600">9</div>
                    <div className="text-xs text-muted-foreground">Losses</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">₹12,450</div>
                  <div className="text-sm text-muted-foreground">Total Winnings</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
