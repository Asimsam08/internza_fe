/** Cohort context returned on GET /students/dashboard when plan is college-assigned */
export interface StudentCohortContext {
  cohortId: string
  name: string
  collegeName?: string
  collegeLogoUrl?: string | null
  weekLabel?: string
  nextDueLabel?: string
  nextTaskTitle?: string
  rank?: string | null
}

export type DashboardWithCohort = {
  cohort?: StudentCohortContext | null
  durationType?: string
  totalWeeks?: number
  completedWeeks?: number
}

export function getDashboardCohort(
  dashboard: DashboardWithCohort | null | undefined,
): StudentCohortContext | null {
  if (!dashboard?.cohort?.cohortId) return null
  return dashboard.cohort
}

export function isCohortStudent(dashboard: DashboardWithCohort | null | undefined): boolean {
  return !!getDashboardCohort(dashboard)
}

/** Primary title, e.g. "CSE #3" */
export function formatCohortName(cohort: StudentCohortContext): string {
  return cohort.name.trim()
}

/** Full plan label for headers, e.g. "CSE #3 Cohort" */
export function formatCohortPlanLabel(cohort: StudentCohortContext): string {
  return `${formatCohortName(cohort)} Cohort`
}

/** Sidebar / widget plan line — prefer live week progress when available */
export function formatCohortPlanContext(
  dashboard: DashboardWithCohort | null | undefined,
): string {
  const cohort = getDashboardCohort(dashboard)
  if (!cohort) {
    const weeks = dashboard?.totalWeeks
    if (weeks) return `${weeks}-Week Plan`
    return "Internship Plan"
  }
  if (cohort.weekLabel) return `${formatCohortPlanLabel(cohort)} · ${cohort.weekLabel}`
  return formatCohortPlanLabel(cohort)
}

export function getPlanBadgeLabel(dashboard: DashboardWithCohort | null | undefined): string {
  const cohort = getDashboardCohort(dashboard)
  if (cohort) return formatCohortPlanLabel(cohort)
  return `${(dashboard?.durationType ?? "INTERNSHIP").replace(/_/g, " ")} Internship`
}

export function getCurrentProjectSectionLabel(
  dashboard: DashboardWithCohort | null | undefined,
): string {
  return isCohortStudent(dashboard) ? "Cohort Project" : "Current Project"
}

export function getProgressWeeksLabel(dashboard: DashboardWithCohort | null | undefined): string {
  const cohort = getDashboardCohort(dashboard)
  if (cohort?.weekLabel) return cohort.weekLabel
  const completed = dashboard?.completedWeeks ?? 0
  const total = dashboard?.totalWeeks ?? 0
  return `${completed} of ${total} weeks completed`
}

export function getMilestonesSubtitle(dashboard: DashboardWithCohort | null | undefined): string {
  const cohort = getDashboardCohort(dashboard)
  if (cohort) {
    return `Track your progress in ${formatCohortPlanLabel(cohort)}.`
  }
  return "Track your internship progress across all tasks."
}
