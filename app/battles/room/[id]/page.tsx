"use client"

import { useState, useEffect } from "react"
import { MockStreetHeader } from "@/components/mockstreet-header"
import { SimplifiedPNL } from "@/components/simplified-pnl"
import { TradingViewChart } from "@/components/tradingview-chart"
import { SimpleOrderForm } from "@/components/simple-order-form"
import { BattleChat } from "@/components/battle-chat"
import { SimpleOrderHistory } from "@/components/simple-order-history"
import { QuickMatchmaking } from "@/components/quick-matchmaking"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/components/auth-provider"
import { io, Socket } from "socket.io-client"
import { useRouter, useSearchParams } from "next/navigation"

const API_URL = "https://api.mockstreet.com/"

interface Stock {
  quantity: number
  current_price: number
  pnl: number
  weighted_avg_price: number
}

export default function BattleRoomPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [currentPage, setCurrentPage] = useState<"matchmaking" | "battle">("matchmaking")
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(params.id === "matchmaking" ? null : params.id)
  const [username, setUsername] = useState<string>(user?.name || user?.email || "")
  const [battleTime, setBattleTime] = useState("05:00")
  const [userPNL, setUserPNL] = useState(0)
  const [opponentPNL, setOpponentPNL] = useState(0)
  const [userFiat, setUserFiat] = useState(5000)
  const [opponentFiat, setOpponentFiat] = useState(5000)
  const [userStocks, setUserStocks] = useState<Record<string, Stock>>({})
  const [opponentStocks, setOpponentStocks] = useState<Record<string, Stock>>({})
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    // If we have a room ID and user is authenticated, start the battle immediately
    if (params.id !== "matchmaking" && user) {
      setCurrentRoomId(params.id)
      setUsername(user.name || user.email || 'Player')
      setCurrentPage("battle")
    } else if (params.id === "matchmaking") {
      setCurrentPage("matchmaking")
    }
  }, [params.id, user])

  useEffect(() => {
    if (currentPage === "battle" && currentRoomId) {
      const newSocket = io(API_URL)
      setSocket(newSocket)

      newSocket.emit('join_room', currentRoomId)

      const timer = setInterval(() => {
        const [minutes, seconds] = battleTime.split(':').map(Number)
        if (minutes === 0 && seconds === 0) {
          clearInterval(timer)
          return
        }
        const totalSeconds = minutes * 60 + seconds - 1
        const newMinutes = Math.floor(totalSeconds / 60)
        const newSeconds = totalSeconds % 60
        setBattleTime(`${newMinutes.toString().padStart(2, '0')}:${newSeconds.toString().padStart(2, '0')}`)
      }, 1000)

      const statsInterval = setInterval(() => {
        fetch(`${API_URL}/room/${currentRoomId}/stats`)
          .then(res => {
            if (!res.ok) throw new Error('API not available')
            return res.json()
          })
          .then(stats => {
            const userStats = stats[username]
            const opponentUsername = Object.keys(stats).find(u => u !== username && u !== 'winner')
            const opponentStats = opponentUsername ? stats[opponentUsername] : null

            if (userStats) {
              setUserPNL(userStats.pnl || 0)
              setUserFiat(userStats.fiat || 0)
              setUserStocks(userStats.stocks || {})
            }
            if (opponentStats) {
              setOpponentPNL(opponentStats.pnl || 0)
              setOpponentFiat(opponentStats.fiat || 0)
              setOpponentStocks(opponentStats.stocks || {})
            }
          })
          .catch(() => {
            // Fallback to mock data for development
            const mockUserPnL = Math.floor(Math.random() * 2000) - 1000
            const mockOpponentPnL = Math.floor(Math.random() * 2000) - 1000
            
            setUserPNL(mockUserPnL)
            setUserFiat(5000 + Math.floor(Math.random() * 1000) - 500)
            setUserStocks({})
            
            setOpponentPNL(mockOpponentPnL)
            setOpponentFiat(5000 + Math.floor(Math.random() * 1000) - 500)
            setOpponentStocks({})
          })
      }, 2000)

      return () => {
        clearInterval(timer)
        clearInterval(statsInterval)
        newSocket.disconnect()
      }
    }
  }, [currentPage, currentRoomId, username])

  const handleBattleStart = (roomId: string, user: string) => {
    setCurrentRoomId(roomId)
    setUsername(user)
    setCurrentPage("battle")
  }

  const handleExitBattle = () => {
    setCurrentPage("matchmaking")
    router.push("/battles")
  }

  if (currentPage === "matchmaking") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto p-6">
          <QuickMatchmaking onBattleStart={handleBattleStart} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* MockStreet Header */}
      <MockStreetHeader 
        battleTime={battleTime} 
        userLevel={12} 
        userStreak={3} 
        onExit={handleExitBattle}
      />

      <div className="p-4 grid grid-rows-[auto_1fr_auto] gap-4">
        {/* PNL Display Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SimplifiedPNL 
            label={`${username}'s Stats`} 
            pnl={userPNL} 
            fiat={userFiat} 
            stocks={userStocks} 
          />
          <SimplifiedPNL 
            label="Opponent's Stats" 
            pnl={opponentPNL} 
            fiat={opponentFiat} 
            stocks={opponentStocks} 
            isOpponent={true} 
          />
        </div>

        {/* Main Content Area: Chart and Right Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-grow">
          {/* Left: Trading Chart */}
          <div className="lg:col-span-2">
            <TradingViewChart />
          </div>

          {/* Right: Order Form and Chat */}
          <div className="flex flex-col gap-4">
            <SimpleOrderForm roomId={currentRoomId} username={username} />
            <BattleChat roomId={currentRoomId} username={username} socket={socket} />
          </div>
        </div>

        {/* Bottom: Order History */}
        <SimpleOrderHistory roomId={currentRoomId} username={username} />
      </div>
    </div>
  )
}
