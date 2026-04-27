"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ArrowRight, Mail } from "lucide-react"
import { useAuthStore } from "@/stores/authStore"
import { api } from "@/lib/api-client"
import { useCurrentUser } from "@/lib/hooks/use-auth"
import { InternzaLogo } from "@/components/brand/InternzaLogo"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const login = useAuthStore((state) => state.login)
  const { data: currentUser, isLoading: authLoading } = useCurrentUser()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect already logged-in users
  useEffect(() => {
    if (mounted && !authLoading && currentUser) {
      const role = currentUser.role?.trim()?.toLowerCase()
      if (role === "student") {
        router.push("/dashboard")
      } else if (role === "reviewer") {
        router.push("/reviewer/dashboard")
      } else if (role === "super_admin" || role === "superadmin") {
        router.push("/admin/dashboard")
      }
    }
  }, [currentUser, authLoading, router, mounted])

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // Form validation
    if (!email || !password) {
      setError("Email and password are required.")
      setIsLoading(false)
      return
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError("Please enter a valid email address.")
      setIsLoading(false)
      return
    }

    try {
      console.log('Attempting login with:', { email })
      const response: any = await api.post('/auth/signin', { email, password })
      
      console.log('Login response received:', response)
      
      // Handle TransformInterceptor wrapped response: { success, data, message, timestamp }
      const userData = response.data?.user || response.user
      
      // Validate response structure
      if (!userData) {
        console.error('Invalid response structure:', response)
        setError("Invalid response from server. Please try again.")
        setIsLoading(false)
        return
      }

      // Validate user has a role
      if (!userData.role) {
        console.error('User missing role:', userData)
        setError("Account configuration error. Please contact support.")
        setIsLoading(false)
        return
      }

      console.log('User authenticated successfully:', userData)

      // Clear any stale cached data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('internza-query-cache')
      }

      // Store user in Zustand (tokens are in cookies)
      login(userData)

      // Redirect based on role
      const role = userData.role?.trim()?.toLowerCase()
      console.log('Redirecting based on role (normalized):', role)
      console.log('Original role value:', userData.role)
      console.log('Role type:', typeof userData.role)
      
      if (role === "student") {
        console.log('Redirecting to student dashboard')
        router.push("/dashboard")
      } else if (role === "reviewer") {
        console.log('Redirecting to reviewer dashboard')
        router.push("/reviewer/dashboard")
      } else if (role === "super_admin" || role === "superadmin") {
        console.log('Redirecting to admin dashboard')
        router.push("/admin/dashboard")
      } else {
        // Fallback for unknown roles
        console.warn('Unknown role:', role)
        console.warn('Original role:', userData.role)
        console.warn('Available role values:', { role, userData })
        setError("Your account role is not recognized. Please contact support.")
        setIsLoading(false)
      }
    } catch (err: any) {
      console.error('Login error details:', err)
      console.error('Error message:', err.message)
      console.error('Error stack:', err.stack)
      
      // Handle specific error messages from backend - use exact backend messages
      if (err.message?.includes('Invalid credentials') || err.message?.includes('401')) {
        setError("Invalid email or password. Please try again.")
      } else if (err.message?.includes('not found') || err.message?.includes('404')) {
        setError("No account found with this email. Please sign up.")
      } else if (err.message?.includes('deactivated')) {
        setError("Your account has been deactivated. Please contact support.")
      } else if (err.message?.includes('network') || err.message?.includes('fetch') || err.message?.includes('ECONNREFUSED')) {
        setError("Network error. Please check your connection and ensure backend is running.")
      } else if (err.message?.includes('Session expired')) {
        setError("Session expired. Please try logging in again.")
      } else {
        // Display the exact backend error message
        setError(err.message || "Login failed. Please check your credentials.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <Link href="/" className="inline-flex items-center justify-center">
              <InternzaLogo />
            </Link>
            <h1 className="mt-6 text-2xl font-bold text-primary">Welcome back</h1>
            <p className="mt-2 text-sm text-secondary-600">
              Sign in to your proof portal
            </p>
          </div>
          
          <div className="rounded-xl bg-white p-8 shadow-sm border border-secondary-200">
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
                  <Input 
                    id="email" 
                    name="email"
                    type="email" 
                    placeholder="alex@university.edu" 
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input 
                    id="password" 
                    name="password"
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••"
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <Button 
                type="submit"
                className="w-full gap-2" 
                size="lg"
                isLoading={isLoading}
              >
                Sign In
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-secondary-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-secondary-500">Or continue with</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 rounded-lg border border-secondary-200 px-4 py-2 text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-2 rounded-lg border border-secondary-200 px-4 py-2 text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </button>
            </div>
          </div>
          
          <p className="text-center text-sm text-secondary-600">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
