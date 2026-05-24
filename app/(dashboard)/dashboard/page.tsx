"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useStudentDashboard, getStudentProgressPercent } from "@/lib/hooks/use-student"
import {
  getCurrentProjectSectionLabel,
  getDashboardCohort,
  getPlanBadgeLabel,
  getProgressWeeksLabel,
  isCohortStudent,
} from "@/lib/cohort-labels"
import { useCurrentUser } from "@/lib/hooks/use-auth"
import { cn } from "@/lib/utils"
import {
  Loader2,
  AlertTriangle,
  Clock,
  CheckCircle,
  Lock,
  PlayCircle,
  Calendar,
  Target,
  ArrowRight,
  Sparkles,
  Briefcase,
  Award,
  TrendingUp,
  BookOpen,
  MessageSquare,
  Eye,
  FileCheck,
  GraduationCap,
} from "lucide-react"

export default function DashboardPage() {
  const { data: user, isLoading: userLoading } = useCurrentUser()
  const router = useRouter()
  const { data: dashboard, isLoading } = useStudentDashboard()

  // Extract user name (first name only)
  const userName = user?.studentProfile?.firstName || user?.name?.split(" ")[0] || "Student"

  if (isLoading || userLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-secondary-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // First-time user - no active internship
  // Check for planStatus === 'ACTIVE' instead of hasActivePlan
  const hasActivePlan = dashboard?.planStatus === 'ACTIVE'

  if (!dashboard || !hasActivePlan) {
    // Show error state if dashboard data is incomplete (likely backend issue)
    if (dashboard && dashboard.nextAction === 'Unable to load dashboard data') {
      return (
        <div className="space-y-6">
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-12 w-12 text-amber-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-amber-900 mb-2">Unable to Load Dashboard</h3>
              <p className="text-amber-700 mb-4">
                We couldn&apos;t connect to the server to load your dashboard. Please check your internet connection and try again.
              </p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    const pathSteps = [
      {
        step: 1,
        title: "Pick your internship length",
        description: "Choose 4, 8, or 12 weeks (or custom if offered).",
        icon: Briefcase,
        state: "current" as const,
      },
      {
        step: 2,
        title: "Pick projects that fit",
        description: "Your projects must add up to that same number of weeks.",
        icon: Target,
        state: "upcoming" as const,
      },
      {
        step: 3,
        title: "Complete tasks and get reviewed",
        description: "Submit work, get feedback, build your portfolio.",
        icon: GraduationCap,
        state: "later" as const,
      },
    ]

    return (
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-primary to-emerald-700 p-8 text-white shadow-xl md:p-10">
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-white/10 blur-3xl"
            aria-hidden
          />
          <div className="relative max-w-xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Internza
            </div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Hi, {userName}! 👋</h1>
            <p className="mt-3 text-base text-white/90">
              You don&apos;t have an internship yet. Start here to set it up.
            </p>
            <Button
              size="lg"
              className="mt-8 h-12 rounded-full bg-white px-8 text-primary shadow-lg hover:bg-white/95"
              onClick={() => router.push("/internship")}
            >
              <PlayCircle className="mr-2 h-5 w-5" />
              Get started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        <section aria-labelledby="onboarding-path-heading" className="rounded-3xl border border-secondary-200/80 bg-white shadow-sm">
          <div className="border-b border-secondary-100 px-5 py-5 md:px-8">
            <h2 id="onboarding-path-heading" className="text-lg font-semibold text-secondary-900 md:text-xl">
              How it works
            </h2>
          </div>

          <ol className="divide-y divide-secondary-100">
            {pathSteps.map(({ step, title, description, icon: Icon, state }) => {
              const isCurrent = state === "current"
              return (
                <li key={step}>
                  <div
                    className={cn(
                      "flex gap-4 px-5 py-5 md:gap-5 md:px-8 md:py-6",
                      isCurrent && "bg-primary/[0.03]",
                    )}
                  >
                    <div className="flex shrink-0 flex-col items-center pt-0.5">
                      <span
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-xl border text-sm font-bold",
                          isCurrent
                            ? "border-primary/30 bg-primary text-white"
                            : "border-secondary-200 bg-secondary-50 text-secondary-500",
                        )}
                        aria-hidden
                      >
                        {step}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Icon className={cn("h-4 w-4 shrink-0", isCurrent ? "text-primary" : "text-secondary-400")} />
                        <h3 className="text-base font-semibold text-secondary-900">{title}</h3>
                        {isCurrent && (
                          <Badge variant="secondary" className="rounded-full text-xs font-medium">
                            Start here
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-secondary-600">{description}</p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>

        </section>
      </div>
    )
  }

  const { activeProject, currentTask, taskTimeline, startedAt } = dashboard
  const progressPercent = getStudentProgressPercent(dashboard)

  // Filter tasks to only include active project tasks for optimized display
  const activeProjectTasks = taskTimeline?.filter(task => task.projectId === activeProject.id) ?? []
  const activeProjectCompletedTasks = activeProjectTasks.filter(task => task.status === 'APPROVED').length

  // Calculate days remaining
  const daysRemaining = currentTask?.dueAt
    ? Math.ceil((new Date(currentTask.dueAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0

  // Use the actual start date from backend
  const startDate = startedAt ? new Date(startedAt) : new Date()

  const cohort = getDashboardCohort(dashboard)
  const projectSectionLabel = getCurrentProjectSectionLabel(dashboard)

  return (
    <div className="space-y-8">
      {/* Warning Banner */}
      {/* {warnings && warnings.length > 0 && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 ${
          warnings[0].severity === 'high' ? 'bg-red-50 border-red-200' :
          warnings[0].severity === 'medium' ? 'bg-amber-50 border-amber-200' :
          'bg-yellow-50 border-yellow-200'
        }`}>
          <AlertTriangle className={`h-5 w-5 flex-shrink-0 ${
            warnings[0].severity === 'high' ? 'text-red-600' :
            warnings[0].severity === 'medium' ? 'text-amber-600' :
            'text-yellow-600'
          }`} />
          <div className="flex-1">
            <p className={`font-medium ${
              warnings[0].severity === 'high' ? 'text-red-900' :
              warnings[0].severity === 'medium' ? 'text-amber-900' :
              'text-yellow-900'
            }`}>
              {warnings[0].message}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => router.push('/internship')}>
            View Details
          </Button>
        </div>
      )} */}

      {/* Profile Header Section */}
      <div className="bg-gradient-to-r from-primary via-primary to-accent rounded-2xl p-8 text-white">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
          <div className="flex items-center gap-6 flex-1">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold backdrop-blur-sm flex-shrink-0">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-3 flex-1">
              <div>
                <h1 className="text-3xl font-bold">Hello, {userName}! 👋</h1>
                <p className="text-white/80 text-lg mt-1">
                  {user?.studentProfile?.university || "Student"}
                  {user?.studentProfile?.gradYear
                    ? ` • Class of ${user.studentProfile.gradYear}`
                    : user?.studentProfile?.graduationYear
                      ? ` • Class of ${user.studentProfile.graduationYear}`
                      : ""}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                    <Sparkles className="h-3 w-3 mr-1" />
                    {getPlanBadgeLabel(dashboard)}
                  </Badge>
                  <Badge className="bg-emerald-500/20 text-emerald-100 border-emerald-500/30">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {dashboard.planStatus}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-white/90">
                  <span>Started {startDate.toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-64 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <p className="text-xs text-white/70 uppercase tracking-wider mb-2">Next Action</p>
            <p className="text-sm font-medium text-white leading-relaxed">{dashboard.nextAction}</p>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="border-2 border-primary/20 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Overall Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-secondary-700">Completion Rate</span>
              <span className="text-3xl font-bold text-primary">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} variant="brand" className="h-4" />
            <div className="flex items-center justify-between text-sm text-secondary-600">
              <span>
                {isCohortStudent(dashboard)
                  ? getProgressWeeksLabel(dashboard)
                  : `${dashboard.completedWeeks} of ${dashboard.totalWeeks} weeks completed`}
              </span>
              <span>{activeProjectCompletedTasks} of {activeProjectTasks.length} tasks done</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-secondary-200">
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <div className="text-3xl font-bold text-emerald-600">{dashboard.completedTaskCount}</div>
              <div className="text-sm text-emerald-700 font-medium">Completed</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="text-3xl font-bold text-amber-600">{dashboard.dueSoonTaskCount}</div>
              <div className="text-sm text-amber-700 font-medium">Due Soon</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-3xl font-bold text-red-600">{dashboard.overdueTaskCount}</div>
              <div className="text-sm text-red-700 font-medium">Overdue</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Switcher */}
      {dashboard.projects && dashboard.projects.length > 1 && (
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              {projectSectionLabel}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Active Project */}
              <div className="p-4 rounded-lg bg-white border-2 border-primary">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-primary">{dashboard.activeProject.title}</h3>
                  <Badge className="bg-emerald-100 text-emerald-800">Active</Badge>
                </div>
                <Progress 
                  value={dashboard.projectProgress.find(p => p.projectId === dashboard.activeProject.id)?.approvalRate || 0} 
                  className="h-2"
                />
                <p className="text-sm text-secondary-600 mt-2">
                  {dashboard.projectProgress.find(p => p.projectId === dashboard.activeProject.id)?.completedTasks || 0} of {dashboard.projectProgress.find(p => p.projectId === dashboard.activeProject.id)?.totalTasks || 0} tasks approved
                </p>
              </div>

              {/* Next Project */}
              {dashboard.nextProject && (
                <div className={`p-4 rounded-lg border-2 ${
                  dashboard.canUnlockNextProject 
                    ? 'bg-emerald-50 border-emerald-300' 
                    : 'bg-secondary-50 border-secondary-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{dashboard.nextProject.title}</h3>
                    {dashboard.canUnlockNextProject ? (
                      <Badge className="bg-emerald-100 text-emerald-800">Ready to Start</Badge>
                    ) : (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        Locked
                      </Badge>
                    )}
                  </div>
                  {dashboard.canUnlockNextProject ? (
                    <Button 
                      className="w-full" 
                      onClick={() => router.push('/dashboard')}
                    >
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Next Project Unlocked
                    </Button>
                  ) : (
                    <p className="text-sm text-secondary-600">
                      Complete all tasks in current project to unlock
                    </p>
                  )}
                </div>
              )}

              {/* Other Locked Projects */}
              {dashboard.projects
                .filter(p => p.order > (dashboard.nextProject?.order || dashboard.activeProject.order))
                .map(project => (
                  <div key={project.id} className="p-4 rounded-lg bg-secondary-50 border border-secondary-200 opacity-60">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-secondary-700">{project.title}</h3>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        Locked
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Required — surfaced submitted / rejected tasks */}
      {(() => {
        const attention = activeProjectTasks.filter(t => t.status === 'REJECTED' || t.status === 'CHANGES_REQUESTED' || t.status === 'SUBMITTED' || t.status === 'UNDER_REVIEW')
        if (attention.length === 0) return null
        return (
          <Card className="border-2 border-amber-300 bg-amber-50/60">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-amber-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-amber-900 mb-1">
                    {attention.length === 1 ? '1 task needs your attention' : `${attention.length} tasks need your attention`}
                  </h3>
                  <div className="space-y-2">
                    {attention.map(task => {
                      const isRejected = task.status === 'REJECTED' || task.status === 'CHANGES_REQUESTED'
                      return (
                        <div
                          key={task.id}
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                            isRejected ? 'bg-red-100/50 border-red-200 hover:bg-red-100' : 'bg-purple-100/50 border-purple-200 hover:bg-purple-100'
                          }`}
                          onClick={() => router.push(`/submissions?task=${task.id}`)}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              isRejected ? 'bg-red-200 text-red-700' : 'bg-purple-200 text-purple-700'
                            }`}>
                              {isRejected ? <AlertTriangle className="h-4 w-4" /> : <FileCheck className="h-4 w-4" />}
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
                            className={`gap-1 flex-shrink-0 ml-2 ${isRejected ? 'border-red-300 text-red-700 hover:bg-red-50' : ''}`}
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
        )
      })()}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Current Task & Project */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Project Card */}
          {dashboard.activeProject && (
            <Card className="border-2 border-secondary-200 hover:border-primary/30 transition-all">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Briefcase className="h-5 w-5 text-primary" />
                      {projectSectionLabel}
                    </CardTitle>
                    <CardDescription className="text-base">{dashboard.activeProject.title}</CardDescription>
                  </div>
                  <Badge className={dashboard.activeProject.status === 'IN_PROGRESS' ? "bg-blue-100 text-blue-800 border-blue-200" : "bg-secondary-100 text-secondary-800 border-secondary-200"}>
                    {dashboard.activeProject.status.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-secondary-600 leading-relaxed">{dashboard.activeProject.description}</p>
                <div className="flex flex-wrap gap-3">
                  {cohort ? (
                    <Badge className="bg-primary/10 text-primary border-primary/20">Cohort</Badge>
                  ) : null}
                  <Badge variant="outline" className="border-secondary-300">{dashboard.activeProject.category}</Badge>
                  <Badge variant="outline" className="border-secondary-300">{dashboard.activeProject.difficulty}</Badge>
                  <div className="flex items-center gap-2 text-sm text-secondary-600 bg-secondary-50 px-3 py-1 rounded-full">
                    <Clock className="h-4 w-4" />
                    <span>
                      {isCohortStudent(dashboard) && cohort?.weekLabel
                        ? cohort.weekLabel
                        : `${dashboard.activeProject.duration} weeks`}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Current Task Card */}
          {currentTask && (
            <Card className="border-2 border-primary shadow-md">
              <CardHeader className="bg-primary/5 border-b border-primary/10">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Target className="h-5 w-5 text-primary" />
                      Current Task
                    </CardTitle>
                    <CardDescription>Task {currentTask.order} of this project</CardDescription>
                  </div>
                  <Badge className={
                    currentTask.isOverdue ? "bg-red-100 text-red-800 border-red-200" :
                    currentTask.status === 'DRAFT' ? "bg-blue-100 text-blue-800 border-blue-200" :
                    "bg-emerald-100 text-emerald-800 border-emerald-200"
                  }>
                    {currentTask.isOverdue ? 'Overdue' : currentTask.status.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                <div>
                  <h3 className="font-semibold text-secondary-900 mb-2 text-lg">{currentTask.title}</h3>
                  <p className="text-sm text-secondary-600 leading-relaxed">{currentTask.description}</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2 text-sm p-3 bg-secondary-50 rounded-lg">
                    <Clock className="h-4 w-4 text-secondary-500" />
                    <span className="text-secondary-700 font-medium">{currentTask.durationDays} days</span>
                  </div>
                  <div className={`flex items-center gap-2 text-sm p-3 rounded-lg ${daysRemaining < 0 ? "bg-red-50" : "bg-secondary-50"}`}>
                    <Calendar className={`h-4 w-4 ${daysRemaining < 0 ? "text-red-500" : "text-secondary-500"}`} />
                    <span className={daysRemaining < 0 ? "text-red-700 font-medium" : "text-secondary-700 font-medium"}>
                      {daysRemaining < 0 ? `${Math.abs(daysRemaining)}d overdue` : `${daysRemaining}d remaining`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm p-3 bg-secondary-50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-secondary-500" />
                    <span className="text-secondary-700 font-medium">Order: {currentTask.order}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm p-3 bg-secondary-50 rounded-lg">
                    {currentTask.isLocked ? (
                      <Lock className="h-4 w-4 text-secondary-500" />
                    ) : (
                      <PlayCircle className="h-4 w-4 text-emerald-500" />
                    )}
                    <span className="text-secondary-700 font-medium">{currentTask.isLocked ? 'Locked' : 'Available'}</span>
                  </div>
                </div>
                <Button
                  className="w-full h-12 text-base"
                  disabled={currentTask.isLocked}
                  onClick={() => router.push(`/submissions?task=${currentTask.id}`)}
                >
                  <Eye className="mr-2 h-5 w-5" />
                  {currentTask.isLocked ? 'Task Locked' : 'View Task'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Task Timeline */}
          <Card className="border-2 border-secondary-200">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Task Timeline</CardTitle>
                  <CardDescription>Track your progress through all tasks</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => router.push('/milestones')}>
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeProjectTasks.slice(0, 5).map((task) => {
                  const isSubmitted = task.status === 'SUBMITTED' || task.status === 'UNDER_REVIEW'
                  const isApproved = task.status === 'APPROVED'
                  const isRejected = task.status === 'REJECTED' || task.status === 'CHANGES_REQUESTED'
                  
                  return (
                    <div
                      key={task.id}
                      onClick={() => !task.isLocked && router.push(`/submissions?task=${task.id}`)}
                      className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:shadow-md cursor-pointer ${
                        task.isOverdue ? 'border-red-200 bg-red-50' :
                        isApproved ? 'border-emerald-200 bg-emerald-50' :
                        isRejected ? 'border-red-200 bg-red-50' :
                        isSubmitted ? 'border-blue-200 bg-blue-50' :
                        task.isLocked ? 'border-gray-200 bg-gray-50' :
                        'border-primary bg-primary/5'
                      } ${task.isLocked ? 'cursor-not-allowed' : ''}`}
                    >
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isApproved ? 'bg-emerald-100 text-emerald-700' :
                          isRejected ? 'bg-red-100 text-red-700' :
                          isSubmitted ? 'bg-blue-100 text-blue-700' :
                          task.isLocked ? 'bg-gray-100 text-gray-500' :
                          'bg-primary/10 text-primary'
                        }`}>
                          {isApproved ? <CheckCircle className="h-5 w-5" /> :
                          isRejected ? <AlertTriangle className="h-5 w-5" /> :
                          isSubmitted ? <Clock className="h-5 w-5" /> :
                          task.isLocked ? <Lock className="h-5 w-5" /> :
                          <PlayCircle className="h-5 w-5" />}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-secondary-900 truncate">{task.title}</p>
                        <p className="text-sm text-secondary-600">
                          {task.isLocked ? (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {task.durationDays} days
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {task.durationDays} days
                              </span>
                              {task.dueAt && <span>Due: {new Date(task.dueAt).toLocaleDateString()}</span>}
                            </span>
                          )}
                        </p>
                        {isRejected && task.review?.feedback && (
                          <p className="text-xs text-red-600 mt-1 truncate">
                            Feedback: {task.review.feedback}
                          </p>
                        )}
                      </div>
                      <Badge variant="outline" className={`flex-shrink-0 font-medium ${
                        isApproved ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                        isRejected ? 'bg-red-100 text-red-800 border-red-200' :
                        isSubmitted ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        task.isLocked ? 'bg-gray-100 text-gray-600 border-gray-200' :
                        'bg-primary/10 text-primary border-primary/20'
                      }`}>
                        {isApproved ? 'Approved' :
                        isRejected ? 'Rejected' :
                        isSubmitted ? 'Under Review' :
                        task.isLocked ? 'Locked' :
                        'In Progress'}
                      </Badge>
                    </div>
                  )
                })}
                {activeProjectTasks.length > 5 && (
                  <Button variant="outline" className="w-full" onClick={() => router.push('/milestones')}>
                    View all {activeProjectTasks.length} tasks
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Quick Actions & Info */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="border-2 border-secondary-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start h-12" onClick={() => router.push('/internship')}>
                <Briefcase className="h-5 w-5 mr-3" />
                View Internship
              </Button>
              <Button variant="ghost" className="w-full justify-start h-12" onClick={() => router.push('/projects')}>
                <BookOpen className="h-5 w-5 mr-3" />
                Browse Projects
              </Button>
              <Button variant="ghost" className="w-full justify-start h-12" onClick={() => router.push('/certificates')}>
                <Award className="h-5 w-5 mr-3" />
                My Certificates
              </Button>
              <Button variant="ghost" className="w-full justify-start h-12" onClick={() => router.push('/support')}>
                <MessageSquare className="h-5 w-5 mr-3" />
                Get Help
              </Button>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-secondary-900 mb-2">Pro Tip</h4>
                  <p className="text-sm text-secondary-600 leading-relaxed">
                    Submit your tasks before the deadline to avoid overdue flags and maintain your progress momentum.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
