"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
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
  ChevronRight,
  ExternalLink,
  Sparkles,
  Briefcase
} from "lucide-react"
import { mockProjectTemplates, mockStudentProgress, mockProofSubmissions, mockInternshipPlans, mockDurationProgress } from "@/lib/mockData"
import type { TaskStatus, InternshipPlan, ProjectBlock } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuthStore } from "@/stores/authStore"
import { useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

// Task status configuration with clear visual states
type TaskStatusConfig = {
  label: string
  icon: React.ReactNode
  bgColor: string
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
    textColor: "text-slate-500",
    borderColor: "border-slate-200",
    dotColor: "bg-slate-400",
    description: "Complete previous task to unlock"
  },
  available: {
    label: "Ready to Start",
    icon: <PlayCircle className="h-4 w-4" />,
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
    borderColor: "border-blue-200",
    dotColor: "bg-blue-600",
    description: "Start working on this task"
  },
  in_progress: {
    label: "In Progress",
    icon: <Clock className="h-4 w-4" />,
    bgColor: "bg-amber-50",
    textColor: "text-amber-600",
    borderColor: "border-amber-200",
    dotColor: "bg-amber-600",
    description: "Continue working on this task"
  },
  submitted: {
    label: "Submitted",
    icon: <FileCheck className="h-4 w-4" />,
    bgColor: "bg-purple-50",
    textColor: "text-purple-600",
    borderColor: "border-purple-200",
    dotColor: "bg-purple-600",
    description: "Waiting for reviewer approval"
  },
  changes_requested: {
    label: "Changes Requested",
    icon: <AlertCircle className="h-4 w-4" />,
    bgColor: "bg-orange-50",
    textColor: "text-orange-600",
    borderColor: "border-orange-200",
    dotColor: "bg-orange-600",
    description: "Review feedback and resubmit"
  },
  approved: {
    label: "Approved",
    icon: <CheckCircle className="h-4 w-4" />,
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-600",
    borderColor: "border-emerald-200",
    dotColor: "bg-emerald-600",
    description: "Task completed successfully"
  },
  done: {
    label: "Done",
    icon: <CheckCircle className="h-4 w-4" />,
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-600",
    borderColor: "border-emerald-200",
    dotColor: "bg-emerald-600",
    description: "Task completed"
  }
}

// Helper to determine task status based on progress and submissions
function getTaskStatus(
  taskId: string, 
  tasksCompleted: string[], 
  currentTaskId: string | undefined,
  submissions: typeof mockProofSubmissions,
  allTaskIds: string[]
): TaskStatus {
  if (tasksCompleted.includes(taskId)) return "approved"
  
  const submission = submissions.find(s => s.taskId === taskId)
  if (submission) {
    if (submission.status === "approved") return "approved"
    if (submission.status === "changes_requested") return "changes_requested"
    return "submitted"
  }
  
  if (currentTaskId === taskId) return "available"
  
  // Check if previous task is done
  const taskIndex = tasksCompleted.length
  const taskIdx = allTaskIds.indexOf(taskId)
  
  if (taskIdx === 0) return "available"
  if (taskIdx <= taskIndex) return "available"
  
  return "locked"
}

