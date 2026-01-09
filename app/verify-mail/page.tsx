"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react"

function VerifyMailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  
  const { verifyEmail, isLoading: authLoading } = useAuth()
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState("")

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setVerificationStatus('error')
        setMessage("Invalid verification link. Token is missing.")
        return
      }

      setVerificationStatus('verifying')
      
      try {
        const success = await verifyEmail(token)
        if (success) {
          setVerificationStatus('success')
          setMessage("Your email has been successfully verified!")
          // Optional: Redirect after a delay
          // setTimeout(() => router.push("/login"), 3000)
        } else {
          setVerificationStatus('error')
          setMessage("Verification failed. The link may be invalid or expired.")
        }
      } catch (error) {
        setVerificationStatus('error')
        setMessage("An unexpected error occurred during verification.")
      }
    }

    if (verificationStatus === 'idle') {
      verify()
    }
  }, [token, verifyEmail, verificationStatus])

  return (
    <div className="w-full max-w-md">
      <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-center">
        
        {/* Icons based on status */}
        <div className="flex justify-center mb-6">
          {verificationStatus === 'verifying' && (
            <div className="p-4 rounded-full bg-blue-500/10 text-blue-500">
              <Loader2 className="w-12 h-12 animate-spin" />
            </div>
          )}
          
          {verificationStatus === 'success' && (
            <div className="p-4 rounded-full bg-green-500/10 text-green-500">
              <CheckCircle2 className="w-12 h-12" />
            </div>
          )}

          {verificationStatus === 'error' && (
            <div className="p-4 rounded-full bg-red-500/10 text-destructive">
              <AlertCircle className="w-12 h-12" />
            </div>
          )}
        </div>

        <h2 className="text-2xl font-bold mb-2">
          {verificationStatus === 'verifying' && "Verifying Email..."}
          {verificationStatus === 'success' && "Email Verified!"}
          {verificationStatus === 'error' && "Verification Failed"}
        </h2>

        <p className="text-muted-foreground mb-8">
          {message || (verificationStatus === 'verifying' ? "Please wait while we verify your email address." : "")}
        </p>

        {/* Actions */}
        <div className="space-y-3">
          {verificationStatus === 'success' && (
            <Button 
              className="w-full py-6 text-base" 
              size="lg"
              onClick={() => router.push("/login")}
            >
              Continue to Login
            </Button>
          )}

          {verificationStatus === 'error' && (
            <Button 
              className="w-full py-6 text-base" 
              size="lg"
              onClick={() => router.push("/login")}
            >
              Back to Login
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            className="w-full hover:bg-white/5"
            onClick={() => router.push("/")}
          >
            Return Home
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function VerifyMailPage() {
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

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Suspense fallback={
             <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Loading...</p>
             </div>
          }>
            <VerifyMailContent />
          </Suspense>
        </motion.div>
      </div>
    </div>
  )
}
