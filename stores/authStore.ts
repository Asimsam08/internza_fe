"use client"

import { create } from "zustand"
import { User, UserRole, Permission, ROLE_PERMISSIONS } from "@/lib/types"
import { api } from "@/lib/api-client"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  userRole: UserRole | null
  permissions: Permission[]
  setUser: (user: User | null) => void
  login: (user: User) => void
  logout: () => Promise<void>
  setLoading: (loading: boolean) => void
  checkSession: () => Promise<void>
  hasPermission: (permission: Permission) => boolean
  isSuperAdmin: () => boolean
  isReviewer: () => boolean
  isStudent: () => boolean
  canReviewSubmissions: () => boolean
  canIssueCertificate: () => boolean
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start with true to wait for session check on page reload
  userRole: null,
  permissions: [],

  setUser: (user) => {
    if (user) {
      // Validate user has a role
      if (!user.role) {
        console.error('User object missing role:', user)
        set({
          user: null,
          isAuthenticated: false,
          userRole: null,
          permissions: [],
        })
        return
      }
      
      const permissions = ROLE_PERMISSIONS[user.role] || []
      set({
        user,
        isAuthenticated: true,
        userRole: user.role,
        permissions,
      })
    } else {
      set({
        user: null,
        isAuthenticated: false,
        userRole: null,
        permissions: [],
      })
    }
  },

  login: (user) => {
    // Validate user has a role
    if (!user.role) {
      console.error('User object missing role:', user)
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        userRole: null,
        permissions: [],
      })
      return
    }
    
    // Normalize role to lowercase for consistency
    const normalizedRole = user.role?.trim()?.toLowerCase() as UserRole
    const permissions = ROLE_PERMISSIONS[normalizedRole] || []
    set({
      user,
      isAuthenticated: true,
      isLoading: false,
      userRole: normalizedRole,
      permissions,
    })
  },

  logout: async () => {
    try {
      // Call backend logout endpoint
      await api.post('/auth/logout', {})
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear local state regardless of API call success
      set({
        user: null,
        isAuthenticated: false,
        userRole: null,
        permissions: [],
      })
      set({ isLoading: false })

      // Clear persisted React Query cache
      if (typeof window !== 'undefined') {
        localStorage.removeItem('internza-query-cache')
        // Force full page reload to clear all state
        window.location.href = '/login'
      }
    }
  },

  setLoading: (loading) => set({ isLoading: loading }),

  checkSession: async () => {
    set({ isLoading: true })
    try {
      const response: any = await api.get('/auth/me')

      // Handle TransformInterceptor wrapped response: { success, data, message, timestamp }
      // The user object is directly in response.data (not response.data.user)
      const user = response.data

      // Validate user has a role
      if (!user || !user.role) {
        console.error('Session check failed: user missing role', user)
        set({
          user: null,
          isAuthenticated: false,
          userRole: null,
          permissions: [],
          isLoading: false,
        })
        return
      }

      const normalizedRole = user.role?.trim()?.toLowerCase() as UserRole
      const permissions = ROLE_PERMISSIONS[normalizedRole] || []
      set({
        user,
        isAuthenticated: true,
        userRole: normalizedRole,
        permissions,
        isLoading: false,
      })
    } catch (error) {
      // Session not valid or expired
      console.error('Session check error:', error)
      set({
        user: null,
        isAuthenticated: false,
        userRole: null,
        permissions: [],
        isLoading: false,
      })
    }
  },

  hasPermission: (permission) => {
    const { permissions } = get()
    return permissions.includes(permission)
  },

  isSuperAdmin: () => get().userRole === "super_admin",
  isReviewer: () => get().userRole === "reviewer",
  isStudent: () => get().userRole === "student",

  canReviewSubmissions: () => get().permissions.includes("review_submissions"),
  canIssueCertificate: () => get().permissions.includes("issue_certificate"),
}))
