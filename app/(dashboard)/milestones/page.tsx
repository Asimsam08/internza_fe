"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import {
  CheckCircle,
  Clock,
  Lock,
  PlayCircle,
  Upload,
  FileCheck,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Briefcase,
  Loader2,
  Calendar
} from "lucide-react"
import { useStudentDashboard, getStudentProgressPercent, type TaskTimeline } from "@/lib/hooks/use-student"
import { CohortBanner } from "@/components/college/CohortBanner"
import {
  getCurrentProjectSectionLabel,
  getDashboardCohort,
  getMilestonesSubtitle,
  getPlanBadgeLabel,
} from "@/lib/cohort-labels"
import { useAuthStore } from "@/stores/authStore"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

// Task status type
type TaskStatus = 'locked' | 'available' | 'in_progress' | 'submitted' | 'changes_requested' | 'rejected' | 'approved' | 'done'

// Task status configuration with clear visual states
type TaskStatusConfig = {
  label: string
  icon: React.ReactNode
  bgColor: string
  hoverBgColor: string
  textColor: string
  borderColor: string
  dotColor: string
  description: string
}

const statusConfig: Record<TaskStatus, TaskStatusConfig> = {
  locked: {
    label: "Locked",
    icon: <Lock className="h-4 w-4" />,
    bgColor: "bg-slate-100",
    hoverBgColor: "group-hover:bg-slate-200/60",
    textColor: "text-slate-500",
    borderColor: "border-slate-200",
    dotColor: "bg-slate-400",
    description: "Complete previous task to unlock"
  },
  available: {
    label: "Ready to Start",
    icon: <PlayCircle className="h-4 w-4" />,
    bgColor: "bg-blue-50",
    hoverBgColor: "group-hover:bg-blue-100/70",
    textColor: "text-blue-600",
    borderColor: "border-blue-200",
    dotColor: "bg-blue-600",
    description: "Start working on this task"
  },
  in_progress: {
    label: "In Progress",
    icon: <Clock className="h-4 w-4" />,
    bgColor: "bg-amber-50",
    hoverBgColor: "group-hover:bg-amber-100/70",
    textColor: "text-amber-600",
    borderColor: "border-amber-200",
    dotColor: "bg-amber-600",
    description: "Continue working on this task"
  },
  submitted: {
    label: "Submitted",
    icon: <FileCheck className="h-4 w-4" />,
    bgColor: "bg-purple-50",
    hoverBgColor: "group-hover:bg-purple-100/70",
    textColor: "text-purple-600",
    borderColor: "border-purple-200",
    dotColor: "bg-purple-600",
    description: "Waiting for reviewer approval"
  },
  changes_requested: {
    label: "Changes Requested",
    icon: <AlertCircle className="h-4 w-4" />,
    bgColor: "bg-orange-50",
    hoverBgColor: "group-hover:bg-orange-100/70",
    textColor: "text-orange-600",
    borderColor: "border-orange-200",
    dotColor: "bg-orange-600",
    description: "Review feedback and resubmit"
  },
  rejected: {
    label: "Rejected",
    icon: <AlertCircle className="h-4 w-4" />,
    bgColor: "bg-red-50",
    hoverBgColor: "group-hover:bg-red-100/70",
    textColor: "text-red-600",
    borderColor: "border-red-200",
    dotColor: "bg-red-600",
    description: "Review feedback and resubmit"
  },
  approved: {
    label: "Approved",
    icon: <CheckCircle className="h-4 w-4" />,
    bgColor: "bg-emerald-50",
    hoverBgColor: "group-hover:bg-emerald-100/70",
    textColor: "text-emerald-600",
    borderColor: "border-emerald-200",
    dotColor: "bg-emerald-600",
    description: "Task completed successfully"
  },
  done: {
    label: "Done",
    icon: <CheckCircle className="h-4 w-4" />,
    bgColor: "bg-emerald-50",
    hoverBgColor: "group-hover:bg-emerald-100/70",
    textColor: "text-emerald-600",
    borderColor: "border-emerald-200",
    dotColor: "bg-emerald-600",
    description: "Task completed"
  }
}

