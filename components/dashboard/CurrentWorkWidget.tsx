"use client"

import * as React from "react"
import { Briefcase, Flag, CheckCircle2, ArrowRight, Sparkles, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getStudentProgressPercent, type StudentDashboard } from "@/lib/hooks/use-student"
import {
  formatCohortPlanContext,
  getCurrentProjectSectionLabel,
  getDashboardCohort,
} from "@/lib/cohort-labels"

interface CurrentWorkWidgetProps {
  dashboard: StudentDashboard | null
  isLoading?: boolean
  onGoToMilestones: () => void
  className?: string
}

export function CurrentWorkWidget({
  dashboard,
  isLoading = false,
  onGoToMilestones,
  className,
}: CurrentWorkWidgetProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <Card className={cn("border-secondary-200 bg-gradient-to-br from-primary/5 to-accent/5", className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className={cn("border-secondary-200 bg-gradient-to-br from-primary/5 to-accent/5", className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!dashboard || dashboard.planStatus !== 'ACTIVE') {
    return (
      <Card className={cn("border-secondary-200 bg-gradient-to-br from-primary/5 to-accent/5", className)}>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Briefcase className="h-4 w-4" />
              <span>Start Your Internship</span>
            </div>
            <p className="text-xs text-secondary-600">
              Select a duration and build your personalized internship plan.
            </p>
            <Button
              size="sm"
              className="w-full"
              onClick={() => window.location.href = "/internship"}
            >
              Get Started
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { activeProject, taskTimeline } = dashboard
  const cohort = getDashboardCohort(dashboard)
  const progressPercent = getStudentProgressPercent(dashboard)
  const isComplete = progressPercent === 100
  const projectSectionLabel = getCurrentProjectSectionLabel(dashboard)
  
  // Filter tasks to only include active project tasks for optimized display
  const activeProjectTasks = taskTimeline?.filter(task => task.projectId === activeProject.id) ?? []
  const totalTasks = activeProjectTasks.length
  const activeProjectCompletedTasks = activeProjectTasks.filter(task => task.status === 'APPROVED').length

  return (
    <Card className={cn("border-secondary-200 bg-gradient-to-br from-primary/5 to-accent/5", className)}>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" />
              <span>Current Work</span>
            </div>
            {isComplete && (
              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="h-3 w-3" />
                Complete
              </div>
            )}
          </div>

          {/* Plan Info */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-secondary-500 uppercase tracking-wider">
              {formatCohortPlanContext(dashboard)}
            </div>
            <div className="text-sm font-semibold text-secondary-900">
              {activeProject?.title || "No active project"}
            </div>
            {cohort?.weekLabel ? (
              <p className="text-[10px] text-secondary-500">{cohort.weekLabel}</p>
            ) : null}
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-secondary-600">Overall Progress</span>
              <span className="font-semibold text-primary">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} variant="brand" className="h-2" />
            <div className="text-[10px] text-secondary-500">
              {activeProjectCompletedTasks} of {totalTasks} tasks completed
            </div>
          </div>

          {/* Current Project */}
          {activeProject && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-medium text-secondary-500 uppercase tracking-wider">
                <Flag className="h-3 w-3" />
                {projectSectionLabel}
              </div>
              <div className="rounded-lg border border-primary/20 bg-white p-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-secondary-900 line-clamp-1">
                      {activeProject.title}
                    </div>
                    <div className="text-[10px] text-secondary-500 mt-0.5">
                      {cohort
                        ? `${activeProject.category} · Cohort`
                        : `${activeProject.duration} weeks · ${activeProject.category}`}
                    </div>
                  </div>
                  <div className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold",
                    activeProject.status === 'AVAILABLE' || activeProject.status === 'IN_PROGRESS' ? "bg-primary text-white" :
                    activeProject.isCompleted ? "bg-emerald-100 text-emerald-700" :
                    "bg-secondary-100 text-secondary-500"
                  )}>
                    {activeProject.status === 'AVAILABLE' || activeProject.status === 'IN_PROGRESS' ? "→" :
                     activeProject.isCompleted ? "✓" :
                     "?"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CTA */}
          <Button
            size="sm"
            className="w-full"
            onClick={onGoToMilestones}
          >
            {isComplete ? "View Certificate" : "Continue Work"}
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
