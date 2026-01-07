/**
 * Room-related types for the Trading Battles game.
 * These types align with the API responses from the backend.
 */

export type RoomStatus = 'WAITING' | 'ACTIVE' | 'FINISHED'

export interface Room {
  id: number
  name: string
  symbol: string
  status: RoomStatus
  player1_username: string
  player2_username: string | null
  created_at: string
  started_at: string | null
  ended_at: string | null
  duration_seconds: number
}

export interface Player {
  username: string
  email: string
  is_active: boolean
  is_verified: boolean
}

export interface RoomMessage {
  id: string
  roomId: number
  username: string
  message: string
  timestamp: number
  type: 'chat_message' | 'system'
}

export interface CreateRoomRequest {
  name: string
  symbol: string
  duration_seconds?: number
}

export interface JoinRoomRequest {
  roomId: number
}
