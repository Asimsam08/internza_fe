"use client"

import { useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api, apiUpload, getErrorMessage, type ApiResponse } from "@/lib/api-client"
import { useAuthStore } from "@/stores/authStore"
import type { User, UserRole } from "@/lib/types"
import { toast } from "sonner"

export type { User }

/** Raw `/auth/me` payload (dates as ISO strings). */
interface MeResponse {
  id: string
  email: string
  role: string
  collegeId?: string | null
  isActive: boolean
  createdAt: string
  updatedAt?: string
  name?: string
  avatar?: string
  profileImagePath?: string
  college?: User["college"]
  studentProfile?: {
    id: string
    userId: string
    firstName: string
    lastName: string
    university?: string
    graduationYear?: number
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

function toStoreUser(raw: MeResponse): User {
  const createdAt = new Date(raw.createdAt)
  const displayName =
    raw.name ??
    (raw.studentProfile
      ? `${raw.studentProfile.firstName} ${raw.studentProfile.lastName}`.trim()
      : undefined)

  return {
    id: raw.id,
    email: raw.email,
    name: displayName || undefined,
    avatar: raw.avatar,
    role: raw.role as UserRole,
    collegeId: raw.collegeId,
    isActive: raw.isActive,
    college: raw.college,
    createdAt,
    updatedAt: new Date(raw.updatedAt ?? raw.createdAt),
    studentProfile: raw.studentProfile
      ? {
          firstName: raw.studentProfile.firstName,
          lastName: raw.studentProfile.lastName,
          university: raw.studentProfile.university ?? "",
          graduationYear: raw.studentProfile.graduationYear ?? 0,
          gradYear: raw.studentProfile.graduationYear,
          bio: raw.studentProfile.bio,
          phone: raw.studentProfile.phone,
          linkedIn: raw.studentProfile.linkedIn,
          github: raw.studentProfile.github,
        }
      : undefined,
    reviewerProfile: raw.reviewerProfile
      ? {
          firstName: raw.reviewerProfile.firstName,
          lastName: raw.reviewerProfile.lastName,
          company: "",
          designation: raw.reviewerProfile.expertise?.[0] ?? "",
        }
      : undefined,
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

export const authKeys = {
  all: ["auth"] as const,
  currentUser: () => [...authKeys.all, "currentUser"] as const,
}

export function useCurrentUser() {
  const setUser = useAuthStore((state) => state.setUser)

  const query = useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: async (): Promise<User> => {
      const response = await api.get<ApiResponse<MeResponse>>("/auth/me")
      return toStoreUser(response.data)
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000,
  })

  useEffect(() => {
    if (query.data) {
      setUser(query.data)
    }
    if (query.isError) {
      setUser(null)
    }
  }, [query.data, query.isError, setUser])

  return query
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateProfileDto): Promise<User> => {
      const response = await api.patch<ApiResponse<MeResponse>>("/students/profile", data)
      return toStoreUser(response.data)
    },
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser() })
      queryClient.setQueryData(authKeys.currentUser(), updatedUser)
    },
    onError: (error: unknown) => {
      console.error("Failed to update profile:", error)
      toast.error("Failed to update profile", {
        description: getErrorMessage(error),
      })
    },
  })
}


export function useUpdateProfilePicture() {
  const queryClient = useQueryClient()
  const setUser = useAuthStore((state) => state.setUser)

  return useMutation({
    mutationFn: async (file: File): Promise<User> => {

      const formData = new FormData()

      formData.append("file", file)

      const response = await apiUpload<
        ApiResponse<MeResponse>
      >(
        "/auth/profile-picture",
        formData,
        "PATCH",
      )

      return toStoreUser(response.data)
    },

    onSuccess: (updatedUser) => {

      // Update Zustand store
      setUser(updatedUser)

      // Update React Query cache
      queryClient.setQueryData(
        authKeys.currentUser(),
        updatedUser,
      )

      // Optional revalidate
      queryClient.invalidateQueries({
        queryKey: authKeys.currentUser(),
      })
      
      toast.success(
        "Profile picture updated",
      )
    },

    onError: (error: unknown) => {

      console.error(
        "Failed to update profile picture:",
        error,
      )

      toast.error(
        "Failed to update profile picture",
        {
          description:
            getErrorMessage(error),
        },
      )
    },
  })
}