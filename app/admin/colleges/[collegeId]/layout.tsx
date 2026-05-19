"use client"

import { useParams } from "next/navigation"
import { CollegeAdminShell } from "@/components/college/CollegeAdminShell"
import { useCollegeDashboard } from "@/lib/hooks/use-college-admin"
import { Loader2 } from "lucide-react"

export default function CollegeAdminLayout({ children }: { children: React.ReactNode }) {
  const collegeId = useParams().collegeId as string
  const { data: dashboard, isLoading } = useCollegeDashboard(collegeId)

  if (isLoading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-secondary-50">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </section>
    )
  }

  const college = dashboard?.college as { name?: string; logoUrl?: string | null } | undefined

  return (
    <CollegeAdminShell
      collegeId={collegeId}
      collegeName={college?.name}
      collegeLogoUrl={college?.logoUrl}
    >
      {children}
    </CollegeAdminShell>
  )
}
