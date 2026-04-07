

// Use environment variable or fallback to localhost
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.mockstreet.com'
const WS_BASE_URL = API_BASE_URL.replace(/^http/, 'ws')

// ============================================================================
// Types matching the API responses
// ============================================================================

export interface User {
    username: string
    email: string
    is_active: boolean
    is_verified: boolean
}

export interface AuthResponse {
    access_token: string
    token_type: string
}

export interface Room {
    id: number
    name: string
    symbol: string
    status: 'WAITING' | 'ACTIVE' | 'FINISHED'
    player1_username: string
    player2_username: string | null
    created_at: string
    started_at: string | null
    ended_at: string | null
    duration_seconds: number
}

export interface Position {
    id: number
    portfolio_id: number
    side: 'LONG' | 'SHORT'
    quantity: number
    leverage: number
    entry_price: number
    entry_time: string
    exit_price: number | null
    exit_time: string | null
    is_open: boolean
    pnl: number | null
}

export interface Portfolio {
    id: number
    username: string
    room_id: number
    initial_balance: number
    current_balance: number
    positions: Position[]
}

export interface CandleData {
    time: number
    open: number
    high: number
    low: number
    close: number
    volume: number
}

// ============================================================================
// WebSocket Message Types
// ============================================================================

// Player stats (used in game WebSocket messages)
export interface PlayerStats {
    username: string
    balance: number
    unrealized_pnl: number
    total_equity: number
    open_positions: number
}

// Game WebSocket messages
export interface GameWaitingMessage {
    type: 'waiting'
    message: string
    room: {
        id: number
        status: string
        symbol: string
    }
}

export interface GameStartMessage {
    type: 'game_start'
    room: {
        id: number
        status: string
        symbol: string
        started_at: number
        game_duration: number
    }
    preload_candles: CandleData[]
    players: {
        player1: PlayerStats
        player2: PlayerStats
    }
}

export interface GameUpdateMessage {
    type: 'game_update'
    room: {
        id: number
        status: string
        time_remaining: number
    }
    candle: CandleData
    current_price: number
    players: {
        player1: PlayerStats
        player2: PlayerStats
    }
}

export interface GameEndMessage {
    type: 'game_end'
    room: {
        id: number
        status: string
    }
    final_stats: {
        player1: PlayerStats
        player2: PlayerStats
    }
    winner: {
        username?: string
        position?: 'player1' | 'player2'
        tie?: boolean
    }
}

export interface ErrorMessage {
    type: 'error'
    message: string
}

export type GameWebSocketMessage =
    | GameWaitingMessage
    | GameStartMessage
    | GameUpdateMessage
    | GameEndMessage
    | ErrorMessage

// Portfolio WebSocket messages
export interface PortfolioPosition {
    id: number
    side: 'LONG' | 'SHORT'
    quantity: number
    leverage: number
    entry_price: number
    current_price: number
    unrealized_pnl: number
    entry_time: string
}

export interface PortfolioAuthSuccessMessage {
    type: 'auth_success'
    username: string
    room_id: number
}

export interface PortfolioUpdateMessage {
    type: 'portfolio_update'
    balance: number
    unrealized_pnl: number
    total_equity: number
    current_price: number
    positions: PortfolioPosition[]
}

export type PortfolioWebSocketMessage =
    | PortfolioAuthSuccessMessage
    | PortfolioUpdateMessage
    | ErrorMessage

// Chat WebSocket messages
export interface ChatAuthSuccessMessage {
    type: 'auth_success'
    username: string
    room_id: number
}

export interface ChatMessageReceived {
    type: 'chat_message'
    username: string
    message: string
    timestamp: number
}

export interface SystemMessage {
    type: 'system'
    message: string
    timestamp: number
}

export type ChatWebSocketMessage =
    | ChatAuthSuccessMessage
    | ChatMessageReceived
    | SystemMessage
    | ErrorMessage

// ============================================================================
// Fetch Client Setup (Replacing Axios)
// ============================================================================

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<{ data: T }> {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = new Headers(options.headers || {});
        
        if (!headers.has('Content-Type') && !(options.body instanceof URLSearchParams)) {
            headers.set('Content-Type', 'application/json');
        }

        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('auth_token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
        }

        const response = await fetch(url, { ...options, headers });

        if (!response.ok) {
            let errorMsg = response.statusText;
            try {
                const errorData = await response.json();
                if (errorData?.detail) {
                    errorMsg = typeof errorData.detail === 'string' 
                        ? errorData.detail 
                        : JSON.stringify(errorData.detail);
                } else if (errorData?.message) {
                    errorMsg = errorData.message;
                }
            } catch (e) {
                // Continue with default error text if JSON parsing fails
            }
            throw new Error(errorMsg || `HTTP error! status: ${response.status}`);
        }

        if (response.status === 204) {
            return { data: {} as T };
        }

        const data = await response.json();
        return { data };
    }

    async get<T>(endpoint: string, options: RequestInit = {}): Promise<{ data: T }> {
        return this.request<T>(endpoint, { ...options, method: 'GET' });
    }

    async post<T>(endpoint: string, body?: any, options: RequestInit = {}): Promise<{ data: T }> {
        let fetchBody: BodyInit | undefined;
        if (body instanceof URLSearchParams) {
            fetchBody = body;
        } else if (body !== undefined) {
            fetchBody = JSON.stringify(body);
        }

        return this.request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: fetchBody,
        });
    }
}

