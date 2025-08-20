"use client"

import { useState, useEffect } from "react"
import { MockStreetHeader } from "@/components/mockstreet-header"
import { SimplifiedPNL } from "@/components/simplified-pnl"
import { TradingViewChart } from "@/components/tradingview-chart"
import { SimpleOrderForm } from "@/components/simple-order-form"
import { BattleChat } from "@/components/battle-chat"
import { SimpleOrderHistory } from "@/components/simple-order-history"
import { RoomMatchmaking } from "@/components/room-matchmaking"
import { io, Socket } from "socket.io-client"

const API_URL = "https://api.mockstreet.com/"

interface Stock {
  quantity: number
  current_price: number
  pnl: number
  weighted_avg_price: number
}

export default function TradingBattlePage() {
  const [currentPage, setCurrentPage] = useState<"matchmaking" | "battle">("matchmaking")
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null)
  const [username, setUsername] = useState<string>("")
  const [battleTime, setBattleTime] = useState("05:00")
  const [userPNL, setUserPNL] = useState(0)
  const [opponentPNL, setOpponentPNL] = useState(0)
  const [userFiat, setUserFiat] = useState(5000)
  const [opponentFiat, setOpponentFiat] = useState(5000)
  const [userStocks, setUserStocks] = useState<Record<string, Stock>>({})
  const [opponentStocks, setOpponentStocks] = useState<Record<string, Stock>>({})
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    if (currentPage === "battle" && currentRoomId) {
      const newSocket = io(API_URL)
      setSocket(newSocket)

      newSocket.emit('join', { username, room: currentRoomId })

      const timer = setInterval(() => {
        setBattleTime((prev) => {
          const [minutes, seconds] = prev.split(":").map(Number)
          const totalSeconds = minutes * 60 + seconds
          if (totalSeconds <= 0) return "00:00"

          const newTotal = totalSeconds - 1
          const newMinutes = Math.floor(newTotal / 60)
          const newSeconds = newTotal % 60
          return `${newMinutes.toString().padStart(2, "0")}:${newSeconds.toString().padStart(2, "0")}`
        })
      }, 1000)

      const statsInterval = setInterval(() => {
        fetch(`${API_URL}/room/${currentRoomId}/stats`)
          .then(res => res.json())
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

  if (currentPage === "matchmaking") {
    return <RoomMatchmaking onBattleStart={handleBattleStart} />
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <MockStreetHeader battleTime={battleTime} userLevel={12} userStreak={3} />

      <div className="p-4 grid grid-rows-[auto_1fr_auto] gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SimplifiedPNL label={`${username}'s Stats`} pnl={userPNL} fiat={userFiat} stocks={userStocks} />
          <SimplifiedPNL label="Opponent's Stats" pnl={opponentPNL} fiat={opponentFiat} stocks={opponentStocks} isOpponent={true} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-grow">
          <div className="lg:col-span-2">
            <TradingViewChart />
          </div>

          <div className="flex flex-col gap-4">
            <SimpleOrderForm roomId={currentRoomId} username={username} />
            <BattleChat roomId={currentRoomId} username={username} socket={socket} />
          </div>
        </div>

        <SimpleOrderHistory roomId={currentRoomId} username={username} />
      </div>
    </div>
  )
}
