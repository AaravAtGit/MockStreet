import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Target, Calendar, TrendingUp, Shield, Award, CheckCircle, AlertTriangle, Info } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"

export default function ChallengePage() {
  const weeks = [
    {
      week: 1,
      title: "Foundation Week",
      description: "Build your trading foundation with basic risk management",
      requirements: [
        { metric: "Max Loss/day", target: "₹5,000", icon: Shield },
        { metric: "Max Position", target: "2 lots", icon: Target },
        { metric: "Required", target: "At least 3 trading days out of 5", icon: Calendar },
      ],
      focus: "Risk Management & Consistency",
      color: "bg-blue-500",
    },
    {
      week: 2,
      title: "Performance Week",
      description: "Focus on win rate and risk-reward optimization",
      requirements: [
        { metric: "Max Loss/day", target: "₹7,500", icon: Shield },
        { metric: "Win rate", target: "≥ 55%", icon: TrendingUp },
        { metric: "Risk:Reward", target: "Minimum 1:1.2", icon: Target },
        { metric: "Required", target: "Trade 4/5 days", icon: Calendar },
      ],
      focus: "Win Rate & Risk-Reward Optimization",
      color: "bg-green-500",
    },
    {
      week: 3,
      title: "Advanced Week",
      description: "Handle larger positions and manage drawdowns",
      requirements: [
        { metric: "Max Weekly DD", target: "₹15,000", icon: Shield },
        { metric: "Drawdown Recovery", target: "Must recover 50%+", icon: TrendingUp },
        { metric: "Max Position", target: "4 lots", icon: Target },
      ],
      focus: "Drawdown Management & Recovery",
      color: "bg-orange-500",
    },
    {
      week: 4,
      title: "Professional Week",
      description: "Trade like a professional with discipline and documentation",
      requirements: [
        { metric: "Journal entries", target: "Required per trade", icon: Info },
        { metric: "Max trades/day", target: "5", icon: Target },
        { metric: "Slippage sim.", target: "Applied (2–3 points)", icon: AlertTriangle },
      ],
      focus: "Professional Trading Discipline",
      color: "bg-purple-500",
    },
  ]

  const rules = [
    {
      title: "General Rules",
      items: [
        "All trading must be done during market hours (9:15 AM - 3:30 PM IST)",
        "Only NIFTY index options and futures are allowed",
        "Virtual capital starts at ₹2,00,000 for all participants",
        "Real-time market data and realistic slippage will be applied",
        "Weekend gap analysis and risk assessment required",
      ],
    },
    {
      title: "Progression Requirements",
      items: [
        "Must complete each week successfully to progress to the next",
        "Failure in any week requires restart from Week 1",
        "All metrics must be met simultaneously within the week",
        "Trading journal must be maintained throughout the challenge",
        "Weekly review sessions are mandatory",
      ],
    },
    {
      title: "Rewards & Recognition",
      items: [
        "Week 1 completion: ₹100 Amazon gift card",
        "Week 2 completion: ₹200 Swiggy voucher",
        "Week 3 completion: ₹500 trading course access",
        "Week 4 completion: ₹1000 cash reward + Certificate",
        "Top 10 performers get additional bonus rewards",
      ],
    },
    {
      title: "Disqualification Criteria",
      items: [
        "Exceeding maximum daily loss limits",
        "Trading outside permitted instruments",
        "Missing required trading days",
        "Failure to maintain trading journal",
        "Violation of position size limits",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">MockStreet 4-Week Trading Challenge</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A comprehensive program designed to develop your NIFTY trading skills progressively on MockStreet. Complete
            all four weeks to earn rewards and prove your trading competency.
          </p>
        </div>

        {/* Challenge Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-6 w-6" />
              Challenge Overview
            </CardTitle>
            <CardDescription>Progressive difficulty with increasing rewards and responsibilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary">4</div>
                <div className="text-sm text-muted-foreground">Weeks</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary">₹2L</div>
                <div className="text-sm text-muted-foreground">Virtual Capital</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary">₹1.8L+</div>
                <div className="text-sm text-muted-foreground">Total Rewards</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary">NIFTY</div>
                <div className="text-sm text-muted-foreground">Focus</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Breakdown */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Weekly Breakdown</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {weeks.map((week, index) => (
              <Card key={index} className="relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-1 h-full ${week.color}`} />
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      Week {week.week}: {week.title}
                    </CardTitle>
                    <Badge variant="outline">Week {week.week}</Badge>
                  </div>
                  <CardDescription>{week.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {week.requirements.map((req, reqIndex) => (
                      <div key={reqIndex} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <req.icon className="h-5 w-5 text-primary" />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{req.metric}</div>
                          <div className="text-sm text-muted-foreground">{req.target}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 border-t">
                    <div className="text-sm font-medium text-primary">{week.focus}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Rules and Guidelines */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Rules & Guidelines</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {rules.map((section, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="text-center">
          <CardContent className="pt-6">
            <h3 className="text-2xl font-bold mb-4">Ready to Start the Challenge?</h3>
            <p className="text-muted-foreground mb-6">
              Join hundreds of traders who have successfully completed MockStreet's 4-week program
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/login">Start Challenge Now</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/dashboard">View Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
