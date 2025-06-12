"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, BarChart3 } from "lucide-react"
import { Navbar } from "@/components/navbar"

export default function BattlePage({ params }: { params: { id: string } }) {
  const [timeLeft, setTimeLeft] = useState(745) // 12:25 in seconds
  const [myPnL, setMyPnL] = useState(2340)
  const [opponentPnL, setOpponentPnL] = useState(1890)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const battleData = {
    opponent: {
      name: "Rajesh Kumar",
      avatar: "/placeholder.svg?height=40&width=40",
      level: "Pro",
      winRate: "68%",
      rank: "#24",
    },
    duration: "30 min",
    entryFee: "₹100",
    prize: "₹180",
    startTime: "2:30 PM",
  }

  const myTrades = [
    { time: "2:32", symbol: "NIFTY 19900 CE", type: "BUY", qty: 50, price: 125.5, current: 142.3, pnl: "+₹840" },
    { time: "2:45", symbol: "NIFTY 19800 PE", type: "SELL", qty: 25, price: 89.2, current: 76.8, pnl: "+₹310" },
    { time: "2:52", symbol: "NIFTY 20000 CE", type: "BUY", qty: 75, price: 45.8, current: 52.6, pnl: "+₹510" },
  ]

  const opponentTrades = [
    { time: "2:33", symbol: "NIFTY 19850 CE", type: "BUY", qty: 100, price: 98.5, pnl: "+₹650" },
    { time: "2:41", symbol: "NIFTY 19750 PE", type: "SELL", qty: 50, price: 76.2, pnl: "+₹420" },
    { time: "2:48", symbol: "NIFTY 19900 CE", type: "BUY", qty: 25, price: 135.4, pnl: "+₹180" },
  ]

  const marketData = [
    { symbol: "NIFTY", price: "19,875.50", change: "+125.30", changePercent: "+0.63%" },
    { symbol: "NIFTY 19900 CE", price: "142.30", change: "+16.80", changePercent: "+13.4%" },
    { symbol: "NIFTY 19800 PE", price: "76.80", change: "-12.40", changePercent: "-13.9%" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        {/* Battle Header */}
        <Card className="mb-6 border-2 border-primary">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <Avatar className="w-16 h-16 mx-auto mb-2">
                    <AvatarImage src="/placeholder.svg?height=64&width=64" />
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                  <Badge variant="default">You</Badge>
                </div>

                <div className="text-center px-8">
                  <div className="text-3xl font-bold mb-2">VS</div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {formatTime(timeLeft)}
                  </div>
                </div>

                <div className="text-center">
                  <Avatar className="w-16 h-16 mx-auto mb-2">
                    <AvatarImage src={battleData.opponent.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {battleData.opponent.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <Badge variant="outline">{battleData.opponent.level}</Badge>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-muted-foreground mb-1">Prize Pool</div>
                <div className="text-2xl font-bold text-green-600">{battleData.prize}</div>
                <div className="text-sm text-muted-foreground">Entry: {battleData.entryFee}</div>
              </div>
            </div>

            {/* P&L Comparison */}
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Your P&L</div>
                <div className={`text-3xl font-bold ${myPnL >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {myPnL >= 0 ? "+" : ""}₹{myPnL.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">{((myPnL / 100000) * 100).toFixed(2)}% return</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">{battleData.opponent.name}</div>
                <div className={`text-3xl font-bold ${opponentPnL >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {opponentPnL >= 0 ? "+" : ""}₹{opponentPnL.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">{((opponentPnL / 100000) * 100).toFixed(2)}% return</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Battle Progress</span>
                <span>{Math.round(((30 * 60 - timeLeft) / (30 * 60)) * 100)}%</span>
              </div>
              <Progress value={((30 * 60 - timeLeft) / (30 * 60)) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Trading Interface */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="chart" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="chart">Live Chart</TabsTrigger>
                <TabsTrigger value="trades">Trade History</TabsTrigger>
                <TabsTrigger value="positions">Positions</TabsTrigger>
              </TabsList>

              <TabsContent value="chart">
                <Card className="h-[500px]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      NIFTY Live Chart
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-[400px] flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">TradingView Chart Integration</p>
                      <p className="text-sm text-muted-foreground">Real-time NIFTY data</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="trades">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Trades</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {myTrades.map((trade, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium text-sm">{trade.symbol}</div>
                            <div className="text-xs text-muted-foreground">
                              {trade.type} {trade.qty} @ ₹{trade.price}
                            </div>
                            <div className="text-xs text-muted-foreground">{trade.time}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm">₹{trade.current}</div>
                            <div
                              className={`text-sm font-medium ${trade.pnl.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                            >
                              {trade.pnl}
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>{battleData.opponent.name}'s Trades</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {opponentTrades.map((trade, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium text-sm">{trade.symbol}</div>
                            <div className="text-xs text-muted-foreground">
                              {trade.type} {trade.qty}
                            </div>
                            <div className="text-xs text-muted-foreground">{trade.time}</div>
                          </div>
                          <div
                            className={`text-sm font-medium ${trade.pnl.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                          >
                            {trade.pnl}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="positions">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Positions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {myTrades.map((trade, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{trade.symbol}</div>
                            <div className="text-sm text-muted-foreground">Qty: {trade.qty}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm">Entry: ₹{trade.price}</div>
                            <div className="text-sm">LTP: ₹{trade.current}</div>
                            <div
                              className={`font-medium ${trade.pnl.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                            >
                              {trade.pnl}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Battle Sidebar */}
          <div className="space-y-6">
            {/* Market Data */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Market Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {marketData.map((data, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{data.symbol}</div>
                      <div className="text-lg font-bold">₹{data.price}</div>
                    </div>
                    <div className={`text-right ${data.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                      <div className="text-sm">{data.change}</div>
                      <div className="text-sm">{data.changePercent}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Battle Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Battle Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Your Trades</span>
                  <span className="font-medium">{myTrades.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Opponent Trades</span>
                  <span className="font-medium">{opponentTrades.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Time Remaining</span>
                  <span className="font-medium">{formatTime(timeLeft)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Battle Status</span>
                  <Badge variant={myPnL > opponentPnL ? "default" : "destructive"}>
                    {myPnL > opponentPnL ? "Winning" : "Losing"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  Close All Positions
                </Button>
                <Button className="w-full" variant="outline">
                  View Full Chart
                </Button>
                <Button className="w-full" variant="destructive">
                  Forfeit Battle
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