const apiClient = new ApiClient(API_BASE_URL);

// ============================================================================
// Auth API
// ============================================================================

export const authApi = {
    /**
     * Register a new user account
     * POST /register
     */
    register: async (email: string, password: string, username: string): Promise<User> => {
        const response = await apiClient.post<User>('/register', {
            email,
            password,
            username,
        })
        return response.data
    },

    /**
     * Check if a username is already in use
     * GET /check-username/{username}
     */
    checkUsername: async (username: string): Promise<{ exists: boolean }> => {
        const response = await apiClient.get<{ exists: boolean }>(`/check-username/${username}`)
        return response.data
    },

    /**
     * Login and get JWT token
     * POST /login (form data)
     */
    login: async (email: string, password: string): Promise<AuthResponse> => {
        const formData = new URLSearchParams()
        formData.append('username', email)
        formData.append('password', password)

        const response = await apiClient.post<AuthResponse>('/login', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })

        // Store the token
        if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', response.data.access_token)
        }
        return response.data
    },

    /**
     * Verify email address using token from email link
     * GET /verify-mail/{token}
     */
    verifyEmail: async (token: string): Promise<{ message: string }> => {
        const response = await apiClient.get<{ message: string }>(`/verify-mail/${token}`)
        return response.data
    },

    /**
     * Logout - clear stored token
     */
    logout: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token')
        }
    },

    /**
     * Get stored auth token
     */
    getToken: (): string | null => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('auth_token')
        }
        return null
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated: (): boolean => {
        if (typeof window !== 'undefined') {
            return !!localStorage.getItem('auth_token')
        }
        return false
    },

    /**
     * Get current user profile
     * GET /me
     */
    getMe: async (): Promise<User> => {
        const response = await apiClient.get<User>('/me')
        return response.data
    },
}

// ============================================================================
// Rooms API
// ============================================================================

export const roomsApi = {
    /**
     * Create a new game room
     * POST /rooms/
     */
    create: async (name: string, symbol: string, durationSeconds?: number): Promise<Room> => {
        const response = await apiClient.post<Room>('/rooms/', {
            name,
            symbol,
            ...(durationSeconds !== undefined && { duration_seconds: durationSeconds })
        })
        return response.data
    },

    /**
     * Join an existing room
     * POST /rooms/{room_id}/join
     */
    join: async (roomId: number): Promise<Room> => {
        const response = await apiClient.post<Room>(`/rooms/${roomId}/join`)
        return response.data
    },

    /**
     * List all rooms with optional pagination
     * GET /rooms/?skip={skip}&limit={limit}
     */
    list: async (skip: number = 0, limit: number = 100): Promise<Room[]> => {
        const response = await apiClient.get<Room[]>(`/rooms/?skip=${skip}&limit=${limit}`)
        return response.data
    },

    /**
     * Get rooms that are waiting for players
     */
    getWaitingRooms: async (): Promise<Room[]> => {
        const rooms = await roomsApi.list()
        return rooms.filter((room) => room.status === 'WAITING')
    },
}

// ============================================================================
// Trading/Game API
// ============================================================================

export const gameApi = {
    /**
     * Get portfolio for a specific room
     * GET /game/portfolio?room_id={room_id}
     */
    getPortfolio: async (roomId: number): Promise<Portfolio> => {
        const response = await apiClient.get<Portfolio>(`/game/portfolio?room_id=${roomId}`)
        return response.data
    },

    /**
     * Open a new trading position
     * POST /game/trade?room_id={room_id}
     */
    openTrade: async (
        roomId: number,
        side: 'LONG' | 'SHORT',
        quantity: number,
        leverage: number = 1
    ): Promise<Position> => {
        const response = await apiClient.post<Position>(`/game/trade?room_id=${roomId}`, {
            side,
            quantity,
            leverage,
        })
        return response.data
    },

    /**
     * Close an open position
     * POST /game/close/{position_id}
     */
    closeTrade: async (positionId: number): Promise<Position> => {
        const response = await apiClient.post<Position>(`/game/close/${positionId}`)
        return response.data
    },

    /**
     * Get all available tickers
     * GET /tickers
     */
    getTickers: async (): Promise<string[]> => {
        const response = await apiClient.get<string[]>('/tickers')
        return response.data
    },
}

