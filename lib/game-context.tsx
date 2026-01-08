"use client"

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react"
import { api, roomsApi, gameApi, authApi, createGameWebSocket, createChatWebSocket, type Room, type Position as ApiPosition, type CandleData, type GameWebSocketMessage, type GameEndMessage, type ChatWebSocketMessage } from "./api"

import { useAuth } from "./auth-context"
export type GamePhase = "lobby" | "matchmaking" | "waiting" | "versus" | "trading" | "results"

export interface Player {
  id: string
  name: string
  avatar: string
  balance: number
  pnl: number
  pnlPercent: number
  positions: Position[]
  closedPositions: ClosedPosition[]
  openPositionsCount?: number
}

export interface Position {
  id: string
  type: "long" | "short"
  lots: number
  leverage: number
  entryPrice: number
  currentPrice: number
  pnl: number
  entryTime?: string
  apiId?: number // ID from the API
}

export interface ClosedPosition {
  id: string
  type: "long" | "short"
  lots: number
  leverage: number
  entryPrice: number
  exitPrice: number
  pnl: number
  entryTime?: string
  exitTime?: string
  closedAt: Date
}

export interface ChatMessage {
  id: string
  playerId: string
  playerName: string
  message: string
  timestamp: Date
}

interface GameState {
  phase: GamePhase
  player: Player
  opponent: Player | null
  tradingPair: string
  matchDuration: number
  timeRemaining: number
  messages: ChatMessage[]
  currentPrice: number
  lastCandle: CandleData | null
  preloadCandles: CandleData[]
  currentRoom: Room | null
  isLoading: boolean
  error: string | null
  gameEndData: GameEndMessage | null
  playerPosition: 'player1' | 'player2' | null
  tickers: string[]
}

interface GameContextType extends GameState {
  startMatchmaking: () => Promise<void>
  openPosition: (type: "long" | "short", lots: number, leverage: number) => Promise<void>
  closePosition: (positionId: string) => Promise<void>
  sendMessage: (message: string) => void
  setPhase: (phase: GamePhase) => void
  setTradingPair: (pair: string) => void
  setMatchDuration: (duration: number) => void
  clearError: () => void
  resetGame: () => void
}

const GameContext = createContext<GameContextType | null>(null)

const INITIAL_BALANCE = 100000
const DEFAULT_MATCH_DURATION = 300 // 5 minutes in seconds

const generatePlayer = (name: string, id: string): Player => ({
  id,
  name,
  avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
  balance: INITIAL_BALANCE,
  pnl: 0,
  pnlPercent: 0,
  positions: [],
  closedPositions: [],
})

