// Mock API endpoints for local development
// This would be replaced with actual backend endpoints in production

const API_BASE = "https://api.mockstreet.com"

// Simple in-memory store for development
const matchmakingQueue: Array<{
  userId: string
  username: string
  timestamp: number
}> = []

const activeRooms: Record<string, {
  players: string[]
  status: 'waiting' | 'active'
  created: number
}> = {}

export const MockAPI = {
  // Quick match endpoint
  quickMatch: async (username: string, userId: string) => {
    // Add user to queue
    matchmakingQueue.push({
      userId,
      username,
      timestamp: Date.now()
    })

    // If there's another player waiting, match them
    if (matchmakingQueue.length >= 2) {
      const [player1, player2] = matchmakingQueue.splice(0, 2)
      const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      activeRooms[roomId] = {
        players: [player1.username, player2.username],
        status: 'active',
        created: Date.now()
      }

      return {
        matched: true,
        roomId,
        opponent: player1.username === username ? player2.username : player1.username
      }
    }

    return {
      matched: false,
      message: "Added to matchmaking queue"
    }
  },

  // Cancel matchmaking
  cancelMatch: async (username: string, userId: string) => {
    const index = matchmakingQueue.findIndex(p => p.userId === userId)
    if (index > -1) {
      matchmakingQueue.splice(index, 1)
    }
    return { success: true }
  },

  // Check user status
  getUserStatus: async (username: string) => {
    // Check if user is in any active room
    for (const [roomId, room] of Object.entries(activeRooms)) {
      if (room.players.includes(username)) {
        return {
          status: 'in_battle',
          room_id: roomId
        }
      }
    }

    return {
      status: 'available'
    }
  },

  // Room stats
  getRoomStats: async (roomId: string) => {
    // Mock stats for development
    const mockStats = {
      player1: {
        pnl: Math.floor(Math.random() * 2000) - 1000,
        fiat: 5000 + Math.floor(Math.random() * 1000) - 500,
        stocks: {}
      },
      player2: {
        pnl: Math.floor(Math.random() * 2000) - 1000,
        fiat: 5000 + Math.floor(Math.random() * 1000) - 500,
        stocks: {}
      }
    }

    return mockStats
  }
}

// WebSocket events simulation
export const MockWebSocket = {
  emit: (event: string, data: any) => {
    console.log(`[MockWS] Emit: ${event}`, data)
    
    // Simulate match found after a delay
    if (event === 'find_match') {
      setTimeout(() => {
        const opponent = 'Trader_' + Math.random().toString(36).substr(2, 6)
        const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        
        // Trigger match found event
        MockWebSocket.trigger('match_found', {
          opponent,
          room_id: roomId
        })
      }, 3000 + Math.random() * 7000) // 3-10 seconds delay
    }
  },

  trigger: (event: string, data: any) => {
    console.log(`[MockWS] Trigger: ${event}`, data)
    // In a real app, this would be handled by the WebSocket connection
  }
}
