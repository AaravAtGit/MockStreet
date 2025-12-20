"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="font-bold text-xl tracking-tight">
            MockStreet
          </Link>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="#">Log in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="#">Sign up</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
