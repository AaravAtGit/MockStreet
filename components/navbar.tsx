"use client"

import { Button } from "@/components/ui/button"
import { TrendingUp } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase.js';
import type { Session } from '@supabase/supabase-js';

export function Navbar() {
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    getSession();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

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
            {session && (
              <>
                <Link href="/battles" className="text-foreground hover:text-primary transition-colors">
                  Battles
                </Link>
                <Link href="/charts" className="text-foreground hover:text-primary transition-colors">
                  Charts
                </Link>
                <Link href="/leaderboard" className="text-foreground hover:text-primary transition-colors">
                  Leaderboard
                </Link>
                <Link href="/dashboard" className="text-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {!session ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/login">Sign Up</Link>
                </Button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  )
}
 