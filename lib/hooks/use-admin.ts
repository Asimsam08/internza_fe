import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api, getErrorMessage } from "@/lib/api-client"
import { toast } from "sonner"

// Query keys
export const adminKeys = {
  all: ["admin"] as const,
  users: () => [...adminKeys.all, "users"] as const,
  reviewers: () => [...adminKeys.all, "reviewers"] as const,
}

export interface User {
  id: string
  email: string
  role: string
  isActive: boolean
  createdAt: string
  name: string
  studentProfile?: {
    firstName: string
    lastName: string
    university?: string
    graduationYear?: number
  }
  reviewerProfile?: {
    id: string
    firstName: string
    lastName: string
  }
}

export interface CreateReviewerInput {
  fullName: string
  email: string
  password: string
}

export interface AssignReviewerInput {
  templateId: string
  reviewerId: string
}

/**
 * Hook to fetch all users (admin only)
 */
export function useUsers() {
  return useQuery({
    queryKey: adminKeys.users(),
    queryFn: async (): Promise<User[]> => {
      const response: any = await api.get("/admin/users")
      return response.data || response
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to fetch reviewers only
 */
export function useReviewers() {
  return useQuery({
    queryKey: adminKeys.reviewers(),
    queryFn: async (): Promise<User[]> => {
      const response: any = await api.get("/admin/users?role=reviewer")
      return response.data || response
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to create a new reviewer (admin only)
 */
export function useCreateReviewer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateReviewerInput) => {
      const response: any = await api.post("/admin/users/reviewer", data)
      return response.data || response
    },
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: adminKeys.users() })
      queryClient.invalidateQueries({ queryKey: adminKeys.reviewers() })
      toast.success("Reviewer created successfully")
    },
    onError: (error: any) => {
      toast.error("Failed to create reviewer", {
        description: getErrorMessage(error),
      })
    },
  })
}

/**
 * Hook to assign reviewer to a template
 */
export function useAssignReviewer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: AssignReviewerInput) => {
      const response: any = await api.put(`/admin/templates/${data.templateId}/assign-reviewer`, { reviewerId: data.reviewerId })
      return response.data || response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] })
      toast.success("Reviewer assigned successfully")
    },
    onError: (error: any) => {
      toast.error("Failed to assign reviewer", {
        description: getErrorMessage(error),
      })
    },
  })
}

/**
 * Hook to unassign reviewer from a template
 */
export function useUnassignReviewer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (templateId: string) => {
      const response: any = await api.put(`/admin/templates/${templateId}/assign-reviewer`, { reviewerId: null })
      return response.data || response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] })
      toast.success("Reviewer unassigned successfully")
    },
    onError: (error: any) => {
      toast.error("Failed to unassign reviewer", {
        description: getErrorMessage(error),
      })
    },
  })
}
