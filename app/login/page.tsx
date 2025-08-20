'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Mail, Lock, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'

interface LoginPageProps {}

/**
 * LoginPage Component
 * 
 * A dual-purpose authentication page that handles both user login and registration.
 * Features:
 * - Login form with email and password
 * - Registration form with full name, email, phone, and password
 * - Tabbed interface for switching between login and signup
 * - Responsive design with centered layout
 * 
 * @returns {JSX.Element} The rendered LoginPage component
 */
export default function LoginPage({}: LoginPageProps) {
  // State for login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // State for signup
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);

  const router = useRouter();
  const { login } = useAuth();

  // Handle login (Dummy)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    setLoginSuccess('');

    try {
      if (!loginEmail) {
        setLoginError('Please enter an email.');
      } else {
        await login(loginEmail);
        setLoginSuccess('Login successful! Redirecting...');
        setTimeout(() => router.push('/dashboard'), 600);
      }
    } catch (error) {
      setLoginError('An unexpected error occurred. Please try again.');
    }

    setLoginLoading(false);
  };

  // Handle signup (Dummy)
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupLoading(true);
    setSignupError('');
    setSignupSuccess('');

    try {
      if (!signupEmail || !signupName) {
        setSignupError('Please enter name and email.');
      } else {
        await login(signupEmail, signupName);
        setSignupSuccess('Account created! Redirecting...');
        setTimeout(() => router.push('/dashboard'), 600);
      }
    } catch (error) {
      setSignupError('An unexpected error occurred. Please try again.');
    }

    setSignupLoading(false);
  };

  return (
    // Main container with full height and centered content
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Welcome Message */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-4">
            <TrendingUp className="h-8 w-8 text-primary" />
            <span className="font-bold text-2xl">MockStreet</span>
          </Link>
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your trading account</p>
        </div>

        {/* Authentication Tabs */}
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* Login Form Tab */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Enter your email to access your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Email Input */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="trader@example.com" 
                        className="pl-10" 
                        value={loginEmail}
                        onChange={e => setLoginEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Password Input (disabled in dummy mode) */}
                  <div className="space-y-2 opacity-60">
                    <Label htmlFor="password">Password (disabled in test mode)</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="••••••••" 
                        className="pl-10" 
                        value={loginPassword}
                        onChange={e => setLoginPassword(e.target.value)}
                        disabled
                      />
                    </div>
                  </div>

                  {/* Error/Success Messages */}
                  {loginError && <div className="text-red-500 text-sm text-center">{loginError}</div>}
                  {loginSuccess && <div className="text-green-500 text-sm text-center">{loginSuccess}</div>}

                  {/* Login Button */}
                  <Button className="w-full" type="submit" disabled={loginLoading}>
                    {loginLoading ? (
                      <span className="flex items-center space-x-2">
                        <span className="animate-spin">⌛</span>
                        <span>Logging in...</span>
                      </span>
                    ) : 'Login'}
                  </Button>
                </form>

                {/* Password Reset Link */}
                <div className="text-center">
                  <span className="text-sm text-muted-foreground">
                    Password reset disabled in test mode
                  </span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sign Up Form Tab */}
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>Dummy signup for testing only</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSignup} className="space-y-4">
                  {/* Full Name Input */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="name" 
                        type="text" 
                        placeholder="John Doe" 
                        className="pl-10" 
                        value={signupName}
                        onChange={e => setSignupName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="signup-email" 
                        type="email" 
                        placeholder="trader@example.com" 
                        className="pl-10" 
                        value={signupEmail}
                        onChange={e => setSignupEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Password Input (disabled in dummy mode) */}
                  <div className="space-y-2 opacity-60">
                    <Label htmlFor="signup-password">Password (disabled in test mode)</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="signup-password" 
                        type="password" 
                        placeholder="••••••••" 
                        className="pl-10" 
                        value={signupPassword}
                        onChange={e => setSignupPassword(e.target.value)}
                        disabled
                      />
                    </div> 
                  </div>

                  {/* Error/Success Messages */}
                  {signupError && <div className="text-red-500 text-sm text-center">{signupError}</div>}
                  {signupSuccess && <div className="text-green-500 text-sm text-center">{signupSuccess}</div>}

                  {/* Sign Up Button */}
                  <Button className="w-full" type="submit" disabled={signupLoading}>
                    {signupLoading ? (
                      <span className="flex items-center space-x-2">
                        <span className="animate-spin">⌛</span>
                        <span>Creating Account...</span>
                      </span>
                    ) : 'Create Account'}
                  </Button>
                </form>

                {/* Terms and Privacy Policy */}
                <p className="text-xs text-muted-foreground text-center">
                  By creating an account in test mode, no data is stored on servers.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
