"use client"

import { useState, useEffect } from "react"
import { authApi } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, LogIn, UserPlus, AlertCircle, Check, X } from "lucide-react"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AuthModal({ open, onOpenChange, onSuccess }: AuthModalProps) {
  const { login, register, isLoading, error, clearError } = useAuth()
  const [mode, setMode] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)

  useEffect(() => {
    const checkUsername = async () => {
      if (username.length < 3) {
        setUsernameAvailable(null)
        return
      }
      
      setIsCheckingUsername(true)
      try {
        const { exists } = await authApi.checkUsername(username)
        // If exists is true, available is false
        setUsernameAvailable(!exists)
      } catch (error) {
        console.error("Failed to check username", error)
        setUsernameAvailable(null)
      } finally {
        setIsCheckingUsername(false)
      }
    }

    const timer = setTimeout(checkUsername, 500)
    return () => clearTimeout(timer)
  }, [username])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    let success = false
    if (mode === "login") {
      success = await login(email, password)
    } else {
      if (usernameAvailable === false) {
        return
      }
      success = await register(email, password, username)
    }

    if (success) {
      onOpenChange(false)
      onSuccess?.()
      // Reset form
      setEmail("")
      setPassword("")
      setUsername("")
      setUsernameAvailable(null)
    }
  }

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login")
    clearError()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === "login" ? (
              <>
                <LogIn className="w-5 h-5" />
                Sign In
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Create Account
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {mode === "login"
              ? "Enter your credentials to access Trading Duels"
              : "Create an account to start competing"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {mode === "register" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="username">Username</Label>
                {username.length >= 3 && (
                  <span className="text-xs flex items-center gap-1">
                    {isCheckingUsername ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin"/> Checking...
                      </>
                    ) : usernameAvailable === true ? (
                      <span className="text-green-600 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Available
                      </span>
                    ) : usernameAvailable === false ? (
                      <span className="text-destructive flex items-center gap-1">
                        <X className="w-3 h-3" /> Taken
                      </span>
                    ) : null}
                  </span>
                )}
              </div>
              <Input
                id="username"
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required={mode === "register"}
                disabled={isLoading}
                className={usernameAvailable === false ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {usernameAvailable === false && (
                 <p className="text-xs text-destructive">This username is already taken.</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-foreground hover:bg-foreground/90 text-background"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {mode === "login" ? "Signing in..." : "Creating account..."}
              </>
            ) : mode === "login" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-foreground hover:underline font-medium"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-foreground hover:underline font-medium"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
