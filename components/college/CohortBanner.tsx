"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Trophy } from "lucide-react"
import { formatCohortName, type StudentCohortContext } from "@/lib/cohort-labels"
import { CollegeLogoMark } from "@/components/college/CollegeLogoMark"

export type CohortBannerData = StudentCohortContext

export function CohortBanner({ cohort }: { cohort: CohortBannerData }) {
  return (
    <Card className="overflow-hidden border-primary-200 bg-gradient-to-r from-primary-50/90 via-white to-white shadow-sm">
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4 min-w-0 flex-1">
            <CollegeLogoMark
              logoUrl={cohort.collegeLogoUrl}
              collegeName={cohort.collegeName ?? "College"}
              size="lg"
            />
            <div className="min-w-0 flex-1 pt-0.5">
              {cohort.collegeName ? (
                <p className="text-xs font-medium uppercase tracking-wide text-secondary-500 truncate">
                  {cohort.collegeName}
                </p>
              ) : null}
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold text-secondary-900 leading-tight truncate">
                  {formatCohortName(cohort)}
                </h2>
                <Badge variant="secondary" className="shrink-0 font-medium">
                  Cohort
                </Badge>
              </div>
              <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-secondary-600">
                {cohort.weekLabel ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 shrink-0 text-primary" />
                    {cohort.weekLabel}
                  </span>
                ) : null}
                {cohort.nextDueLabel ? (
                  <span className="text-secondary-600">
                    {cohort.nextTaskTitle ? `${cohort.nextTaskTitle} — ` : ""}
                    {cohort.nextDueLabel}
                  </span>
                ) : null}
              </p>
            </div>
          </div>
          {cohort.rank ? (
            <span className="inline-flex items-center gap-1.5 self-start text-sm font-medium text-primary-800 bg-primary-100 px-3 py-1.5 rounded-full shrink-0">
              <Trophy className="h-4 w-4 shrink-0" />
              {cohort.rank}
            </span>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