// ============================================================================
// WebSocket Connections
// ============================================================================

/**
 * Create a Game WebSocket connection (public, no auth required)
 * WS /ws/game/{room_id}
 * 
 * Receives: waiting, game_start, game_update, game_end, error messages
 */
export const createGameWebSocket = (
    roomId: number,
    onMessage: (data: GameWebSocketMessage) => void,
    onError?: (error: Event) => void,
    onClose?: () => void
): WebSocket => {
    const wsUrl = `${WS_BASE_URL}/ws/game/${roomId}`
    const ws = new WebSocket(wsUrl)

    ws.onmessage = (event) => {
        try {
            const data: GameWebSocketMessage = JSON.parse(event.data)
            onMessage(data)
        } catch (error) {
            console.error('Failed to parse game WebSocket data:', error)
        }
    }

    ws.onerror = (error) => {
        console.error('Game WebSocket error:', error)
        onError?.(error)
    }

    ws.onclose = () => {
        console.log('Game WebSocket closed')
        onClose?.()
    }

    return ws
}

/**
 * Create a Portfolio WebSocket connection (authenticated)
 * WS /ws/portfolio/{room_id}
 * 
 * Must send auth message as first message after connecting.
 * Receives: auth_success, portfolio_update, error messages
 */
export const createPortfolioWebSocket = (
    roomId: number,
    token: string,
    onMessage: (data: PortfolioWebSocketMessage) => void,
    onError?: (error: Event) => void,
    onClose?: () => void
): WebSocket => {
    const wsUrl = `${WS_BASE_URL}/ws/portfolio/${roomId}`
    const ws = new WebSocket(wsUrl)

    ws.onopen = () => {
        // Send auth message as first message (required)
        ws.send(JSON.stringify({ type: 'auth', token }))
    }

    ws.onmessage = (event) => {
        try {
            const data: PortfolioWebSocketMessage = JSON.parse(event.data)
            onMessage(data)
        } catch (error) {
            console.error('Failed to parse portfolio WebSocket data:', error)
        }
    }

    ws.onerror = (error) => {
        console.error('Portfolio WebSocket error:', error)
        onError?.(error)
    }

    ws.onclose = () => {
        console.log('Portfolio WebSocket closed')
        onClose?.()
    }

    return ws
}

/**
 * Create a Chat WebSocket connection (authenticated)
 * WS /ws/chat/{room_id}
 * 
 * Must send auth message as first message after connecting.
 * Receives: auth_success, chat_message, system, error messages
 * Returns WebSocket and a sendMessage helper function
 */
export const createChatWebSocket = (
    roomId: number,
    token: string,
    onMessage: (data: ChatWebSocketMessage) => void,
    onError?: (error: Event) => void,
    onClose?: () => void
): { ws: WebSocket; sendMessage: (text: string) => void } => {
    const wsUrl = `${WS_BASE_URL}/ws/chat/${roomId}`
    const ws = new WebSocket(wsUrl)
    let isAuthenticated = false

    ws.onopen = () => {
        // Send auth message as first message (required)
        ws.send(JSON.stringify({ type: 'auth', token }))
    }

    ws.onmessage = (event) => {
        try {
            const data: ChatWebSocketMessage = JSON.parse(event.data)
            if (data.type === 'auth_success') {
                isAuthenticated = true
            }
            onMessage(data)
        } catch (error) {
            console.error('Failed to parse chat WebSocket data:', error)
        }
    }

    ws.onerror = (error) => {
        console.error('Chat WebSocket error:', error)
        onError?.(error)
    }

    ws.onclose = () => {
        console.log('Chat WebSocket closed')
        isAuthenticated = false
        onClose?.()
    }

    /**
     * Send a chat message (max 500 characters)
     */
    const sendMessage = (text: string) => {
        if (!isAuthenticated) {
            console.warn('Cannot send message: not authenticated yet')
            return
        }
        if (text.length > 500) {
            console.warn('Message truncated to 500 characters')
            text = text.slice(0, 500)
        }
        ws.send(JSON.stringify({ message: text }))
    }

    return { ws, sendMessage }
}

// ============================================================================
// Combined API Export
// ============================================================================

export const api = {
    auth: authApi,
    rooms: roomsApi,
    game: gameApi,
    createGameWebSocket,
    createPortfolioWebSocket,
    createChatWebSocket,
}

export default api
