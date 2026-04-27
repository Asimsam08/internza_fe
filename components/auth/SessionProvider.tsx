"use client"

import { useCurrentUser } from "@/lib/hooks/use-auth"

export default function SessionProvider({ children }: { children: React.ReactNode }) {
  // This hook will automatically fetch the current user on mount
  // and manage the loading state for us
  useCurrentUser()

  return <>{children}</>
}
