"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api, getErrorMessage } from "@/lib/api-client"
import { useAuthStore } from "@/stores/authStore"
import { toast } from "sonner"

// Types
export interface User {
  id: string
  email: string
  role: string
  isActive: boolean
  createdAt: string
  studentProfile?: {
    id: string
    userId: string
    firstName: string
    lastName: string
    university?: string
    gradYear?: number
    bio?: string
    phone?: string
    linkedIn?: string
    github?: string
  }
  reviewerProfile?: {
    id: string
    userId: string
    firstName: string
    lastName: string
    bio?: string
    expertise: string[]
  }
}

export interface UpdateProfileDto {
  firstName?: string
  lastName?: string
  university?: string
  gradYear?: number
  bio?: string
  phone?: string
  linkedIn?: string
  github?: string
}

// Query keys
export const authKeys = {
  all: ["auth"] as const,
  currentUser: () => [...authKeys.all, "currentUser"] as const,
}

/**
 * Hook to fetch current user
 * This replaces the direct API call in authStore
 */
export function useCurrentUser() {
  const setUser = useAuthStore((state) => state.setUser)
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated)
  const setUserRole = useAuthStore((state) => state.setUserRole)
  const setPermissions = useAuthStore((state) => state.setPermissions)

  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: async (): Promise<User> => {
      const response: any = await api.get("/auth/me")
      return response.data
    },
    onSuccess: (user) => {
      // Update Zustand store on successful fetch
      setUser(user)
      setIsAuthenticated(true)

      // Normalize role and set permissions
      const normalizedRole = user.role?.trim()?.toLowerCase()
      setUserRole(normalizedRole as any)

      // Set permissions based on role
      const ROLE_PERMISSIONS: Record<string, string[]> = {
        student: ["view_dashboard", "view_internships", "view_projects", "submit_tasks"],
        reviewer: ["view_dashboard", "review_submissions", "manage_projects"],
        super_admin: ["view_dashboard", "manage_users", "manage_internships", "manage_system"],
      }
      setPermissions(ROLE_PERMISSIONS[normalizedRole || ""] || [])
    },
    onError: (error) => {
      console.error("Failed to fetch current user:", error)
      // Clear auth state on error
      setIsAuthenticated(false)
      setUser(null)
    },
    // Allow refetch on mount so the query executes when component mounts
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    // Keep data fresh for 5 minutes
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Hook to update user profile
 * Uses useMutation for data modification
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateProfileDto): Promise<User> => {
      const response: any = await api.patch("/students/profile", data)
      return response.data
    },
    onSuccess: (updatedUser) => {
      // Invalidate and refetch current user query
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser() })

      // Optionally update the cache directly for optimistic updates
      queryClient.setQueryData(authKeys.currentUser(), updatedUser)
    },
    onError: (error: any) => {
      console.error("Failed to update profile:", error)
      toast.error("Failed to update profile", {
        description: getErrorMessage(error),
      })
    },
  })
}