export default function TaskRoadmapPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuthStore()
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)

  const studentId = user?.id ?? mockStudentProgress[0]?.studentId

  // Get active internship plan (in real app, this would be from user's active plan)
  const activePlan = mockInternshipPlans[0] // First plan as active
  const durationProgress = mockDurationProgress

  // Get project blocks from the active plan
  const projectBlocks = activePlan.projectBlocks

  // Set initial selected block to current block
  React.useEffect(() => {
    if (!selectedBlockId && durationProgress.currentBlock) {
      setSelectedBlockId(durationProgress.currentBlock.id)
    }
  }, [selectedBlockId, durationProgress])

  // Get currently selected block
  const selectedBlock = projectBlocks.find(b => b.id === selectedBlockId) || durationProgress.currentBlock

  // Get project template for the selected block
  const selectedProject = selectedBlock
    ? mockProjectTemplates.find(t => t.id === selectedBlock.projectId)
    : null

  // Get progress for the selected project
  const progress = selectedProject
    ? mockStudentProgress.find((p) => p.projectId === selectedProject.id)
    : null

  const tasksCompleted = progress?.tasksCompleted || []
  const currentTaskId = progress?.currentTaskId
  const totalTasks = selectedProject?.tasks.length || 0
  const completedCount = tasksCompleted.length
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0
  const allTaskIds = selectedProject?.tasks.map((t) => t.id) || []
  const projectSubmissions = selectedProject
    ? mockProofSubmissions.filter(
        (s) => s.projectId === selectedProject.id && (!studentId || s.studentId === studentId)
      )
    : []

  // Get current task for quick action
  const currentTask = selectedProject?.tasks.find(t =>
    getTaskStatus(t.id, tasksCompleted, currentTaskId, projectSubmissions, allTaskIds) === "available"
  ) || selectedProject?.tasks.find(t =>
    getTaskStatus(t.id, tasksCompleted, currentTaskId, projectSubmissions, allTaskIds) === "changes_requested"
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">Milestones</h1>
          <p className="mt-1 text-sm text-secondary-500">
            Track your internship progress across all project blocks.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select
            value={selectedBlockId || ""}
            onValueChange={(v) => setSelectedBlockId(v)}
          >
            <SelectTrigger className="w-full sm:w-[340px]">
              <SelectValue placeholder="Select project block" />
            </SelectTrigger>
            <SelectContent>
              {projectBlocks.map((block) => {
                const projectTemplate = mockProjectTemplates.find((t) => t.id === block.projectId)
                if (!projectTemplate) return null
                return (
                  <SelectItem key={block.id} value={block.id}>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Block {block.order}:</span>
                      <span>{projectTemplate.title}</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {block.duration}w
                      </Badge>
                      {block.status === "completed" && (
                        <CheckCircle className="h-3 w-3 text-emerald-600" />
                      )}
                      {block.status === "in_progress" && (
                        <Clock className="h-3 w-3 text-amber-600" />
                      )}
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>

          <Link
            href={
              currentTask && selectedProject
                ? `/submissions?project=${encodeURIComponent(selectedProject.id)}&task=${encodeURIComponent(currentTask.id)}`
                : "/submissions"
            }
          >
            <Button className="gap-2" disabled={!currentTask}>
              <Upload className="h-4 w-4" />
              Submit proof
            </Button>
          </Link>
        </div>
      </div>

      {/* Internship Plan Overview */}
      <Card className="border-secondary-200 bg-gradient-to-r from-primary/5 via-primary/[0.02] to-accent/5">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-primary">Active Internship Plan</h3>
            <Badge className="ml-2">{activePlan.totalWeeks} weeks</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {projectBlocks.map((block) => {
              const projectTemplate = mockProjectTemplates.find((t) => t.id === block.projectId)
              if (!projectTemplate) return null
              const isSelected = selectedBlockId === block.id
              return (
                <div
                  key={block.id}
                  className={cn(
                    "p-4 rounded-xl border-2 cursor-pointer transition-all",
                    isSelected
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-secondary-200 bg-white hover:border-primary/30"
                  )}
                  onClick={() => setSelectedBlockId(block.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                        block.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                        block.status === "in_progress" ? "bg-primary text-white" :
                        "bg-secondary-100 text-secondary-500"
                      )}>
                        {block.status === "completed" ? <CheckCircle className="h-4 w-4" /> :
                         block.status === "in_progress" ? <PlayCircle className="h-4 w-4" /> :
                         block.order}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-secondary-900">Block {block.order}</div>
                        <div className="text-xs text-secondary-500">{block.duration} weeks</div>
                      </div>
                    </div>
                    {block.status === "completed" && (
                      <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs">Done</Badge>
                    )}
                    {block.status === "in_progress" && (
                      <Badge className="bg-primary/10 text-primary border-0 text-xs">Active</Badge>
                    )}
                  </div>
                  <div className="text-sm font-medium text-secondary-700 line-clamp-1">
                    {projectTemplate.title}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-secondary-600">
              <span className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                Completed
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary" />
                In Progress
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-secondary-400" />
                Locked
              </span>
            </div>
            <div className="text-sm font-semibold text-primary">
              Overall: {durationProgress.percentage}% complete
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Project Progress */}
      {selectedProject && (
        <Card className="border-secondary-200">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-semibold text-secondary-900">Block Progress</h3>
                    <p className="mt-0.5 text-xs font-medium text-secondary-500">
                      {selectedProject.title} • {selectedProject.duration} • {selectedProject.difficulty}
                    </p>
                  </div>
                  <span className="text-2xl font-bold text-primary">{progressPercent}%</span>
                </div>
                <Progress value={progressPercent} variant="brand" className="h-3 mb-3" />
                <p className="text-sm text-secondary-600">
                  {completedCount} of {totalTasks} tasks completed
                  {completedCount === totalTasks && " 🎉 Block complete!"}
                </p>
              </div>

              {completedCount === totalTasks && (
                <Button variant="outline" className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Mark Block Complete
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Task Status Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        {(["available", "in_progress", "submitted", "changes_requested", "approved", "locked"] as TaskStatus[]).map((status) => {
          const config = statusConfig[status as TaskStatus]
          return (
            <div key={status} className="flex items-center gap-1.5">
              <div className={`h-2 w-2 rounded-full ${config.dotColor}`} />
              <span className="font-medium text-secondary-600">{config.label}</span>
            </div>
          )
        })}
      </div>

      {/* Task Roadmap */}
      {selectedProject && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-primary">Task Roadmap</h2>
          {selectedProject.tasks.map((task: any, index: number) => {
          const status = getTaskStatus(task.id, tasksCompleted, currentTaskId, projectSubmissions, allTaskIds)
          const config = statusConfig[status]
          const isLast = index === selectedProject.tasks.length - 1

          return (
            <div key={task.id} className="relative">
              {/* Connector line */}
              {!isLast && (
                <div
                  className={`absolute left-5 top-14 w-0.5 h-8 ${
                    status === "approved" || status === "done"
                      ? "bg-gradient-to-b from-primary/30 via-primary/20 to-accent/35"
                      : "bg-gradient-to-b from-secondary-200 to-secondary-100"
                  }`}
                />
              )}

              <Card
                className={`border-l-4 transition-all duration-200 hover:shadow-md ${
                  status === "locked" ? "opacity-60" : ""
                } ${config.borderColor}`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Status Icon */}
                    <div className={`
                      flex h-10 w-10 shrink-0 items-center justify-center rounded-full
                      ${config.bgColor}
                    `}>
                      <span className={config.textColor}>{config.icon}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className={`font-semibold text-lg ${status === "locked" ? "text-slate-400" : "text-slate-900"}`}>
                              Task {index + 1}: {task.title}
                            </h3>
                            <Badge
                              variant="outline"
                              className={`text-xs ${config.bgColor} ${config.textColor} ${config.borderColor}`}
                            >
                              {config.label}
                            </Badge>
                          </div>

                          <p className={`text-sm mb-2 ${status === "locked" ? "text-slate-400" : "text-slate-600"}`}>
                            {task.description}
                          </p>

                          <p className="text-xs text-slate-500">
                            <span className="font-medium">Expected Output:</span> {task.expectedOutput}
                          </p>

                          {/* Unlock info for locked tasks */}
                          {status === "locked" && index > 0 && (
                            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                              <Lock className="h-3 w-3" />
                              Complete &quot;{selectedProject.tasks[index - 1].title}&quot; to unlock
                            </p>
                          )}

                          {/* Submission summary for submitted/approved tasks */}
                          {(status === "submitted" || status === "changes_requested" || status === "approved") && (
                            <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                              <p className="text-xs text-slate-600 mb-1">
                                <span className="font-medium">Your submission:</span>
                              </p>
                              {projectSubmissions.find(s => s.taskId === task.id)?.prLink && (
                                <a
                                  href={projectSubmissions.find(s => s.taskId === task.id)?.prLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  View PR
                                </a>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Action Button */}
                        <div className="shrink-0">
                          {status === "available" && (
                            <Link
                              href={`/submissions?project=${encodeURIComponent(selectedProject.id)}&task=${encodeURIComponent(task.id)}`}
                            >
                              <Button size="sm" className="gap-1">
                                Start <ChevronRight className="h-4 w-4" />
                              </Button>
                            </Link>
                          )}
                          {status === "changes_requested" && (
                            <Link href={`/submissions?task=${task.id}&resubmit=true`}>
                              <Button size="sm" variant="outline" className="gap-1 border-orange-200 text-orange-700 hover:bg-orange-50">
                                Resubmit
                                <ArrowRight className="h-3 w-3" />
                              </Button>
                            </Link>
                          )}
                          {status === "approved" && (
                            <div className="flex items-center gap-1 text-emerald-600 text-sm">
                              <CheckCircle className="h-4 w-4" />
                              Done
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        })}
        </div>
      )}

      {/* Certificate Preview (when all tasks done) */}
      {completedCount === totalTasks && (
        <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-900">Project Complete!</h3>
                  <p className="text-sm text-emerald-700">
                    You&apos;ve completed all tasks. Your certificate is ready.
                  </p>
                </div>
              </div>
              <Link href="/certificates">
                <Button className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Download Certificate
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
