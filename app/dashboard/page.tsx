import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, DollarSign, Target, BarChart3, Activity, Gift, Swords } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"

export default function Dashboard() {
  const stats = [
    {
      title: "Portfolio Value",
      value: "₹2,45,000",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Today's P&L",
      value: "₹3,250",
      change: "+2.1%",
      trend: "up",
      icon: TrendingUp,
    },
    {
      title: "Win Rate",
      value: "68%",
      change: "+5%",
      trend: "up",
      icon: Target,
    },
    {
      title: "Total Trades",
      value: "147",
      change: "+23",
      trend: "up",
      icon: Activity,
    },
  ]

  const challengeProgress = {
    week: 2,
    totalWeeks: 4,
    progress: 50,
    status: "On Track",
    requirements: [
      { name: "Max Loss/day", target: "₹7,500", current: "₹2,100", status: "pass" },
      { name: "Win Rate", target: "≥ 55%", current: "68%", status: "pass" },
      { name: "Risk:Reward", target: "1:1.2", current: "1:1.8", status: "pass" },
      { name: "Trading Days", target: "4/5", current: "3/5", status: "pending" },
    ],
  }

  const recentTrades = [
    { symbol: "NIFTY", type: "CALL", entry: "19,850", exit: "19,920", pnl: "+₹1,400", time: "10:30 AM" },
    { symbol: "NIFTY", type: "PUT", entry: "19,800", exit: "19,750", pnl: "+₹1,000", time: "11:45 AM" },
    { symbol: "NIFTY", type: "CALL", entry: "19,900", exit: "19,880", pnl: "-₹400", time: "2:15 PM" },
    { symbol: "NIFTY", type: "PUT", entry: "19,750", exit: "19,800", pnl: "-₹1,000", time: "3:20 PM" },
  ]

  const rewards = [
    { name: "Amazon Gift Card", value: "₹500", status: "Available", type: "gift-card" },
    { name: "Swiggy Voucher", value: "₹300", status: "Available", type: "voucher" },
    { name: "Trading Course", value: "₹2,000", status: "Locked", type: "course" },
    { name: "Premium Analysis", value: "₹1,500", status: "Locked", type: "premium" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Trading Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to MockStreet! Here's your trading overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs ${stat.trend === "up" ? "text-green-600" : "text-red-600"} flex items-center`}>
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {stat.change} from yesterday
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Challenge Progress */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      4-Week Challenge Progress
                    </CardTitle>
                    <CardDescription>
                      Week {challengeProgress.week} of {challengeProgress.totalWeeks}
                    </CardDescription>
                  </div>
                  <Badge variant={challengeProgress.status === "On Track" ? "default" : "destructive"}>
                    {challengeProgress.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Progress</span>
                    <span>{challengeProgress.progress}%</span>
                  </div>
                  <Progress value={challengeProgress.progress} className="h-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {challengeProgress.requirements.map((req, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{req.name}</p>
                        <p className="text-xs text-muted-foreground">Target: {req.target}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{req.current}</p>
                        <Badge
                          variant={
                            req.status === "pass" ? "default" : req.status === "pending" ? "secondary" : "destructive"
                          }
                          className="text-xs"
                        >
                          {req.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                <Button className="w-full" asChild>
                  <Link href="/challenge">View Full Challenge Rules</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Add this after the Challenge Progress card and before Recent Trades */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Swords className="h-5 w-5" />
                  Battle Arena
                </CardTitle>
                <CardDescription>Your recent battle performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">12</p>
                    <p className="text-xs text-muted-foreground">Rank</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">73%</p>
                    <p className="text-xs text-muted-foreground">Win Rate</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">1,847</p>
                    <p className="text-xs text-muted-foreground">Points</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <span className="text-sm">vs Rajesh Kumar</span>
                    <Badge variant="default">Won</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <span className="text-sm">vs Priya Sharma</span>
                    <Badge variant="destructive">Lost</Badge>
                  </div>
                </div>

                <Button className="w-full" asChild>
                  <Link href="/battles">Start New Battle</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Trades */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Recent Trades
                </CardTitle>
                <CardDescription>Your latest NIFTY trades</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTrades.map((trade, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{trade.symbol}</Badge>
                        <Badge variant={trade.type === "CALL" ? "default" : "secondary"}>{trade.type}</Badge>
                        <div>
                          <p className="text-sm font-medium">
                            {trade.entry} → {trade.exit}
                          </p>
                          <p className="text-xs text-muted-foreground">{trade.time}</p>
                        </div>
                      </div>
                      <div className={`font-medium ${trade.pnl.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                        {trade.pnl}
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href="/charts">Start Trading</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" asChild>
                  <Link href="/charts">Open Charts</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/challenge">Challenge Rules</Link>
                </Button>
                <Button variant="outline" className="w-full">
                  Download Report
                </Button>
              </CardContent>
            </Card>

            {/* Rewards */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Available Rewards
                </CardTitle>
                <CardDescription>Redeem your trading achievements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {rewards.map((reward, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{reward.name}</p>
                      <p className="text-xs text-muted-foreground">{reward.value}</p>
                    </div>
                    <Badge variant={reward.status === "Available" ? "default" : "secondary"}>{reward.status}</Badge>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  View All Rewards
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
