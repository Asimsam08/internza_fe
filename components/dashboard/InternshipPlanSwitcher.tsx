"use client"

import Link from "next/link"
import { useQueryClient } from "@tanstack/react-query"
import { GraduationCap, Rocket, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useActivePlanStore } from "@/stores/activePlanStore"
import type { StudentDashboard } from "@/lib/hooks/use-student"
import { getDashboardCohort } from "@/lib/cohort-labels"
import { CollegeLogoMark } from "@/components/college/CollegeLogoMark"

interface InternshipPlanSwitcherProps {
  dashboard: StudentDashboard | null | undefined
  className?: string
}

export function InternshipPlanSwitcher({
  dashboard,
  className,
}: InternshipPlanSwitcherProps) {
  const queryClient = useQueryClient()
  const activePlanId = useActivePlanStore((s) => s.activePlanId)
  const setActivePlanId = useActivePlanStore((s) => s.setActivePlanId)

  if (!dashboard?.planId) return null

  const plans = dashboard.availablePlans ?? []
  const cohortPlan = plans.find((p) => p.type === "cohort")
  const selfPlan = plans.find((p) => p.type === "self")
  const currentId = activePlanId ?? dashboard.activePlanId ?? dashboard.planId
  const viewingCohort = cohortPlan ? currentId === cohortPlan.id : false
  const cohortBranding = getDashboardCohort(dashboard)
  const cohortLogo =
    cohortPlan?.collegeLogoUrl ?? cohortBranding?.collegeLogoUrl ?? null

  const switchTo = (planId: string) => {
    if (planId === currentId) return
    setActivePlanId(planId)
    void queryClient.invalidateQueries({ queryKey: ["student", "dashboard"] })
  }

  if (plans.length >= 2 && cohortPlan && selfPlan) {
    return (
      <div
        className={cn(
          "flex flex-wrap items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3",
          className,
        )}
        role="group"
        aria-label="Switch internship plan"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {viewingCohort && cohortLogo ? (
            <CollegeLogoMark
              logoUrl={cohortLogo}
              collegeName={cohortBranding?.collegeName ?? cohortPlan?.label}
              size="sm"
            />
          ) : (
            <GraduationCap
              className={cn(
                "h-4 w-4 shrink-0",
                viewingCohort ? "text-primary" : "text-secondary-400",
              )}
            />
          )}
          <Label
            htmlFor="plan-switch"
            className={cn(
              "text-sm font-semibold cursor-pointer",
              viewingCohort ? "text-primary" : "text-secondary-600",
            )}
          >
            {cohortPlan.label}
          </Label>
        </div>

        <Switch
          id="plan-switch"
          checked={!viewingCohort}
          onCheckedChange={(checked) => {
            switchTo(checked ? selfPlan.id : cohortPlan.id)
          }}
          aria-label={
            viewingCohort
              ? "Switch to self-paced internship"
              : "Switch to college cohort internship"
          }
        />

        <div className="flex items-center gap-2 min-w-0">
          <Label
            htmlFor="plan-switch"
            className={cn(
              "text-sm font-semibold cursor-pointer",
              !viewingCohort ? "text-primary" : "text-secondary-600",
            )}
          >
            Self-paced
          </Label>
          <Rocket
            className={cn(
              "h-4 w-4 shrink-0",
              !viewingCohort ? "text-primary" : "text-secondary-400",
            )}
          />
        </div>

        <p className="w-full text-xs text-secondary-500 sm:w-auto sm:ml-2">
          {viewingCohort
            ? cohortPlan.subtitle ?? "College-assigned cohort"
            : selfPlan.subtitle ?? "Your own internship plan"}
        </p>
      </div>
    )
  }

  if (cohortPlan && dashboard.canEnrollSelfPlan) {
    return (
      <div
        className={cn(
          "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-secondary-200 bg-white px-4 py-3 shadow-sm",
          className,
        )}
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <CollegeLogoMark
            logoUrl={cohortPlan.collegeLogoUrl ?? cohortBranding?.collegeLogoUrl}
            collegeName={cohortBranding?.collegeName}
            size="md"
          />
          <div className="min-w-0">
          <p className="text-sm font-semibold text-secondary-900">
            Viewing: {cohortPlan.label}
          </p>
          {cohortBranding?.collegeName ? (
            <p className="text-xs font-medium text-secondary-600 mt-0.5 truncate">
              {cohortBranding.collegeName}
            </p>
          ) : null}
          <p className="text-xs text-secondary-500 mt-0.5">
            You can also start a self-paced internship and switch between both anytime.
          </p>
          </div>
        </div>
        <Button asChild size="sm" className="shrink-0">
          <Link href="/internship">
            Start self-paced plan
            <ArrowRight className="ml-2 h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    )
  }

  if (selfPlan && !cohortPlan) {
    return (
      <div
        className={cn(
          "rounded-xl border border-secondary-200 bg-white px-4 py-2.5 text-sm text-secondary-600",
          className,
        )}
      >
        <span className="font-semibold text-secondary-900 inline-flex items-center gap-2">
          <Rocket className="h-4 w-4 text-primary" />
          Self-paced internship
        </span>
        {selfPlan.subtitle ? (
          <span className="text-secondary-500"> · {selfPlan.subtitle}</span>
        ) : null}
      </div>
    )
  }

  return null
}
