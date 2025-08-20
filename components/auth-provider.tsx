"use client"

import { useEffect, useState, createContext, useContext, useMemo } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface User {
  id: string
  email: string
  name?: string
}

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  login: (email: string, name?: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

const STORAGE_KEY = 'mockstreet_user'

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Initialize from localStorage
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
      if (raw) setUser(JSON.parse(raw))
    } catch {}
    setIsLoading(false)
  }, [])

  // Route protection
  useEffect(() => {
    if (!isLoading && !user) {
      const protectedRoutes = ['/dashboard', '/battles', '/charts', '/leaderboard']
      if (protectedRoutes.includes(pathname)) {
        router.replace('/')
      }
    }
  }, [isLoading, user, router, pathname])

  const login = async (email: string, name?: string) => {
    const dummyUser: User = { id: 'dummy-' + Date.now(), email, name }
    setUser(dummyUser)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dummyUser))
    } catch {}
  }

  const logout = async () => {
    setUser(null)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
  }

  const value = useMemo(() => ({ user, isLoading, login, logout }), [user, isLoading])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}