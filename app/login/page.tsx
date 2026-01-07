"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { Loader2, AlertCircle } from "lucide-react"

export default function AuthPage() {
  const router = useRouter()
  const { login, register, isLoading, error, clearError } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    
    let success = false
    if (isLogin) {
      success = await login(email, password)
    } else {
      success = await register(email, password, username)
    }

    if (success) {
      router.push("/play")
    }
  }

  const handleModeSwitch = (loginMode: boolean) => {
    setIsLogin(loginMode)
    clearError()
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Simple header */}
      <header className="py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="font-bold text-xl tracking-tight hover:opacity-80 transition-opacity">
            Mockstreet
          </Link>
        </div>
      </header>

      {/* Auth form */}
      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Glass card */}
          <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            {/* Toggle buttons */}
            <div className="flex mb-8 p-1 rounded-full bg-white/5 border border-white/10 relative">
              {/* Sliding background */}
              <motion.div
                className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-white"
                animate={{ x: isLogin ? 0 : "calc(100% + 4px)" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
              <button
                type="button"
                onClick={() => handleModeSwitch(true)}
                className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-colors relative z-10 ${
                  isLogin ? "text-black" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => handleModeSwitch(false)}
                className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-colors relative z-10 ${
                  !isLogin ? "text-black" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign up
              </button>
            </div>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="mb-4 overflow-hidden"
                >
                  <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span className="flex-1">{error}</span>
                    <button
                      type="button"
                      onClick={clearError}
                      className="text-xs hover:underline"
                    >
                      Dismiss
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name field - slides down from top when switching to signup */}
              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, height: 0 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0, 
                      height: "auto",
                      transition: {
                        height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                        y: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                        opacity: { duration: 0.2, delay: 0.1 }
                      }
                    }}
                    exit={{ 
                      opacity: 0, 
                      y: -20, 
                      height: 0,
                      transition: {
                        height: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
                        y: { duration: 0.2 },
                        opacity: { duration: 0.15 }
                      }
                    }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="Choose a username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-white/5 border-white/10 focus:border-white/20"
                        required={!isLogin}
                        disabled={isLoading}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border-white/10 focus:border-white/20"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/5 border-white/10 focus:border-white/20"
                  required
                  disabled={isLoading}
                />
              </div>

              <AnimatePresence>
                {isLogin && (
                  <motion.div 
                    className="text-right"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.1 } }}
                    exit={{ opacity: 0 }}
                  >
                    <Link 
                      href="#" 
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button 
                type="submit" 
                className="w-full py-6 text-base" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </>
                ) : (
                  isLogin ? "Log in" : "Create account"
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#0a0a0a] px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="bg-white/5 border-white/10 hover:bg-white/10"
                type="button"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              <Button 
                variant="outline" 
                className="bg-white/5 border-white/10 hover:bg-white/10"
                type="button"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                Discord
              </Button>
            </div>
          </div>

          {/* Terms */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            By continuing, you agree to our{" "}
            <Link href="#" className="underline hover:text-foreground">Terms</Link>
            {" "}and{" "}
            <Link href="#" className="underline hover:text-foreground">Privacy Policy</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
