"use client"

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase.js';
import type { Session } from '@supabase/supabase-js';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setIsLoading(false);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // Redirect non-logged-in users from protected pages
  useEffect(() => {
    if (!isLoading && !session) {
      const protectedRoutes = [
        '/dashboard', '/battles', '/challenge', '/charts', '/leaderboard'
      ];
      
      if (protectedRoutes.includes(pathname)) {
        router.replace('/');
      }
    }
  }, [isLoading, session, router, pathname]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return <>{children}</>;
}