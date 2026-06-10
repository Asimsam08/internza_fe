"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { api, unwrapApiData } from "@/lib/api-client"

export interface WaitlistEntry {
  id: string
  email: string
  createdAt: string
}

export interface WaitlistListResponse {
  entries: WaitlistEntry[]
  total: number
}

export function useJoinWaitlist() {
  return useMutation({
    mutationFn: async (email: string) => {
      const res = await api.post<{ data: WaitlistEntry }>("/waitlist", { email })
      return unwrapApiData<WaitlistEntry>(res)
    },
  })
}

export function useWaitlistEntries() {
  return useQuery({
    queryKey: ["super-admin", "waitlist"],
    queryFn: async () => {
      const res = await api.get<{ data: WaitlistListResponse }>("/super-admin/waitlist")
      return unwrapApiData<WaitlistListResponse>(res)
    },
  })
}
