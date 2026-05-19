"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Trophy, Layers } from "lucide-react"
import { formatCohortName, type StudentCohortContext } from "@/lib/cohort-labels"

export type CohortBannerData = StudentCohortContext

export function CohortBanner({ cohort }: { cohort: CohortBannerData }) {
  return (
    <Card className="border-primary-200 bg-gradient-to-r from-primary-50 to-white">
      <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 m-0 flex-wrap">
            <Layers className="h-5 w-5 text-primary shrink-0" />
            <span className="font-semibold text-secondary-900 text-lg">{formatCohortName(cohort)}</span>
            <Badge variant="secondary" className="font-medium">
              Cohort
            </Badge>
          </p>
          {cohort.collegeName ? (
            <p className="text-xs text-secondary-500 mt-1 ml-7">{cohort.collegeName}</p>
          ) : null}
          <p className="mt-2 flex flex-wrap gap-3 text-sm text-secondary-600 m-0">
            {cohort.weekLabel ? (
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {cohort.weekLabel}
              </span>
            ) : null}
            {cohort.nextDueLabel ? (
              <span>
                {cohort.nextTaskTitle ? `${cohort.nextTaskTitle} — ` : ""}
                {cohort.nextDueLabel}
              </span>
            ) : null}
          </p>
        </div>
        {cohort.rank ? (
          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary-800 bg-primary-100 px-3 py-1 rounded-full shrink-0">
            <Trophy className="h-4 w-4" />
            {cohort.rank}
          </span>
        ) : null}
      </CardContent>
    </Card>
  )
}
