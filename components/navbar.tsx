"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { LogOut, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Navbar() {
  const { isAuthenticated, user, logout, isLoading } = useAuth()

  const userInitials = (user?.username || user?.email || "U").slice(0, 2).toUpperCase()
  const avatarUrl = user?.email 
    ? `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(user.email)}`
    : undefined

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl">
      <div className="px-6 py-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]">
        <div className="flex justify-between items-center">
          <Link href="/" className="font-bold text-lg tracking-tight">
            Mockstreet
          </Link>

          <div className="flex items-center gap-2">
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
            ) : isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-9 w-9 rounded-full hover:bg-white/10 p-0"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={avatarUrl} alt={user?.email || "User"} />
                      <AvatarFallback className="bg-white/10 text-xs">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={avatarUrl} alt={user?.email || "User"} />
                      <AvatarFallback className="bg-white/10 text-xs">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user?.username || "Trader"}</span>
                      <span className="text-xs text-muted-foreground truncate max-w-[160px]">
                        {user?.email}
                      </span>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/play" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Play Now
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={logout}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="rounded-full hover:bg-white/10"
                  asChild
                >
                  <Link href="/play">Play</Link>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="rounded-full hover:bg-white/10"
                  asChild
                >
                  <Link href="/login">Log in</Link>
                </Button>
                <Button 
                  size="sm" 
                  className="rounded-full"
                  asChild
                >
                  <Link href="/login">Sign up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
