export interface Room {
  id: string
  name: string
  host: {
    id: string
    name: string
    level: number
    winRate: number
  }
  players: Player[]
  maxPlayers: number
  isPrivate: boolean
  status: "waiting" | "in-progress" | "finished"
  createdAt: string
  battleDuration: number
  settings: {
    symbol: string
    initialBalance: number
    allowedOrderTypes: string[]
  }
}

export interface Player {
  id: string
  name: string
  level: number
  winRate: number
  joinedAt: string
  isReady: boolean
}

export interface RoomMessage {
  id: string
  roomId: string
  playerId: string
  playerName: string
  message: string
  timestamp: string
  type: "message" | "system" | "join" | "leave"
}

export interface CreateRoomRequest {
  name: string
  isPrivate: boolean
  battleDuration: number
  maxPlayers: number
  settings: {
    symbol: string
    initialBalance: number
  }
}

export interface JoinRoomRequest {
  roomId: string
  playerId: string
}
