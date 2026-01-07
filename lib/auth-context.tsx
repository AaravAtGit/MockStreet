"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { authApi, type User } from "./api"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, username: string) => Promise<boolean>
  verifyEmail: (token: string) => Promise<boolean>
  logout: () => void
  clearError: () => void
}

const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as any).response
    if (response?.data?.detail) {
      return response.data.detail
    }
  }
  return error instanceof Error ? error.message : defaultMessage
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = authApi.getToken()
      if (token) {
        try {
          const user = await authApi.getMe()
          setUser(user)
        } catch (error) {
          console.error("Failed to fetch user profile", error)
          // If we can't get profile, maybe token is invalid?
          // For now, keep token but don't set user, or logout?
          // Let's safe fail to null user but keep token check logic if any
          authApi.logout() // Force logout if token is invalid
        }
      }
      setIsLoading(false)
    }
    checkAuth()
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    try {
      await authApi.login(email, password)
      const user = await authApi.getMe()
      setUser(user)
      setIsLoading(false)
      return true
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Login failed. Please check your credentials.")
      setError(errorMessage)
      setIsLoading(false)
      return false
    }
  }, [])

  const register = useCallback(async (email: string, password: string, username: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    try {
      const newUser = await authApi.register(email, password, username)
      // After registration, log them in
      await authApi.login(email, password)
      const user = await authApi.getMe()
      setUser(user)
      setIsLoading(false)
      return true
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Registration failed. Please try again.")
      setError(errorMessage)
      setIsLoading(false)
      return false
    }
  }, [])

  const verifyEmail = useCallback(async (token: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    try {
      await authApi.verifyEmail(token)
      // Update user's verified status
      if (user) {
        setUser({ ...user, is_verified: true })
      }
      setIsLoading(false)
      return true
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Email verification failed.")
      setError(errorMessage)
      setIsLoading(false)
      return false
    }
  }, [user])

  const logout = useCallback(() => {
    authApi.logout()
    setUser(null)
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const isAuthenticated = !!user && authApi.isAuthenticated()

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        register,
        verifyEmail,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