export function GameProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [phase, setPhase] = useState<GamePhase>("lobby")
  const [player, setPlayer] = useState<Player>(generatePlayer("You", "player-1"))
  const [opponent, setOpponent] = useState<Player | null>(null)
  const [tradingPair, setTradingPairState] = useState("AAPL")
  const [matchDuration, setMatchDurationState] = useState(DEFAULT_MATCH_DURATION)
  const [timeRemaining, setTimeRemaining] = useState(DEFAULT_MATCH_DURATION)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentPrice, setCurrentPrice] = useState(175)
  const [lastCandle, setLastCandle] = useState<CandleData | null>(null)
  const [preloadCandles, setPreloadCandles] = useState<CandleData[]>([])
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [gameEndData, setGameEndData] = useState<GameEndMessage | null>(null)
  const [playerPosition, setPlayerPosition] = useState<'player1' | 'player2' | null>(null)
  const [tickers, setTickers] = useState<string[]>(["AAPL"])
  
  const wsRef = useRef<WebSocket | null>(null)
  const chatWsRef = useRef<WebSocket | null>(null)
  const portfolioWsRef = useRef<WebSocket | null>(null)
  const chatSendRef = useRef<((text: string) => void) | null>(null)
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Sync player with auth user
  useEffect(() => {
    if (user) {
      setPlayer(prev => ({
        ...prev,
        id: user.username,
        name: user.username,
        // Update avatar if we want, but let's keep it simple for now or update it based on new name
        avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(user.username)}`,
      }))
    }
  }, [user])

  // Fetch available tickers on mount
  useEffect(() => {
    const fetchTickers = async () => {
      try {
        const availableTickers = await gameApi.getTickers()
        if (availableTickers && availableTickers.length > 0) {
          setTickers(availableTickers)
          // If AAPL isn't available, default to the first one
          if (!availableTickers.includes("AAPL")) {
            setTradingPairState(availableTickers[0])
          }
        }
      } catch (err) {
        console.error("Failed to fetch tickers:", err)
        // Keep default tickers if fetch fails
      }
    }
    fetchTickers()
  }, [])

  // Cleanup WebSocket and polling on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
      if (chatWsRef.current) {
        chatWsRef.current.close()
      }
      if (portfolioWsRef.current) {
        portfolioWsRef.current.close()
      }
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
      }
    }
  }, [])

  // Connect WebSocket when trading phase starts
  useEffect(() => {
    if (phase !== "trading" || !currentRoom) return

    // Connect to game WebSocket
    const ws = createGameWebSocket(
      currentRoom.id,
      (data: GameWebSocketMessage) => {
        if (data.type === 'game_update') {
          setCurrentPrice(data.current_price)
          if (data.candle) {
            setLastCandle(data.candle)
          }
          // Update time remaining from server
          if (data.room.time_remaining !== undefined) {
            setTimeRemaining(data.room.time_remaining)
          }
          
          // Update opponent stats from server (and player balance as backup)
          if (data.players && playerPosition) {
            const oppPosition = playerPosition === 'player1' ? 'player2' : 'player1'
            const oppStats = data.players[oppPosition]
            
            if (oppStats) {
              setOpponent(prev => prev ? {
                ...prev,
                balance: oppStats.balance,
                pnl: oppStats.unrealized_pnl,
                pnlPercent: (oppStats.unrealized_pnl / INITIAL_BALANCE) * 100,
                openPositionsCount: oppStats.open_positions
              } : prev)
            }
          }
        } else if (data.type === 'game_start') {
          // Handle preload candles if needed
          if (data.preload_candles) {
            setPreloadCandles(data.preload_candles)
            setCurrentPrice(data.preload_candles[data.preload_candles.length - 1]?.close || currentPrice)
          }
        } else if (data.type === 'game_end') {
          // Store the complete game_end data for results screen
          setGameEndData(data)
          setPhase('results')
        }
      },
      (error) => {
        console.error("Game WebSocket error:", error)
      }
    )
    wsRef.current = ws

    return () => {
      ws.close()
      wsRef.current = null
    }
  }, [phase, currentRoom, playerPosition])

  // Connect to Portfolio WebSocket
  useEffect(() => {
    if (phase !== "trading" || !currentRoom) return

    const token = authApi.getToken()
    if (!token) {
      console.warn("No auth token for portfolio WebSocket")
      return
    }

    const { createPortfolioWebSocket } = require("./api") // Import here to avoid circular dependencies if any
    
    const ws = createPortfolioWebSocket(
      currentRoom.id,
      token,
      (data: any) => { // Using any for now to simplify matching the imported type
        if (data.type === 'portfolio_update') {
          // Update player state with authoritative data from server
          setPlayer(prev => {
            // Map API positions to local Position interface
            const updatedPositions: Position[] = data.positions.map((pos: any) => ({
              id: `pos-${pos.id}`,
              apiId: pos.id,
              type: pos.side === 'LONG' ? 'long' : 'short',
              lots: pos.quantity,
              leverage: pos.leverage,
              entryPrice: pos.entry_price,
              currentPrice: pos.current_price,
              pnl: pos.unrealized_pnl,
              entryTime: pos.entry_time
            }))

            return {
              ...prev,
              balance: data.balance,
              pnl: data.unrealized_pnl,
              pnlPercent: (data.unrealized_pnl / INITIAL_BALANCE) * 100,
              positions: updatedPositions
            }
          })
        } else if (data.type === 'error') {
          console.error("Portfolio error:", data.message)
        }
      },
      (error: Event) => {
        console.error("Portfolio WebSocket error:", error)
      }
    )

    portfolioWsRef.current = ws

    return () => {
      ws.close()
      portfolioWsRef.current = null
    }
  }, [phase, currentRoom])

  // Poll for room status when in waiting phase
  useEffect(() => {
    if (phase !== "waiting" || !currentRoom) return

    const pollRoomStatus = async () => {
      try {
        const rooms = await roomsApi.list()
        const room = rooms.find(r => r.id === currentRoom.id)
        
        if (room && room.status === "ACTIVE" && room.player2_username) {
          // Opponent has joined!
          setCurrentRoom(room)
          const opponentUsername = room.player2_username
          setOpponent(generatePlayer(opponentUsername, opponentUsername))
          setPhase("versus")
          
          // Start trading after versus animation
          setTimeout(() => {
            setPhase("trading")
            setTimeRemaining(matchDuration)
            setMessages([])
          }, 4000)
        }
      } catch (err) {
        console.error("Failed to poll room status:", err)
      }
    }

    pollingRef.current = setInterval(pollRoomStatus, 2000)
    pollRoomStatus() // Initial check

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
        pollingRef.current = null
      }
    }
  }, [phase, currentRoom])

  // Update positions with current price
  useEffect(() => {
    if (phase !== "trading") return

    setPlayer((prev) => {
      const updatedPositions = prev.positions.map((pos) => {
        const priceDiff = currentPrice - pos.entryPrice
        const direction = pos.type === "long" ? 1 : -1
        const pnl = priceDiff * direction * pos.lots * pos.leverage
        return { ...pos, currentPrice, pnl }
      })

      // We no longer calculate total PNL here as it comes from the API
      // We only update positions for UI display purposes

      return {
        ...prev,
        positions: updatedPositions,
      }
    })

    // Opponent PnL is now updated from Game WebSocket in the game_update handler
  }, [currentPrice, phase])

  // Timer countdown
  useEffect(() => {
    if (phase !== "trading") return

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setPhase("results")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [phase])

  // Connect Chat WebSocket when trading phase starts
  useEffect(() => {
    if (phase !== "trading" || !currentRoom) return

    const token = authApi.getToken()
    if (!token) {
      console.warn("No auth token for chat WebSocket")
      return
    }

    const { ws, sendMessage: chatSend } = createChatWebSocket(
      currentRoom.id,
      token,
      (data: ChatWebSocketMessage) => {
        if (data.type === 'chat_message') {
          // Received message from WebSocket (including our own echoed back)
          // Only add if it's from opponent (our messages are added immediately in sendMessage)
          // Received message from WebSocket (including our own echoed back)
          // Only add if it's from opponent (our messages are added immediately in sendMessage)
          // We rely on username check primarily
          const isFromMe = data.username === player.id
          if (!isFromMe) {
            const incomingMessage: ChatMessage = {
              id: `ws-msg-${data.timestamp}-${data.username}`,
              playerId: data.username,
              playerName: data.username,
              message: data.message,
              timestamp: new Date(data.timestamp * 1000),
            }
            setMessages(prev => [...prev, incomingMessage])
          }
        } else if (data.type === 'system') {
          // System messages (join/leave)
          const systemMessage: ChatMessage = {
            id: `sys-msg-${data.timestamp}`,
            playerId: 'system',
            playerName: 'System',
            message: data.message,
            timestamp: new Date(data.timestamp * 1000),
          }
          setMessages(prev => [...prev, systemMessage])
        } else if (data.type === 'error') {
          console.error("Chat error:", data.message)
        }
      },
      (error) => {
        console.error("Chat WebSocket error:", error)
      }
    )

    chatWsRef.current = ws
    chatSendRef.current = chatSend

    return () => {
      ws.close()
      chatWsRef.current = null
      chatSendRef.current = null
    }
  }, [phase, currentRoom, player.name, player.id])

  const startMatchmaking = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    setPhase("matchmaking")

    try {
                  // Check for waiting rooms
                  const allWaitingRooms = await roomsApi.getWaitingRooms()
                  const waitingRooms = allWaitingRooms.filter(r => 
                    r.symbol === tradingPair && 
                    r.duration_seconds === matchDuration
                  )
                  
                  if (waitingRooms.length > 0) {                // Join the first waiting room
                const roomToJoin = waitingRooms[0]
                const joinedRoom = await roomsApi.join(roomToJoin.id)
                setCurrentRoom(joinedRoom)
                setTradingPairState(joinedRoom.symbol)
                setPlayerPosition('player2') // We're joining, so we're player2
                
                // Use actual username from the API
                const opponentUsername = joinedRoom.player1_username
                setOpponent(generatePlayer(opponentUsername, opponentUsername))
                
                // Show versus screen
                setPhase("versus")        
        // Initialize portfolio
        try {
          const portfolio = await gameApi.getPortfolio(joinedRoom.id)
          setPlayer(prev => ({
            ...prev,
            balance: portfolio.current_balance
          }))
        } catch (e) {
          console.log("Portfolio not ready yet, using default balance")
        }
        
        // Start trading after animation
        setTimeout(() => {
          setPhase("trading")
          setTimeRemaining(matchDuration)
          setMessages([])
        }, 4000)
      } else {
        // No waiting rooms, create a new one
        const roomName = `Battle Room ${Date.now()}`
        const newRoom = await roomsApi.create(roomName, tradingPair, matchDuration)
        setCurrentRoom(newRoom)
        setTradingPairState(newRoom.symbol)
        setPlayerPosition('player1') // We created the room, so we're player1
        
        // Wait for opponent
        setPhase("waiting")
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to start matchmaking"
      setError(errorMessage)
      setPhase("lobby")
    } finally {
      setIsLoading(false)
    }
  }, [tradingPair, matchDuration])

  const openPosition = useCallback(
    async (type: "long" | "short", lots: number, leverage: number) => {
      if (!currentRoom) {
        setError("No active room")
        return
      }

      const margin = lots * 1000

      if (player.balance < margin) {
        setError("Insufficient balance")
        return
      }

      try {
        const position = await gameApi.openTrade(
          currentRoom.id,
          type === "long" ? "LONG" : "SHORT",
          lots,
          leverage
        )

        const newPosition: Position = {
          id: `pos-${position.id}`,
          apiId: position.id,
          type,
          lots: position.quantity,
          leverage: position.leverage,
          entryPrice: position.entry_price,
          currentPrice: position.entry_price,
          pnl: 0,
          entryTime: position.entry_time
        }

        setPlayer((prev) => ({
          ...prev,
          balance: prev.balance - margin,
          positions: [...prev.positions, newPosition],
        }))
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Failed to open position"
        setError(errorMessage)
      }
    },
    [currentRoom, player.balance]
  )

  const closePosition = useCallback(async (positionId: string) => {
    const position = player.positions.find((p) => p.id === positionId)
    if (!position) return

    try {
      if (position.apiId) {
        const closedApiPosition = await gameApi.closeTrade(position.apiId)
        
        const margin = position.lots * 1000
        const realizedPnl = closedApiPosition.pnl ?? position.pnl

        const closedPosition: ClosedPosition = {
          id: position.id,
          type: position.type,
          lots: position.lots,
          leverage: position.leverage,
          entryPrice: position.entryPrice,
          exitPrice: closedApiPosition.exit_price ?? position.currentPrice,
          pnl: realizedPnl,
          entryTime: position.entryTime,
          exitTime: closedApiPosition.exit_time ?? undefined,
          closedAt: new Date(),
        }

        setPlayer((prev) => ({
          ...prev,
          balance: prev.balance + margin + realizedPnl,
          positions: prev.positions.filter((p) => p.id !== positionId),
          closedPositions: [...prev.closedPositions, closedPosition],
        }))
      } else {
        // Fallback for positions without API ID (shouldn't happen)
        const margin = position.lots * 1000

        const closedPosition: ClosedPosition = {
          id: position.id,
          type: position.type,
          lots: position.lots,
          leverage: position.leverage,
          entryPrice: position.entryPrice,
          exitPrice: position.currentPrice,
          pnl: position.pnl,
          closedAt: new Date(),
        }

        setPlayer((prev) => ({
          ...prev,
          balance: prev.balance + margin + position.pnl,
          positions: prev.positions.filter((p) => p.id !== positionId),
          closedPositions: [...prev.closedPositions, closedPosition],
        }))
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to close position"
      setError(errorMessage)
    }
  }, [player.positions])

  const sendMessage = useCallback(
    (message: string) => {
      // Send via Chat WebSocket if connected
      if (chatSendRef.current) {
        chatSendRef.current(message)
      }
      
      // Also add to local state for immediate display
      const newMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        playerId: player.id,
        playerName: player.name,
        message,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, newMessage])
    },
    [player]
  )

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const resetGame = useCallback(() => {
    setPhase('lobby')
    setPlayer(generatePlayer('You', 'player-1'))
    setOpponent(null)
    setCurrentRoom(null)
    setGameEndData(null)
    setPlayerPosition(null)
    setMessages([])
    setTimeRemaining(matchDuration)
    setError(null)
  }, [matchDuration])

  return (
    <GameContext.Provider
      value={{
        phase,
        player,
        opponent,
        tradingPair,
        matchDuration,
        timeRemaining,
        messages,
        currentPrice,
        lastCandle,
        preloadCandles,
        currentRoom,
        isLoading,
        error,
        gameEndData,
        playerPosition,
        tickers,
        startMatchmaking,
        openPosition,
        closePosition,
        sendMessage,
        setPhase,
        setTradingPair: setTradingPairState,
        setMatchDuration: setMatchDurationState,
        clearError,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}
