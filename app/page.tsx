import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, TrendingUp, Shield, Award, Users, BarChart3, Target, Zap } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"

export default function LandingPage() {
  const pricingTiers = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      description: "Perfect for beginners to start mock trading",
      features: ["Mock trading on NIFTY", "Basic portfolio tracking", "Educational resources", "Community access"],
      popular: false,
      buttonText: "Get Started",
      buttonVariant: "outline" as const,
    },
    {
      name: "Basic",
      price: "₹499",
      period: "month",
      description: "Access to our 4-week challenge program",
      features: [
        "Everything in Free",
        "4-week challenge access",
        "Performance analytics",
        "Risk management tools",
        "Weekly progress reports",
      ],
      popular: true,
      buttonText: "Start Challenge",
      buttonVariant: "default" as const,
    },
    {
      name: "Pro",
      price: "₹999",
      period: "month",
      description: "Advanced tools for serious traders",
      features: [
        "Everything in Basic",
        "Advanced analysis tools",
        "Custom indicators",
        "Market sentiment analysis",
        "Priority support",
      ],
      popular: false,
      buttonText: "Go Pro",
      buttonVariant: "outline" as const,
    },
    {
      name: "Elite",
      price: "₹1,999",
      period: "month",
      description: "Complete trading career development",
      features: [
        "Everything in Pro",
        "Career desk access",
        "1-on-1 mentoring",
        "Job placement assistance",
        "Exclusive trading strategies",
      ],
      popular: false,
      buttonText: "Join Elite",
      buttonVariant: "outline" as const,
    },
  ]

  const features = [
    {
      icon: TrendingUp,
      title: "NIFTY Focused Trading",
      description: "Specialized platform for NIFTY index trading with real-time data and analysis",
    },
    {
      icon: Shield,
      title: "Risk Management",
      description: "Advanced risk controls and position sizing to protect your capital",
    },
    {
      icon: Award,
      title: "Earn Rewards",
      description: "Win Amazon, Swiggy gift cards and other exciting rewards for successful trading",
    },
    {
      icon: Users,
      title: "Community",
      description: "Connect with fellow traders and learn from experienced professionals",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Comprehensive performance tracking and detailed trading analytics",
    },
    {
      icon: Target,
      title: "4-Week Challenge",
      description: "Structured program to develop and test your trading skills progressively",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            <Zap className="w-4 h-4 mr-2" />
            India's Premier Mock Trading Platform
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Master NIFTY Trading,
            <span className="text-primary"> Earn Real Rewards</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Join thousands of traders who are honing their skills on MockStreet. Trade NIFTY with virtual capital,
            complete challenges, and earn exciting rewards including Amazon and Swiggy gift cards.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/login">Start Trading Now</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/challenge">View Challenge Rules</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Our Platform?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to become a successful NIFTY trader
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <feature.icon className="w-12 h-12 text-primary mb-4" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Trading Journey</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From beginner to professional trader - we have the right plan for you
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pricingTiers.map((tier, index) => (
              <Card key={index} className={`relative ${tier.popular ? "border-primary shadow-lg scale-105" : ""}`}>
                {tier.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">Most Popular</Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    <span className="text-muted-foreground">/{tier.period}</span>
                  </div>
                  <CardDescription className="mt-2">{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={tier.buttonVariant} asChild>
                    <Link href="/login">{tier.buttonText}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Trading Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join our community of successful traders and start earning rewards today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/login">Create Account</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/challenge">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 md:px-6 lg:px-8 border-t">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground">© 2024 MockStreet. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
