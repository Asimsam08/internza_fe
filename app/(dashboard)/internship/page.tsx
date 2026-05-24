"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  usePlanOptions,
  useEnrollInPlan,
  useStudentDashboard,
  useAvailableProjects,
  type ProjectTemplate,
} from "@/lib/hooks/use-student"
import {
  Loader2,
  Clock,
  TrendingUp,
  Award,
  Zap,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ChevronLeft,
  Rocket,
  Users,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Pencil,
} from "lucide-react"
import Image from "next/image"
import { EnrollmentStepIndicator, type EnrollmentStep } from "@/components/internship/EnrollmentStepIndicator"
import { cn } from "@/lib/utils"

const PLAN_ICONS = {
  FOUR_WEEKS: Rocket,
  EIGHT_WEEKS: TrendingUp,
  TWELVE_WEEKS: Award,
  CUSTOM: Zap,
}

function getProjectSelectionMicrocopy(
  requiredWeeks: number,
  selectedWeeks: number,
  isSelectionValid: boolean,
  projectsByDuration: Record<number, ProjectTemplate[]> | undefined,
): string {
  if (isSelectionValid) return "You've reached the required duration."
  if (selectedWeeks > requiredWeeks) {
    return `Over by ${selectedWeeks - requiredWeeks} weeks. Remove a project to continue.`
  }
  const remaining = requiredWeeks - selectedWeeks
  const all = projectsByDuration ? Object.values(projectsByDuration).flat() : []
  const hasFourWeekProject = all.some((p) => p.duration === 4)
  const hasEightWeekProject = all.some((p) => p.duration === 8)
  if (remaining === 4 && hasFourWeekProject) return "You need 1 more 4-week project to continue."
  if (remaining === 8 && hasEightWeekProject) return "You need 1 more 8-week project to continue."
  if (remaining === 8 && !hasEightWeekProject && hasFourWeekProject) {
    return "You need 2 more 4-week projects to continue."
  }
  return `${remaining} more weeks needed.`
}

