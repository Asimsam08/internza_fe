import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api, getErrorMessage, unwrapApiData } from "@/lib/api-client"
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

export interface InviteReviewerInput {
  fullName: string
  email: string
}

export interface InviteReviewerResult {
  email: string
  fullName: string
  inviteSent: boolean
  inviteUrl?: string
  expiresAt: string
  message: string
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
      return unwrapApiData<User[]>(await api.get("/admin/users"))
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
      return unwrapApiData<User[]>(await api.get("/admin/users?role=reviewer"))
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to invite a global reviewer by email (admin only)
 */
export function useInviteReviewer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: InviteReviewerInput) => {
      return unwrapApiData<InviteReviewerResult>(
        await api.post("/admin/users/reviewer", data),
      )
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() })
      queryClient.invalidateQueries({ queryKey: adminKeys.reviewers() })
      if (result.inviteSent) {
        toast.success("Reviewer invite email sent", { description: result.email })
      } else {
        toast.warning("Invite created — copy the link below to share manually")
      }
      return result
    },
    onError: (error: unknown) => {
      toast.error("Failed to send reviewer invite", {
        description: getErrorMessage(error),
      })
    },
  })
}

/** @deprecated use useInviteReviewer */
export const useCreateReviewer = useInviteReviewer

/**
 * Hook to assign reviewer to a template
 */
export function useAssignReviewer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: AssignReviewerInput) => {
      return unwrapApiData(
        await api.put(`/admin/templates/${data.templateId}/assign-reviewer`, { reviewerId: data.reviewerId }),
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] })
      toast.success("Reviewer assigned successfully")
    },
    onError: (error: unknown) => {
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
      return unwrapApiData(
        await api.put(`/admin/templates/${templateId}/assign-reviewer`, { reviewerId: null }),
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] })
      toast.success("Reviewer unassigned successfully")
    },
    onError: (error: unknown) => {
      toast.error("Failed to unassign reviewer", {
        description: getErrorMessage(error),
      })
    },
  })
}
