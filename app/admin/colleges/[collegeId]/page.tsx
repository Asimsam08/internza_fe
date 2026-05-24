"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCollegeCohorts, useCollegeDashboard } from "@/lib/hooks/use-college-admin"
import { Loader2, Plus, Users, GraduationCap, TrendingUp } from "lucide-react"
import { NewCohortWizard } from "@/components/college/NewCohortWizard"
import { CohortsTable, type CohortRow } from "@/components/college/CohortsTable"
import { CollegeLogoUpload } from "@/components/college/college-logo-upload"

export default function CollegeAdminDashboardPage() {
  const collegeId = useParams().collegeId as string
  const { data: dashboard, isLoading: dashLoading, isError: dashError } = useCollegeDashboard(collegeId)
  const { data: cohorts = [], isLoading: cohortsLoading } = useCollegeCohorts(collegeId)
  const [wizardOpen, setWizardOpen] = useState(false)

  const stats = dashboard?.stats as
    | { activeCohorts?: number; students?: number; completionPct?: number }
    | undefined

  const college = dashboard?.college as
    | { name?: string; logoUrl?: string | null }
    | undefined

  const draftCount = (cohorts as CohortRow[]).filter((c) => c.needsLaunch).length

  if (dashLoading) {
    return <Loader2 className="h-8 w-8 animate-spin mx-auto mt-12" />
  }

  if (dashError) {
    return (
      <p className="text-center text-red-600 mt-12">
        Could not load college dashboard. Check that you are signed in as college admin.
      </p>
    )
  }

  return (
    <section className="space-y-8 max-w-6xl">
      <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
        <article>
          <h2 className="text-2xl font-bold text-secondary-900 tracking-tight">Overview</h2>
          <p className="text-secondary-600 mt-1">
            Manage cohorts, enroll students, and track internship completion for your college.
          </p>
        </article>
        <CollegeLogoUpload
          collegeId={collegeId}
          logoUrl={college?.logoUrl}
          collegeName={college?.name}
        />
      </header>

      {draftCount > 0 && (
        <article className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <strong>{draftCount}</strong> cohort{draftCount > 1 ? "s need" : " needs"} student upload to go live.
          Use <strong>Upload & launch</strong> in the table below.
        </article>
      )}

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-secondary-600">Active cohorts</CardTitle>
            <GraduationCap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.activeCohorts ?? 0}</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-secondary-600">Students enrolled</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.students ?? 0}</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-secondary-600">Completion rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.completionPct ?? 0}%</p>
          </CardContent>
        </Card>
      </section>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <article>
            <CardTitle>Cohorts</CardTitle>
            <CardDescription>Create batches, assign templates, and launch student enrollments.</CardDescription>
          </article>
          <Button onClick={() => setWizardOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New cohort
          </Button>
        </CardHeader>
        <CardContent>
          {cohortsLoading ? (
            <Loader2 className="h-6 w-6 animate-spin mx-auto py-8" />
          ) : (
            <CohortsTable collegeId={collegeId} cohorts={cohorts as CohortRow[]} />
          )}
        </CardContent>
      </Card>

      <NewCohortWizard collegeId={collegeId} open={wizardOpen} onOpenChange={setWizardOpen} />
    </section>
  )
}
