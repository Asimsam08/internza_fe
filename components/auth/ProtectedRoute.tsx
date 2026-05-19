"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/authStore"
import { useCurrentUser } from "@/lib/hooks/use-auth"
import { UserRole } from "@/lib/types"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
  redirectTo?: string
}

export default function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const router = useRouter()
  const { userRole } = useAuthStore()
  const { isLoading, data } = useCurrentUser()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Determine if user is authenticated based on React Query data
  const isAuthenticated = !!data

  // Normalize role for comparison (prefer React Query data, fallback to Zustand)
  const normalizedRole = data?.role?.trim()?.toLowerCase() || userRole?.trim()?.toLowerCase()

  useEffect(() => {
    if (!isLoading && mounted) {
      if (!isAuthenticated) {
        // Not authenticated, redirect to login
        router.push(redirectTo)
      } else if (allowedRoles && normalizedRole && !allowedRoles.includes(normalizedRole as UserRole)) {
        // Authenticated but wrong role, redirect based on role
        if (normalizedRole === "student") {
          router.push("/dashboard")
        } else if (normalizedRole === "reviewer" || normalizedRole === "college_admin") {
          router.push(
            normalizedRole === "college_admin"
              ? (data as { collegeId?: string })?.collegeId
                ? `/admin/colleges/${(data as { collegeId: string }).collegeId}`
                : "/login"
              : "/reviewer/dashboard",
          )
        } else if (normalizedRole === "super_admin") {
          router.push("/admin/dashboard")
        }
      }
    }
  }, [isAuthenticated, isLoading, normalizedRole, allowedRoles, redirectTo, router, mounted, data])

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return null
  }

  // Show loading state while checking session
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Not authenticated (will redirect in useEffect)
  if (!isAuthenticated) {
    return null
  }

  // Authenticated but wrong role (will redirect in useEffect)
  if (allowedRoles && normalizedRole && !allowedRoles.includes(normalizedRole as UserRole)) {
    return null
  }

  // Authenticated and has correct role
  return <>{children}</>
}