// Helper to determine task status based on dashboard data
function getTaskStatusFromTimeline(task: TaskTimeline): 'locked' | 'available' | 'in_progress' | 'submitted' | 'rejected' | 'approved' {
  if (task.status === 'APPROVED') return 'approved'
  if (task.status === 'REJECTED') return 'rejected'
  if (task.status === 'SUBMITTED' || task.status === 'UNDER_REVIEW') return 'submitted'
  if (task.status === 'CHANGES_REQUESTED') return 'in_progress'
  if (task.isLocked) return 'locked'
  if (task.status === 'DRAFT') return 'available'
  return 'locked'
}

export default function TaskRoadmapPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { data: dashboard, isLoading } = useStudentDashboard()
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const FILTER_STORAGE_KEY = "internza.milestones.taskStatusFilter.v1"
  type TimelineStatus = ReturnType<typeof getTaskStatusFromTimeline>
  const allFilterStatuses: TimelineStatus[] = ['available', 'in_progress', 'submitted', 'rejected', 'approved', 'locked']
  const [statusFilter, setStatusFilter] = useState<Set<TimelineStatus>>(() => new Set(allFilterStatuses))

  const userName = user?.studentProfile
    ? `${user.studentProfile.firstName} ${user.studentProfile.lastName}`.trim()
    : user?.name || "Student"

  const hasActivePlan = dashboard?.planStatus === "ACTIVE"
  const taskTimeline = useMemo(() => dashboard?.taskTimeline ?? [], [dashboard?.taskTimeline])
  const cohort = dashboard ? getDashboardCohort(dashboard) : null
  const progressPercent = getStudentProgressPercent(dashboard)

  const sortedTimeline = useMemo(() => {
    const statusPriority: Record<string, number> = {
      rejected: 0,
      submitted: 1,
      in_progress: 2,
      available: 3,
      locked: 4,
      approved: 5,
      done: 5,
    }
    return [...taskTimeline].sort((a, b) => {
      const sa = getTaskStatusFromTimeline(a)
      const sb = getTaskStatusFromTimeline(b)
      return (statusPriority[sa] ?? 99) - (statusPriority[sb] ?? 99)
    })
  }, [taskTimeline])

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(FILTER_STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw)
      if (!Array.isArray(parsed)) return
      const next = new Set<TimelineStatus>()
      for (const v of parsed) {
        if (allFilterStatuses.includes(v as TimelineStatus)) next.add(v as TimelineStatus)
      }
      if (next.size > 0) setStatusFilter(next)
    } catch {
      // ignore (corrupt storage)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(Array.from(statusFilter)))
    } catch {
      // ignore (storage unavailable)
    }
  }, [statusFilter])

  const filteredTimeline = useMemo(() => {
    return sortedTimeline.filter((t) => statusFilter.has(getTaskStatusFromTimeline(t)))
  }, [sortedTimeline, statusFilter])

  const attentionTasks = useMemo(() => {
    return sortedTimeline.filter((t) => {
      const s = getTaskStatusFromTimeline(t)
      return s === "rejected" || s === "submitted"
    })
  }, [sortedTimeline])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm text-secondary-600">Loading milestones...</p>
        </div>
      </div>
    )
  }

  if (!dashboard || !hasActivePlan) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-primary via-primary to-accent rounded-2xl p-8 text-white">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-6 w-6" />
            <span className="text-sm font-medium opacity-90">Welcome to Internza</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Hello, {userName}! 👋
          </h1>
          <p className="text-lg opacity-90 mb-6">
            You don&apos;t have any active internship yet. Start your journey by choosing an internship plan.
          </p>
          <Button
            size="lg"
            className="bg-white text-primary hover:bg-white/90"
            onClick={() => router.push('/internship')}
          >
            <PlayCircle className="mr-2 h-5 w-5" />
            Choose Internship Plan
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    )
  }

  const { activeProject, projects, projectProgress } = dashboard
  const projectSectionLabel = getCurrentProjectSectionLabel(dashboard)

  return (
    <div className="space-y-6">
      {cohort?.cohortId ? <CohortBanner cohort={cohort} /> : null}

      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">Milestones</h1>
          <p className="mt-1 text-sm text-secondary-500">
            {getMilestonesSubtitle(dashboard)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-primary/10 text-primary border-primary/20 transition-colors hover:bg-primary/15">
            {getPlanBadgeLabel(dashboard)}
          </Badge>
          {cohort?.weekLabel ? (
            <Badge variant="outline" className="border-primary/30 text-secondary-700">
              {cohort.weekLabel}
            </Badge>
          ) : null}
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 transition-colors hover:bg-emerald-200/60">
            {progressPercent}% Completed
          </Badge>
        </div>
      </div>

      {/* Current Project Card */}
      {activeProject && (
        <Card className="border-2 border-secondary-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-primary">{projectSectionLabel}</h3>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h4 className="text-lg font-semibold text-secondary-900">{activeProject.title}</h4>
                <p className="text-sm text-secondary-600">{activeProject.description}</p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {cohort ? (
                  <Badge className="bg-primary/10 text-primary border-primary/20">Cohort</Badge>
                ) : null}
                <Badge variant="outline">{activeProject.category}</Badge>
                <Badge variant="outline">{activeProject.difficulty}</Badge>
                {cohort?.weekLabel ? (
                  <Badge variant="outline" className="border-secondary-300">
                    {cohort.weekLabel}
                  </Badge>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Overview (temporarily hidden) */}
      {/*
      <Card className="border-2 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-primary">Overall Progress</h3>
            <span className="text-2xl font-bold text-primary">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} variant="brand" className="h-3 mb-2" />
          <div className="flex items-center justify-between text-sm text-secondary-600">
            <span>{completedTasks} of {totalTasks} tasks completed</span>
          </div>
        </CardContent>
      </Card>
      */}

      {/* Action Required Banner */}
      {attentionTasks.length > 0 && (
        <Card className="border-2 border-amber-300 bg-amber-50/60">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-amber-700" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-amber-900 mb-1">
                  {attentionTasks.length === 1 ? '1 task needs your attention' : `${attentionTasks.length} tasks need your attention`}
                </h3>
                <div className="space-y-2">
                  {attentionTasks.map(task => {
                    const s = getTaskStatusFromTimeline(task)
                    const isRejected = s === 'rejected'
                    return (
                      <div
                        key={task.id}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors",
                          isRejected ? "bg-red-100/50 border-red-200 hover:bg-red-100" : "bg-purple-100/50 border-purple-200 hover:bg-purple-100"
                        )}
                        onClick={() => setSelectedTaskId(task.id)}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                            isRejected ? "bg-red-200 text-red-700" : "bg-purple-200 text-purple-700"
                          )}>
                            {isRejected ? <AlertCircle className="h-4 w-4" /> : <FileCheck className="h-4 w-4" />}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-sm text-secondary-900 truncate">{task.title}</p>
                            <p className="text-xs text-secondary-600">
                              {isRejected ? 'Rejected — review feedback and resubmit' : 'Submitted — waiting for reviewer approval'}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className={cn(
                            "gap-1 flex-shrink-0 ml-2",
                            isRejected && "border-red-300 text-red-700 hover:bg-red-50"
                          )}
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/submissions?task=${task.id}`)
                          }}
                        >
                          {isRejected ? 'Resubmit' : 'View'}
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Project Grouped Task Timeline */}
      {projects && projects.length > 0 && (
        <div className="space-y-6">
          {projects.map((project) => {
            const isActive = project.id === activeProject.id
            const isLocked = project.order > activeProject.order
            const projectProgressData = projectProgress.find(p => p.projectId === project.id)
            
            return (
              <Card key={project.id} className={isLocked ? 'opacity-60' : ''}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {isActive ? <PlayCircle className="h-5 w-5 text-primary" /> : 
                       isLocked ? <Lock className="h-5 w-5 text-secondary-400" /> :
                       <CheckCircle className="h-5 w-5 text-emerald-600" />
                      }
                      {project.title}
                    </CardTitle>
                    <Badge className={isActive ? 'bg-primary text-white' : 
                                   isLocked ? 'bg-secondary-200' :
                                   'bg-emerald-100 text-emerald-800'}>
                      {isActive ? 'Active' : isLocked ? 'Locked' : 'Completed'}
                    </Badge>
                  </div>
                  <CardDescription>
                    Project {project.order} of {projects.length} • {project.duration} weeks
                  </CardDescription>
                  {projectProgressData && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-secondary-600">Progress</span>
                        <span className="font-medium">{projectProgressData.approvalRate}%</span>
                      </div>
                      <Progress value={projectProgressData.approvalRate} className="h-2" />
                      <p className="text-xs text-secondary-500 mt-1">
                        {projectProgressData.completedTasks} of {projectProgressData.totalTasks} tasks approved
                      </p>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  {isLocked ? (
                    <div className="text-center py-8 text-secondary-500">
                      <Lock className="h-12 w-12 mx-auto mb-4 text-secondary-300" />
                      <p>This project unlocks after completing Project {project.order - 1}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredTimeline
                        .filter(task => task.projectId === project.id)
                        .map((task) => {
                          const status = getTaskStatusFromTimeline(task)
                          const config = statusConfig[status]
                          
                          return (
                            <div
                              key={task.id}
                              className={cn(
                                "group flex items-start gap-4 p-4 rounded-xl border-2 transition-all hover:shadow-md cursor-pointer",
                                config.borderColor,
                                selectedTaskId === task.id && "ring-2 ring-primary ring-offset-2"
                              )}
                              onClick={() => setSelectedTaskId(task.id)}
                            >
                              <div className={cn(
                                "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0",
                                config.bgColor
                              )}>
                                {config.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold text-secondary-900">{task.title}</h4>
                                  <Badge
                                    className={cn(
                                      "text-xs border-0 transition-colors",
                                      config.bgColor,
                                      config.hoverBgColor,
                                      config.textColor
                                    )}
                                  >
                                    {config.label}
                                  </Badge>
                                </div>
                                <p className="text-sm text-secondary-600 line-clamp-2">{task.description}</p>
                                {status === 'rejected' && task.review?.feedback && (
                                  <p className="text-xs text-red-600 mt-1 line-clamp-1">
                                    Feedback: {task.review.feedback}
                                  </p>
                                )}
                                <div className="flex items-center gap-4 mt-2 text-xs text-secondary-500">
                                  {task.isLocked ? (
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {task.durationDays} days
                                    </span>
                                  ) : (
                                    <>
                                      <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {task.durationDays} days
                                      </span>
                                      {task.dueAt && (
                                        <span className="flex items-center gap-1">
                                          <Calendar className="h-3 w-3" />
                                          Due: {new Date(task.dueAt).toLocaleDateString()}
                                        </span>
                                      )}
                                      {task.isOverdue && (
                                        <span className="flex items-center gap-1 text-red-600 font-medium">
                                          <AlertCircle className="h-3 w-3" />
                                          Overdue
                                        </span>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                              {status === "available" && (
                                <Button
                                  size="sm"
                                  className="gap-2"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    router.push(`/submissions?task=${task.id}`)
                                  }}
                                >
                                  <PlayCircle className="h-4 w-4" />
                                  Start
                                </Button>
                              )}
                              {status === "in_progress" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-2"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    router.push(`/submissions?task=${task.id}`)
                                  }}
                                >
                                  <Upload className="h-4 w-4" />
                                  Continue
                                </Button>
                              )}
                              {status === "rejected" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-2 border-red-200 text-red-600 hover:bg-red-50"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    router.push(`/submissions?task=${task.id}`)
                                  }}
                                >
                                  <AlertCircle className="h-4 w-4" />
                                  View Feedback
                                </Button>
                              )}
                            </div>
                          )
                        })}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