export default function InternshipPage() {
  const { data: planOptions, isLoading: plansLoading } = usePlanOptions()
  const { data: dashboard, isLoading: dashboardLoading } = useStudentDashboard()
  const enrollMutation = useEnrollInPlan()

  const [enrollmentStep, setEnrollmentStep] = useState<EnrollmentStep>(1)
  const [selectedDuration, setSelectedDuration] = useState<string>('')
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([])

  const { data: availableProjects, isLoading: projectsLoading } = useAvailableProjects(selectedDuration)

  const isLoading = plansLoading || dashboardLoading

  const hasSelfPlan =
    dashboard?.availablePlans?.some((p) => p.type === "self") ??
    planOptions?.hasSelfPlan ??
    false
  const canEnrollSelf =
    planOptions?.canEnrollSelfPlan ?? dashboard?.canEnrollSelfPlan ?? true

  const router = useRouter()

  useEffect(() => {
    if (enrollmentStep >= 2 && !selectedDuration) {
      setEnrollmentStep(1)
    }
  }, [enrollmentStep, selectedDuration])

  useEffect(() => {
    if (enrollMutation.isSuccess) {
      router.replace("/dashboard")
    }
  }, [enrollMutation.isSuccess, router])

  // Only redirect when student already has a self-paced plan (cohort-only may enroll here)
  useEffect(() => {
    if (hasSelfPlan && !enrollMutation.isPending) {
      router.replace("/dashboard")
    }
  }, [hasSelfPlan, enrollMutation.isPending, router])

  // Calculate required duration based on selected plan
  const getRequiredWeeks = () => {
    const plan = planOptions?.plans.find(p => p.durationType === selectedDuration)
    return plan?.totalWeeks || 0
  }

  const requiredWeeks = getRequiredWeeks()

  // Calculate total weeks of selected projects
  const getSelectedWeeks = () => {
    if (!availableProjects) return 0
    const allProjects = Object.values(availableProjects.projectsByDuration || {}).flat()
    return selectedProjectIds.reduce((total, id) => {
      const project = allProjects.find(p => p.id === id)
      return total + (project?.duration || 0)
    }, 0)
  }

  const selectedWeeks = getSelectedWeeks()

  // Check if selection is valid
  const isSelectionValid = selectedWeeks === requiredWeeks && selectedWeeks > 0

  const selectionMicrocopy = getProjectSelectionMicrocopy(
    requiredWeeks,
    selectedWeeks,
    isSelectionValid,
    availableProjects?.projectsByDuration,
  )

  const resetEnrollment = useCallback(() => {
    setSelectedDuration('')
    setSelectedProjectIds([])
    setEnrollmentStep(1)
  }, [])

  const handleDurationCardSelect = (durationType: string) => {
    setSelectedDuration(durationType)
  }

  const handleContinueFromDuration = () => {
    if (!selectedDuration) return
    setEnrollmentStep(2)
  }

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectIds((prev) => {
      if (prev.includes(projectId)) {
        return prev.filter((id) => id !== projectId)
      }
      return [...prev, projectId]
    })
  }

  const handleBackToPlans = () => {
    resetEnrollment()
  }

  const handleContinueToReview = () => {
    if (!isSelectionValid) return
    setEnrollmentStep(3)
  }

  const handleBackFromReview = () => {
    setEnrollmentStep(2)
  }

  const handleStepperNavigate = (step: EnrollmentStep) => {
    if (step === enrollmentStep) return
    if (step < enrollmentStep) {
      if (enrollmentStep === 2 && step === 1) {
        resetEnrollment()
        return
      }
      if (enrollmentStep === 3 && step === 2) {
        setEnrollmentStep(2)
        return
      }
      if (enrollmentStep === 3 && step === 1) {
        resetEnrollment()
      }
    }
  }

  const handleEnroll = () => {
    enrollMutation.mutate({
      durationType: selectedDuration,
      selectedProjectIds,
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm text-secondary-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show loader during enrollment
  if (enrollMutation.isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm text-secondary-600">Enrolling you in the internship plan...</p>
        </div>
      </div>
    )
  }

  if (hasSelfPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm text-secondary-600">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  if (!canEnrollSelf) {
    return (
      <div className="max-w-lg mx-auto py-12">
        <Card>
          <CardContent className="p-6 text-center space-y-4">
            <p className="text-secondary-700">
              You already have a self-paced internship. Use the plan switcher on your dashboard to move between cohort and self-paced work.
            </p>
            <Button onClick={() => router.push("/dashboard")}>Back to dashboard</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show error state if no plans available (likely backend issue)
    if (!planOptions?.plans || planOptions.plans.length === 0) {
      return (
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-display font-bold text-primary">
              Start Your Internship
            </h1>
            <p className="text-secondary-600 max-w-2xl">
              Select your preferred internship duration. We offer flexible options to fit your schedule and learning goals.
            </p>
          </div>

          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-12 w-12 text-amber-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-amber-900 mb-2">Unable to Load Plans</h3>
              <p className="text-amber-700 mb-4">
                We couldn&apos;t connect to the server to load internship plans. Please check your internet connection and try again.
              </p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    const selectedPlanSummary = planOptions?.plans.find((p) => p.durationType === selectedDuration)

    // Step 2: Project selection
    if (enrollmentStep === 2) {
      return (
        <div className="space-y-8">
          <EnrollmentStepIndicator
            currentStep={2}
            currentStepSatisfied={isSelectionValid}
            onStepClick={handleStepperNavigate}
          />

          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button variant="ghost" onClick={handleBackToPlans} className="gap-2 self-start">
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="hidden h-6 w-px bg-secondary-200 sm:block" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Select Projects to Match Your Duration</h1>
                <p className="text-gray-500 mt-1">
                  {selectedPlanSummary?.title ?? selectedDuration.replace("_", " ").toLowerCase()} ·{" "}
                  <span className="font-medium text-gray-700">{requiredWeeks} weeks total</span>
                </p>
              </div>
            </div>

            {/* Duration Progress */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm md:min-w-[280px]">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex-1 min-w-0">
                  <div className="mb-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="text-sm font-medium text-gray-600">Internship weeks</span>
                    <span className="text-sm font-bold text-gray-900">
                      {selectedWeeks} / {requiredWeeks} selected
                    </span>
                  </div>
                  {!isSelectionValid && selectedWeeks < requiredWeeks && requiredWeeks > 0 && (
                    <p className="text-xs font-medium text-primary mb-2">
                      {requiredWeeks - selectedWeeks} week{requiredWeeks - selectedWeeks === 1 ? "" : "s"} remaining
                    </p>
                  )}
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        selectedWeeks === requiredWeeks
                          ? "bg-emerald-500"
                          : selectedWeeks > requiredWeeks
                            ? "bg-red-500"
                            : "bg-primary"
                      }`}
                      style={{
                        width: `${requiredWeeks ? Math.min((selectedWeeks / requiredWeeks) * 100, 100) : 0}%`,
                      }}
                    />
                  </div>
                </div>
                <div
                  className={`shrink-0 px-3 py-1.5 rounded-lg text-sm font-semibold ${
                    isSelectionValid
                      ? "bg-emerald-100 text-emerald-700"
                      : selectedWeeks > requiredWeeks
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {isSelectionValid ? "Valid" : selectedWeeks > requiredWeeks ? "Over" : "Incomplete"}
                </div>
              </div>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 flex-shrink-0">
                <BookOpen className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-900 mb-1">
                  Select projects totaling exactly {requiredWeeks} weeks
                </p>
                <p className="text-sm text-blue-700">
                  {requiredWeeks === 4 && 'Choose 1 project of 4 weeks'}
                  {requiredWeeks === 8 && 'Choose either 1 project of 8 weeks, or 2 projects of 4 weeks each'}
                  {requiredWeeks === 12 && 'Choose projects that add up to 12 weeks (e.g., 3×4 weeks, 1×8+1×4 weeks, or 1×12 weeks)'}
                </p>
              </div>
            </div>
          </div>

          {/* Selected Projects Order Preview */}
          {selectedProjectIds.length > 0 && (
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Selected Projects Order
                </CardTitle>
                <CardDescription>
                  Projects will be completed in this order. You cannot change the order after enrollment.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedProjectIds.map((projectId, index) => {
                    const allProjects = Object.values(availableProjects?.projectsByDuration || {}).flat()
                    const project = allProjects.find(p => p.id === projectId)
                    if (!project) return null
                    return (
                      <div key={projectId} className="flex items-center gap-3 p-3 rounded-lg bg-white border border-primary/20">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-secondary-900">{project.title}</p>
                          <p className="text-sm text-secondary-600">{project.duration} weeks • {project.difficulty}</p>
                        </div>
                        {index === 0 && <Badge className="bg-primary text-white">Starts First</Badge>}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {projectsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-sm text-secondary-600">Loading projects...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Projects grouped by duration */}
              {Object.entries(availableProjects?.projectsByDuration || {}).map(([duration, projects]) => (
                <div key={duration} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{duration}-Week Projects</h3>
                    <Badge variant="secondary" className="ml-auto">
                      {projects.length} available
                    </Badge>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => {
                      const isSelected = selectedProjectIds.includes(project.id)
                      const wouldExceed = selectedWeeks + project.duration > requiredWeeks && !isSelected
                      return (
                        <Card
                          key={project.id}
                          className={`group overflow-hidden border-2 cursor-pointer transition-all hover:shadow-xl ${
                            isSelected
                              ? 'border-primary ring-2 ring-primary/20'
                              : wouldExceed
                                ? 'border-red-200 opacity-60'
                                : 'border-gray-200 hover:border-primary/30'
                          }`}
                          onClick={() => !wouldExceed && handleSelectProject(project.id)}
                        >
                          <div className="relative aspect-video overflow-hidden bg-gray-100">
                            <Image
                              src={project.imageUrl || `https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop`}
                              alt={project.title}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                              priority={false}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/0 to-black/0" />

                            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                              <Badge className="bg-white/90 text-gray-800 border-0 text-xs font-bold">
                                {project.duration} weeks
                              </Badge>
                              <Badge
                                className={[
                                  "border-0 text-xs font-bold",
                                  project.difficulty === "Beginner"
                                    ? "bg-accent/90 text-white"
                                    : project.difficulty === "Intermediate"
                                      ? "bg-warning/90 text-white"
                                      : "bg-primary/90 text-white",
                                ].join(" ")}
                              >
                                {project.difficulty}
                              </Badge>
                            </div>

                            {isSelected && (
                              <div className="absolute top-3 right-3">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white shadow-lg">
                                  <CheckCircle className="h-5 w-5" />
                                </div>
                              </div>
                            )}

                            {wouldExceed && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <div className="text-white text-center px-4">
                                  <AlertTriangle className="h-6 w-6 mx-auto mb-1" />
                                  <p className="text-sm font-semibold">Exceeds limit</p>
                                </div>
                              </div>
                            )}
                          </div>

                          <CardContent className="p-5">
                            <div className="flex items-start justify-between gap-3">
                              <h3 className="font-semibold text-gray-900 leading-6 line-clamp-2">
                                {project.title}
                              </h3>
                              <Badge className="shrink-0 bg-accent/10 text-accent-700 border-0 text-xs font-semibold">
                                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                                Proof-based
                              </Badge>
                            </div>

                            <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                              {project.shortDescription}
                            </p>

                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {project.skills.slice(0, 4).map((skill) => (
                                <span
                                  key={skill}
                                  className="rounded-md bg-gray-50 px-2 py-1 text-xs font-semibold text-gray-700"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              ))}

              {/* Continue to review */}
              <div className="sticky bottom-0 z-10 -mx-1 border-t border-gray-200 bg-white/95 p-4 pb-6 backdrop-blur-md sm:mx-0">
                <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                        isSelectionValid
                          ? "bg-emerald-100"
                          : selectedWeeks > requiredWeeks
                            ? "bg-red-100"
                            : "bg-gray-100"
                      }`}
                    >
                      {isSelectionValid ? (
                        <CheckCircle className="h-6 w-6 text-emerald-600" />
                      ) : selectedWeeks > requiredWeeks ? (
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                      ) : (
                        <Clock className="h-6 w-6 text-gray-600" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900">
                        {selectedWeeks} of {requiredWeeks} weeks selected
                      </p>
                      <p
                        className={`text-sm ${
                          isSelectionValid
                            ? "text-emerald-600"
                            : selectedWeeks > requiredWeeks
                              ? "text-red-600"
                              : "text-gray-600"
                        }`}
                      >
                        {selectionMicrocopy}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="lg"
                    onClick={handleContinueToReview}
                    disabled={!isSelectionValid}
                    className="w-full shrink-0 gap-2 px-8 sm:w-auto"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )
    }

    // Step 3: Review and confirm
    if (enrollmentStep === 3) {
      const reviewProjects = Object.values(availableProjects?.projectsByDuration || {})
        .flat()
        .filter((p) => selectedProjectIds.includes(p.id))
        .sort((a, b) => selectedProjectIds.indexOf(a.id) - selectedProjectIds.indexOf(b.id))

      return (
        <div className="space-y-8">
          <EnrollmentStepIndicator currentStep={3} currentStepSatisfied onStepClick={handleStepperNavigate} />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Review &amp; Confirm</h1>
              <p className="mt-1 text-gray-500">
                Double-check your internship length and projects before enrolling.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" className="gap-1" onClick={resetEnrollment}>
                <Pencil className="h-3.5 w-3.5" />
                Edit duration
              </Button>
              <Button type="button" variant="outline" size="sm" className="gap-1" onClick={() => setEnrollmentStep(2)}>
                <Pencil className="h-3.5 w-3.5" />
                Edit projects
              </Button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-secondary-200">
              <CardHeader>
                <CardTitle className="text-lg">Internship duration</CardTitle>
                <CardDescription>Your selected plan length</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-lg font-semibold text-secondary-900">
                  {selectedPlanSummary?.title ?? selectedDuration.replace("_", " ")}
                </p>
                <p className="text-sm text-secondary-600">{selectedPlanSummary?.description}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="secondary" className="font-medium">
                    {requiredWeeks > 0 ? `${requiredWeeks} weeks` : "Custom"}
                  </Badge>
                  {selectedPlanSummary?.difficulty && (
                    <Badge variant="outline">{selectedPlanSummary.difficulty}</Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 bg-emerald-50/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  Duration match
                </CardTitle>
                <CardDescription>Projects must equal your internship length</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium text-emerald-900">
                  Selected projects total <span className="font-bold">{selectedWeeks}</span> weeks — matches your{" "}
                  <span className="font-bold">{requiredWeeks}</span>-week internship.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-secondary-200">
            <CardHeader>
              <CardTitle className="text-lg">Selected projects</CardTitle>
              <CardDescription>In the order you will complete them</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {reviewProjects.map((project, index) => (
                <div
                  key={project.id}
                  className="flex flex-col gap-2 rounded-xl border border-secondary-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-secondary-900">{project.title}</p>
                      <p className="text-sm text-secondary-600">
                        {project.duration} weeks · {project.difficulty}
                        {project.category ? ` · ${project.category}` : ""}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="w-fit shrink-0">
                    Proof-based
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3 border-t border-secondary-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Button type="button" variant="ghost" className="gap-2 self-start sm:self-auto" onClick={handleBackFromReview}>
              <ChevronLeft className="h-4 w-4" />
              Back to projects
            </Button>
            <Button
              size="lg"
              className="w-full gap-2 sm:w-auto"
              onClick={handleEnroll}
              disabled={!isSelectionValid || enrollMutation.isPending}
            >
              {enrollMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enrolling...
                </>
              ) : (
                <>
                  Confirm enrollment
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      )
    }

    // Step 1: Duration selection
    return (
      <div className="space-y-8">
        <EnrollmentStepIndicator currentStep={1} currentStepSatisfied={!!selectedDuration} />

        {/* Compact Header */}
        <div className="rounded-2xl border border-secondary-200 bg-white p-6 shadow-sm md:p-7">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Briefcase className="h-5 w-5" />
            </div>
            <Badge variant="secondary" className="rounded-full">
              Internship programs
            </Badge>
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-secondary-900 md:text-3xl">
            Choose your internship duration
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-secondary-600 md:text-base">
            Pick one duration. Next, you&apos;ll choose projects that match the same number of weeks.
          </p>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {planOptions?.plans.map((plan) => {
            const Icon = PLAN_ICONS[plan.durationType as keyof typeof PLAN_ICONS] || Rocket
            const accentColor = {
              FOUR_WEEKS: "bg-blue-500",
              EIGHT_WEEKS: "bg-purple-500",
              TWELVE_WEEKS: "bg-emerald-500",
              CUSTOM: "bg-amber-500",
            }[plan.durationType] || "bg-blue-500"
            const isChosen = selectedDuration === plan.durationType

            return (
              <button
                key={plan.durationType}
                type="button"
                onClick={() => handleDurationCardSelect(plan.durationType)}
                aria-pressed={isChosen}
                className={cn(
                  "group relative rounded-2xl border bg-white p-6 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-xl",
                  isChosen
                    ? "border-primary ring-2 ring-primary/25 shadow-md"
                    : "border-gray-200 hover:border-gray-300",
                )}
              >
                <div className="flex h-full flex-col">
                  <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${accentColor}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>

                  <div className="flex-1">
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">{plan.title}</h3>
                    <p className="mb-6 text-sm leading-relaxed text-gray-500">{plan.description}</p>
                  </div>

                  <div className="mb-6 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Duration</span>
                      <span className="font-semibold text-gray-900">
                        {plan.totalWeeks > 0 ? `${plan.totalWeeks} weeks` : "Custom"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Level</span>
                      <span className="font-semibold text-gray-900">{plan.difficulty}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <span className="flex items-center gap-1 text-sm font-medium text-primary transition-all group-hover:gap-2">
                      {isChosen ? "Selected" : "Tap to select"}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Benefits Section (hidden for now) */}
        {false && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 flex-shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary mb-2">Proof-Based Learning</h3>
                    <p className="text-sm text-secondary-600">
                      Build a verifiable portfolio with real projects and code reviews.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 bg-gradient-to-br from-accent/5 to-accent/10 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 flex-shrink-0">
                    <Users className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold text-accent mb-2">Expert Mentorship</h3>
                    <p className="text-sm text-secondary-600">
                      Get personalized feedback from industry professionals.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 flex-shrink-0">
                    <Award className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-emerald-600 mb-2">Verified Skills</h3>
                    <p className="text-sm text-secondary-600">
                      Earn certifications that validate your expertise to employers.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="sticky bottom-0 z-10 -mx-1 mt-2 border-t border-gray-200 bg-white/95 p-4 pb-6 backdrop-blur-md sm:mx-0">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-secondary-600">
              {selectedDuration
                ? "When you are ready, continue to choose projects that match this length."
                : "Select exactly one internship duration to continue."}
            </p>
            <Button
              size="lg"
              className="w-full shrink-0 gap-2 px-8 sm:w-auto"
              onClick={handleContinueFromDuration}
              disabled={!selectedDuration}
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    )
}
