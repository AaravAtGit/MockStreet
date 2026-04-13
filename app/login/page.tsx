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
          </div>

          {/* Terms */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            By continuing, you agree to our{" "}
            <Link href="/terms-conditions" className="underline hover:text-foreground">Terms</Link>
            {" "}and{" "}
            <Link href="/privacy-policy" className="underline hover:text-foreground">Privacy Policy</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
