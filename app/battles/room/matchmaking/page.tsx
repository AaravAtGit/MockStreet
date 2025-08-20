"use client"

import { QuickMatchmaking } from "@/components/quick-matchmaking"
import { Navbar } from "@/components/navbar"
import { useRouter } from "next/navigation"

export default function MatchmakingPage() {
  const router = useRouter()

  const handleBattleStart = (roomId: string, username: string) => {
    // Redirect to the battle room with the room ID
    router.push(`/battles/room/${roomId}?username=${encodeURIComponent(username)}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Quick Battle Matchmaking</h1>
          <p className="text-muted-foreground">
            Get matched instantly with another trader for a quick battle
          </p>
        </div>
        <QuickMatchmaking onBattleStart={handleBattleStart} />
      </div>
    </div>
  )
}
