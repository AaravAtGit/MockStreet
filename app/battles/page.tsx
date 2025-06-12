"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Swords,
  Trophy,
  Clock,
  Target,
  Crown,
  Medal,
  Gift,
  Search,
  Plus,
  Play,
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";

export default function BattlesPage() {
  const [selectedTab, setSelectedTab] = useState("active");

  const activeBattles = [
    {
      id: "1",
      opponent: {
        name: "Rajesh Kumar",
        avatar: "/placeholder.svg?height=40&width=40",
        level: "Pro",
      },
      duration: "30 min",
      timeLeft: "12:45",
      myPnL: "+₹2,340",
      opponentPnL: "+₹1,890",
      status: "winning",
      entryFee: "₹100",
      prize: "₹180",
    },
    {
      id: "2",
      opponent: {
        name: "Priya Sharma",
        avatar: "/placeholder.svg?height=40&width=40",
        level: "Elite",
      },
      duration: "1 hour",
      timeLeft: "23:12",
      myPnL: "-₹450",
      opponentPnL: "+₹780",
      status: "losing",
      entryFee: "₹250",
      prize: "₹450",
    },
  ];

  const availableBattles = [
    {
      id: "3",
      creator: {
        name: "Amit Singh",
        avatar: "/placeholder.svg?height=40&width=40",
        level: "Pro",
        winRate: "68%",
      },
      duration: "30 min",
      entryFee: "₹50",
      prize: "₹90",
      difficulty: "Medium",
    },
    {
      id: "4",
      creator: {
        name: "Sneha Patel",
        avatar: "/placeholder.svg?height=40&width=40",
        level: "Elite",
        winRate: "74%",
      },
      duration: "1 hour",
      entryFee: "₹200",
      prize: "₹360",
      difficulty: "Hard",
    },
    {
      id: "5",
      creator: {
        name: "Vikram Joshi",
        avatar: "/placeholder.svg?height=40&width=40",
        level: "Basic",
        winRate: "52%",
      },
      duration: "15 min",
      entryFee: "₹25",
      prize: "₹45",
      difficulty: "Easy",
    },
  ];

  const leaderboard = [
    {
      rank: 1,
      name: "Arjun Mehta",
      points: 2450,
      battles: 45,
      winRate: "82%",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      rank: 2,
      name: "Kavya Reddy",
      points: 2380,
      battles: 38,
      winRate: "79%",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      rank: 3,
      name: "Rohit Gupta",
      points: 2290,
      battles: 52,
      winRate: "76%",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      rank: 4,
      name: "Anita Desai",
      points: 2180,
      battles: 41,
      winRate: "73%",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      rank: 5,
      name: "Suresh Kumar",
      points: 2120,
      battles: 47,
      winRate: "71%",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      rank: 6,
      name: "Deepika Shah",
      points: 2050,
      battles: 35,
      winRate: "69%",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      rank: 7,
      name: "Manish Agarwal",
      points: 1980,
      battles: 43,
      winRate: "67%",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      rank: 8,
      name: "Pooja Jain",
      points: 1920,
      battles: 39,
      winRate: "65%",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ];

  const rewards = [
    {
      rank: "1st",
      reward: "₹5,000 + Amazon Gift Card",
      icon: Crown,
      color: "text-yellow-500",
    },
    {
      rank: "2nd",
      reward: "₹3,000 + Swiggy Voucher",
      icon: Medal,
      color: "text-gray-400",
    },
    {
      rank: "3rd",
      reward: "₹2,000 + Trading Course",
      icon: Medal,
      color: "text-orange-500",
    },
    {
      rank: "Top 10",
      reward: "₹500 + Premium Access",
      icon: Gift,
      color: "text-blue-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Swords className="h-8 w-8 text-primary" />
            MockStreet Battles
          </h1>
          <p className="text-muted-foreground">
            Challenge friends or compete with traders worldwide on MockStreet's
            battle arena
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Battle Points</p>
                  <p className="text-2xl font-bold">1,847</p>
                </div>
                <Trophy className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Win Rate</p>
                  <p className="text-2xl font-bold">73%</p>
                </div>
                <Target className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Battles</p>
                  <p className="text-2xl font-bold">34</p>
                </div>
                <Swords className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Current Rank</p>
                  <p className="text-2xl font-bold">#12</p>
                </div>
                <Medal className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Battle Area */}
          <div className="lg:col-span-2">
            <Tabs
              value={selectedTab}
              onValueChange={setSelectedTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="active">Active Battles</TabsTrigger>
                <TabsTrigger value="available">Find Battle</TabsTrigger>
                <TabsTrigger value="create">Create Battle</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Play className="h-5 w-5" />
                      Active Battles ({activeBattles.length})
                    </CardTitle>
                    <CardDescription>
                      Your ongoing trading battles
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {activeBattles.map((battle) => (
                      <Card key={battle.id} className="border-2">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage
                                  src={
                                    battle.opponent.avatar || "/placeholder.svg"
                                  }
                                />
                                <AvatarFallback>
                                  {battle.opponent.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {battle.opponent.name}
                                </p>
                                <Badge variant="outline">
                                  {battle.opponent.level}
                                </Badge>
                              </div>
                            </div>
                            <Badge
                              variant={
                                battle.status === "winning"
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {battle.status === "winning"
                                ? "Winning"
                                : "Losing"}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="text-center p-3 bg-muted/50 rounded-lg">
                              <p className="text-sm text-muted-foreground">
                                Your P&L
                              </p>
                              <p
                                className={`text-lg font-bold ${
                                  battle.myPnL.startsWith("+")
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {battle.myPnL}
                              </p>
                            </div>
                            <div className="text-center p-3 bg-muted/50 rounded-lg">
                              <p className="text-sm text-muted-foreground">
                                Opponent P&L
                              </p>
                              <p
                                className={`text-lg font-bold ${
                                  battle.opponentPnL.startsWith("+")
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {battle.opponentPnL}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                Time left: {battle.timeLeft}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Prize: {battle.prize}
                            </div>
                          </div>

                          <Button className="w-full mt-4" asChild>
                            <Link href={`/battles/${battle.id}`}>
                              Continue Battle
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}

                    {activeBattles.length === 0 && (
                      <div className="text-center py-8">
                        <Swords className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          No active battles
                        </p>
                        <Button
                          className="mt-4"
                          onClick={() => setSelectedTab("available")}
                        >
                          Find a Battle
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="available" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      Available Battles
                    </CardTitle>
                    <CardDescription>
                      Join battles created by other traders
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {availableBattles.map((battle) => (
                      <Card key={battle.id} className="border">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage
                                  src={
                                    battle.creator.avatar || "/placeholder.svg"
                                  }
                                />
                                <AvatarFallback>
                                  {battle.creator.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {battle.creator.name}
                                </p>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">
                                    {battle.creator.level}
                                  </Badge>
                                  <span className="text-sm text-muted-foreground">
                                    Win Rate: {battle.creator.winRate}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Badge
                              variant={
                                battle.difficulty === "Easy"
                                  ? "secondary"
                                  : battle.difficulty === "Medium"
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {battle.difficulty}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="text-center">
                              <p className="text-sm text-muted-foreground">
                                Duration
                              </p>
                              <p className="font-medium">{battle.duration}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-muted-foreground">
                                Entry Fee
                              </p>
                              <p className="font-medium">{battle.entryFee}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-muted-foreground">
                                Prize
                              </p>
                              <p className="font-medium text-green-600">
                                {battle.prize}
                              </p>
                            </div>
                          </div>

                          <Button className="w-full">
                            Join Battle - {battle.entryFee}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="create" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      Create New Battle
                    </CardTitle>
                    <CardDescription>
                      Set up a battle and wait for opponents to join
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="duration">Battle Duration</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                            <SelectItem value="120">2 hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="entry-fee">Entry Fee</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select entry fee" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="25">₹25</SelectItem>
                            <SelectItem value="50">₹50</SelectItem>
                            <SelectItem value="100">₹100</SelectItem>
                            <SelectItem value="250">₹250</SelectItem>
                            <SelectItem value="500">₹500</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="battle-type">Battle Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select battle type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">
                            Public (Anyone can join)
                          </SelectItem>
                          <SelectItem value="friends">Friends Only</SelectItem>
                          <SelectItem value="private">
                            Private (Invite code)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="invite-friend">
                        Invite Friend (Optional)
                      </Label>
                      <Input placeholder="Enter friend's username or email" />
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Battle Rules</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>
                          • Both players start with ₹1,00,000 virtual capital
                        </li>
                        <li>• Only NIFTY options and futures allowed</li>
                        <li>• Winner determined by highest P&L percentage</li>
                        <li>• Real-time market data with realistic slippage</li>
                        <li>• Maximum 10 trades per battle</li>
                      </ul>
                    </div>

                    <Button className="w-full">Create Battle</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Leaderboard
                </CardTitle>
                <CardDescription>
                  Top battle warriors this month
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {leaderboard.slice(0, 5).map((player) => (
                  <div
                    key={player.rank}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      {player.rank}
                    </div>
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={player.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {player.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {player.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {player.points} pts
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-green-600">{player.winRate}</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/leaderboard">View Full Leaderboard</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Monthly Rewards */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Monthly Rewards
                </CardTitle>
                <CardDescription>Compete for amazing prizes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {rewards.map((reward, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 border rounded-lg"
                  >
                    <reward.icon className={`h-6 w-6 ${reward.color}`} />
                    <div>
                      <p className="font-medium text-sm">{reward.rank}</p>
                      <p className="text-xs text-muted-foreground">
                        {reward.reward}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>To Next Rank</span>
                    <span>73%</span>
                  </div>
                  <Progress value={73} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    153 points to reach rank #11
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-green-600">25</p>
                    <p className="text-xs text-muted-foreground">Wins</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">9</p>
                    <p className="text-xs text-muted-foreground">Losses</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
