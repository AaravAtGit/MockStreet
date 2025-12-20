"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Navbar() {
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl">
      <div className="px-6 py-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]">
        <div className="flex justify-between items-center">
          <Link href="/" className="font-bold text-lg tracking-tight">
            Mockstreet
          </Link>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="rounded-full hover:bg-white/10" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button size="sm" className="rounded-full" asChild>
              <Link href="/login">Sign up</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}


