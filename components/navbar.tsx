"use client"

import { Button } from "@/components/ui/button"
import { TrendingUp } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"

export function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl">MockStreet</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/challenge" className="text-foreground hover:text-primary transition-colors">
              Challenge
            </Link>
            {user && (
              <>
                <Link href="/battles" className="text-foreground hover:text-primary transition-colors">
                  Battles
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {!user ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/login">Sign Up</Link>
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => logout()}>Logout</Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
