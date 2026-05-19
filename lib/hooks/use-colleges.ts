"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api, apiUpload } from "@/lib/api-client"
import { toast } from "sonner"

export interface CollegeRow {
  id: string
  name: string
  domain: string
  logoUrl: string | null
  cohortsCount: number
  studentsTotal: number
  createdAt: string
}

export function useSuperAdminColleges() {
  return useQuery({
    queryKey: ["super-admin", "colleges"],
    queryFn: async () => {
      const res = await api.get<{ data: CollegeRow[] }>("/super-admin/colleges")
      return res.data
    },
  })
}

export function useCreateCollege() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: {
      name: string
      domain: string
      primaryAdminEmail: string
      logo: File
    }) => {
      const fd = new FormData()
      fd.append("name", payload.name)
      fd.append("domain", payload.domain)
      fd.append("primaryAdminEmail", payload.primaryAdminEmail)
      fd.append("logo", payload.logo)
      return apiUpload("/super-admin/colleges", fd)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["super-admin", "colleges"] })
      toast.success("College created and invite sent")
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useResendCollegeInvite() {
  return useMutation({
    mutationFn: async ({ collegeId, email }: { collegeId: string; email: string }) =>
      api.post(`/super-admin/colleges/${collegeId}/invite-admin`, { email }),
    onSuccess: () => toast.success("Invite resent"),
    onError: (e: Error) => toast.error(e.message),
  })
}
