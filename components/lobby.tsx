"use client"

import { useGame } from "@/lib/game-context"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Swords, AlertCircle, Loader2, ChevronDown } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel
} from "@/components/ui/select"

export function Lobby() {
  const { 
    startMatchmaking, 
    isLoading, 
    error, 
    clearError, 
    tradingPair, 
    setTradingPair,
    matchDuration,
    setMatchDuration,
    tickers
  } = useGame()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  const handleFindMatch = async () => {
    await startMatchmaking()
  }

  // Simplified ticker categorization for the UI
  const getTickerInfo = (symbol: string) => {
    if (symbol.endsWith("-USD") || symbol.endsWith("USD")) return { type: "Crypto", label: symbol }
    if (symbol.startsWith("^") || symbol.includes("X")) return { type: "Index/FX", label: symbol }
    if (symbol.includes(".NS")) return { type: "NSE", label: symbol.split(".")[0] }
    return { type: "Stock", label: symbol }
  }

  // Group tickers by type
  const groupedTickers = tickers.reduce((acc, ticker) => {
    const info = getTickerInfo(ticker)
    if (!acc[info.type]) {
      acc[info.type] = []
    }
    acc[info.type].push({ ticker, label: info.label })
    return acc
  }, {} as Record<string, { ticker: string, label: string }[]>)

  const selectedPairInfo = getTickerInfo(tradingPair)
  const MATCH_DURATIONS = [
    { value: 300, label: "5 minutes" },
    { value: 900, label: "15 minutes" },
    { value: 1800, label: "30 minutes" },
  ]
  const selectedDuration = MATCH_DURATIONS.find(d => d.value === matchDuration) || MATCH_DURATIONS[0]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Main content */}
      <div className="min-h-screen flex items-center justify-center px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg"
        >
          {/* Glass card */}
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-3xl blur-xl opacity-50" />
            
            {/* Card content */}
            <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div 
                  className="flex items-center justify-center gap-3 mb-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                >
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <Swords className="w-8 h-8" />
                  </div>
                </motion.div>
                <motion.h1 
                  className="text-3xl md:text-4xl font-bold tracking-tight mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  Trading Duels
                </motion.h1>
                <motion.p 
                  className="text-muted-foreground"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  1v1 battles. Same market. Best PnL wins.
                </motion.p>
              </div>

              {/* Error message */}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 mb-6 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span className="flex-1">{error}</span>
                  <button
                    onClick={clearError}
                    className="text-xs hover:underline"
                  >
                    Dismiss
                  </button>
                </motion.div>
              )}

              {/* Configuration */}
              <motion.div 
                className="space-y-4 mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                {/* Trading Pair */}
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Trading Pair</label>
                  <Select value={tradingPair} onValueChange={setTradingPair}>
                    <SelectTrigger className="w-full bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                      <SelectValue>
                        <div className="flex items-center justify-between w-full">
                          <span className="font-mono">{selectedPairInfo.label}</span>
                          <span className="text-xs text-muted-foreground ml-2">{selectedPairInfo.type}</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(groupedTickers).map(([type, items]) => (
                        <SelectGroup key={type}>
                          <SelectLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-2 py-1.5 bg-muted/20">
                            {type}
                          </SelectLabel>
                          {items.map((item) => (
                            <SelectItem key={item.ticker} value={item.ticker}>
                              <span className="font-mono">{item.label}</span>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Match Duration */}
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Match Duration</label>
                  <Select 
                    value={matchDuration.toString()} 
                    onValueChange={(v) => setMatchDuration(parseInt(v))}
                  >
                    <SelectTrigger className="w-full bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                      <SelectValue>
                        <span>{selectedDuration.label}</span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {MATCH_DURATIONS.map((duration) => (
                        <SelectItem key={duration.value} value={duration.value.toString()}>
                          {duration.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                {isAuthenticated ? (
                  <Button
                    size="lg"
                    onClick={handleFindMatch}
                    disabled={isLoading || authLoading}
                    className="w-full text-base py-6 bg-white hover:bg-white/90 text-black font-semibold
                               transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] 
                               disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Finding Match...
                      </>
                    ) : (
                      <>
                        <Swords className="w-5 h-5 mr-2" />
                        Find Match
                      </>
                    )}
                  </Button>
                ) : (
                  <>
                    <Button
                      size="lg"
                      asChild
                      className="w-full text-base py-6 bg-white hover:bg-white/90 text-black font-semibold
                                 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Link href="/login">
                        <Swords className="w-5 h-5 mr-2" />
                        Sign in to Play
                      </Link>
                    </Button>
                    <p className="text-center text-sm text-muted-foreground mt-3">
                      Create an account or sign in to start playing
                    </p>
                  </>
                )}
              </motion.div>
            </div>
          </div>

          {/* Additional info */}
          <motion.div 
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <p className="text-sm text-muted-foreground">
              Free to play • No real money at stake • Real market data
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
