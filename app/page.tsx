"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import dynamic from "next/dynamic"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

// Dynamic import to avoid SSR issues with Three.js
const GridScan = dynamic(() => import("@/components/GridScan"), { 
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-background" />
})

// Custom icons as SVG components for unique feel
const SearchIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.3-4.3"/>
    <path d="M11 8a3 3 0 0 0-3 3"/>
  </svg>
)

const ChartIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18"/>
    <path d="m19 9-5 5-4-4-3 3"/>
    <circle cx="19" cy="9" r="2" fill="currentColor"/>
    <circle cx="14" cy="14" r="2" fill="currentColor"/>
  </svg>
)

const TrophyIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
    <path d="M4 22h16"/>
    <path d="M10 22V8a6 6 0 0 0-6-4h0"/>
    <path d="M14 22V8a6 6 0 0 1 6-4h0"/>
    <path d="M8 22h8"/>
    <path d="M12 17v5"/>
  </svg>
)

function HowItWorksSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const steps = [
    {
      number: "01",
      title: "Find a match",
      description: "Jump into the queue and get matched with a trader at your skill level. Takes seconds, not minutes.",
      icon: <SearchIcon />,
      color: "from-violet-500/20 to-purple-500/20",
      borderColor: "border-violet-500/30"
    },
    {
      number: "02", 
      title: "Trade the same market",
      description: "Same chart, same prices, same volatility. The only difference? Your strategy vs theirs.",
      icon: <ChartIcon />,
      color: "from-emerald-500/20 to-teal-500/20",
      borderColor: "border-emerald-500/30"
    },
    {
      number: "03",
      title: "Best PnL wins",
      description: "When the clock hits zero, highest profit takes the crown. Simple as that.",
      icon: <TrophyIcon />,
      color: "from-amber-500/20 to-orange-500/20",
      borderColor: "border-amber-500/30"
    }
  ]

  return (
    <section ref={containerRef} className="py-32 px-4 border-t border-white/5 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Three steps to glory
          </h2>
          <p className="text-xl text-muted-foreground">
            From queue to victory in minutes
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/50 via-emerald-500/50 to-amber-500/50" />
          
          <div className="space-y-24 md:space-y-32">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-16`}
              >
                {/* Content */}
                <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`inline-block p-8 rounded-2xl bg-gradient-to-br ${step.color} border ${step.borderColor} backdrop-blur-sm`}
                  >
                    <div className={`flex items-center gap-4 mb-4 ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                      <span className="text-4xl font-bold text-muted-foreground/30">{step.number}</span>
                      <div className="p-2 rounded-lg bg-white/5">
                        {step.icon}
                      </div>
                    </div>
                    <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground text-lg max-w-md">
                      {step.description}
                    </p>
                  </motion.div>
                </div>

                {/* Center dot */}
                <motion.div 
                  className="hidden md:flex w-16 h-16 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/20 items-center justify-center z-10"
                  whileInView={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <div className="w-4 h-4 rounded-full bg-white" />
                </motion.div>

                {/* Spacer for alternating layout */}
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-16">
        {/* GridScan Background */}
        <div className="absolute inset-0">
          <GridScan
            sensitivity={0.55}
            lineThickness={1}
            linesColor="#1a1a1a"
            gridScale={0.1}
            scanColor="#ffffff"
            scanOpacity={0.3}
            enablePost={true}
            bloomIntensity={0.4}
            chromaticAberration={0.001}
            noiseIntensity={0.005}
            scanDuration={3}
            scanDelay={1}
          />
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center z-10">
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Trade. Compete.
            <br />
            <span className="bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
              Prove yourself.
            </span>
          </motion.h1>

          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            1v1 trading battles. Same market, different strategies. 
            Highest profit wins. No real money at stake.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <Button size="lg" className="text-base px-8 py-6" asChild>
              <Link href="#">Start your first battle</Link>
            </Button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <HowItWorksSection />

      {/* Value Props */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why traders love it</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Practice without risk",
                description: "Trade with virtual money. Make mistakes, learn from them, and develop your skills without losing a single rupee."
              },
              {
                title: "Competition makes you better",
                description: "Paper trading alone gets boring. Competing against real people pushes you to think faster and trade smarter."
              },
              {
                title: "Real market data",
                description: "Trade on actual live market movements. Your decisions are tested against the same volatility you'd face with real money."
              },
              {
                title: "Track your progress",
                description: "See your win rate, analyze your trades, and watch yourself improve over time. Climb the ranks as you get better."
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-0 bg-transparent hover:bg-white/5 transition-colors">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                    <p className="text-muted-foreground text-lg">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-24 px-4 border-t border-white/5">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Built for everyone who wants to trade better
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Whether you're a college student learning the markets, an experienced trader 
            looking for competition, or just someone who loves the thrill of trading — 
            MockStreet is your arena.
          </p>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 border-t border-white/5">
        <motion.div 
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to find out how good you are?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Free to play. No real money required.
          </p>
          <Button size="lg" className="text-base px-8 py-6" asChild>
            <Link href="#">Create your account</Link>
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 MockStreet
          </p>
        </div>
      </footer>
    </div>
  )
}
