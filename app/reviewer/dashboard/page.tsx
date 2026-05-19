"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { useReviewerDashboard, ReviewerTask, useApproveTask, useRejectTask } from "@/lib/hooks/use-reviewer"
import {
  Clock,
  AlertCircle,
  FileCheck,
  ExternalLink,
  Eye,
  FileText,
  Loader2,
} from "lucide-react"

export default function ReviewerDashboard() {
  const { data: dashboardData, isLoading, error } = useReviewerDashboard()
  const [selectedTask, setSelectedTask] = useState<ReviewerTask | null>(null)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [feedback, setFeedback] = useState("")

  const approveTask = useApproveTask()
  const rejectTask = useRejectTask()

  const reviewTasks = dashboardData?.tasks || []
  const stats = dashboardData?.stats || { total: 0, pending: 0, inProgress: 0, urgent: 0 }

  // Set initial selected task when data loads
  if (reviewTasks.length > 0 && !selectedTask) {
    setSelectedTask(reviewTasks[0])
  }

  const handleApprove = () => {
    if (selectedTask) {
      approveTask.mutate({ taskId: selectedTask.taskId, feedback: feedback || undefined })
      setApproveDialogOpen(false)
      setFeedback("")
      setSelectedTask(null)
    }
  }

  const handleReject = () => {
    if (selectedTask) {
      rejectTask.mutate({ taskId: selectedTask.taskId, feedback: feedback || "Task rejected" })
      setRejectDialogOpen(false)
      setFeedback("")
      setSelectedTask(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-secondary-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 mb-2">Failed to load dashboard</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  if (reviewTasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FileCheck className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
          <p className="text-secondary-600 mb-2">No pending reviews</p>
          <p className="text-sm text-secondary-500">You're all caught up!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-primary tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-secondary-500">
          Overview of pending reviews and recent activity
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-secondary-500">Total</p>
                <p className="text-xl sm:text-2xl font-bold text-primary">{stats.total}</p>
              </div>
              <div className="h-8 sm:h-10 w-8 sm:w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <FileCheck className="h-4 sm:h-5 w-4 sm:w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-secondary-500">Pending</p>
                <p className="text-xl sm:text-2xl font-bold text-amber-600">{stats.pending}</p>
              </div>
              <div className="h-8 sm:h-10 w-8 sm:w-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                <Clock className="h-4 sm:h-5 w-4 sm:w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-secondary-500">In Progress</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
              <div className="h-8 sm:h-10 w-8 sm:w-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                <Eye className="h-4 sm:h-5 w-4 sm:w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-secondary-500">Urgent</p>
                <p className="text-xl sm:text-2xl font-bold text-red-600">{stats.urgent}</p>
              </div>
              <div className="h-8 sm:h-10 w-8 sm:w-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                <AlertCircle className="h-4 sm:h-5 w-4 sm:w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content - Task List and Detail */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Task List */}
        <Card className="lg:col-span-1">
          <CardContent className="p-0">
            <div className="border-b border-secondary-100 p-4">
              <h2 className="font-semibold text-primary">Pending Reviews</h2>
              <p className="text-xs sm:text-sm text-secondary-500">You have {reviewTasks.length} submissions requiring technical validation.</p>
            </div>
            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {reviewTasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className={cn(
                    "w-full p-3 sm:p-4 text-left transition-colors hover:bg-neutral-100",
                    selectedTask?.id === task.id ? "bg-primary/5" : ""
                  )}
                >
                  <div className="flex items-start gap-3">
                    {task.student.avatar ? (
                      <img
                        src={task.student.avatar}
                        alt={task.student.name}
                        className="h-8 w-8 sm:h-10 sm:w-10 rounded-full flex-shrink-0"
                      />
                    ) : (
                      <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-semibold text-sm">
                          {task.student.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-primary text-sm sm:text-base truncate">{task.student.name}</p>
                        <span className="text-xs text-secondary-500 flex-shrink-0">{task.submittedAt}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-secondary-600 line-clamp-1">{task.milestone.title}</p>
                      <p className="text-xs text-secondary-500 truncate">{task.milestone.internship}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-secondary-400">{task.files.length} artifacts</span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            task.status === "pending" ? "text-amber-600 border-amber-200" :
                            "text-blue-600 border-blue-200"
                          )}
                        >
                          {task.status === "pending" ? "Pending" : "In Progress"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Review Detail */}
        {selectedTask && (
          <Card className="lg:col-span-2">
            <CardContent className="p-4 sm:p-6">
              {/* Task Header */}
              <div className="flex items-start gap-3 sm:gap-4 border-b border-secondary-100 pb-4 sm:pb-6">
                {selectedTask.student.avatar ? (
                  <img
                    src={selectedTask.student.avatar}
                    alt={selectedTask.student.name}
                    className="h-10 w-10 sm:h-12 sm:w-12 rounded-full flex-shrink-0"
                  />
                ) : (
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-semibold text-lg">
                      {selectedTask.student.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <h2 className="font-semibold text-primary text-sm sm:text-base">{selectedTask.student.name}</h2>
                      <p className="text-xs sm:text-sm text-secondary-600">{selectedTask.milestone.title}</p>
                      <p className="text-xs text-secondary-500">{selectedTask.milestone.internship}</p>
                    </div>
                    <Badge variant="success" className="text-xs">IN REVIEW</Badge>
                  </div>
                </div>
              </div>

              {/* PR Link */}
              {selectedTask.prLink && (
                <div className="border-b border-secondary-100 py-4 sm:py-6">
                  <h3 className="mb-2 sm:mb-3 text-xs sm:text-sm font-semibold text-primary">PULL REQUEST</h3>
                  <a
                    href={selectedTask.prLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline text-sm"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {selectedTask.prLink}
                  </a>
                </div>
              )}

              {/* Commit Hash */}
              {selectedTask.commitHash && (
                <div className="border-b border-secondary-100 py-4 sm:py-6">
                  <h3 className="mb-2 sm:mb-3 text-xs sm:text-sm font-semibold text-primary">COMMIT HASH</h3>
                  <p className="text-xs sm:text-sm text-secondary-600 font-mono">{selectedTask.commitHash}</p>
                </div>
              )}

              {/* Submission Overview */}
              <div className="border-b border-secondary-100 py-4 sm:py-6">
                <h3 className="mb-2 sm:mb-3 text-xs sm:text-sm font-semibold text-primary">SUBMISSION OVERVIEW</h3>
                {selectedTask.notes ? (
                  (() => {
                    try {
                      const parsed = JSON.parse(selectedTask.notes)
                      return (
                        <div className="space-y-2 text-xs sm:text-sm text-secondary-600">
                          {parsed.builtWhat && (
                            <div>
                              <span className="font-medium text-primary">Built: </span>
                              {parsed.builtWhat}
                            </div>
                          )}
                          {parsed.problemSolved && (
                            <div>
                              <span className="font-medium text-primary">Problem Solved: </span>
                              {parsed.problemSolved}
                            </div>
                          )}
                          {parsed.hardestPart && (
                            <div>
                              <span className="font-medium text-primary">Hardest Part: </span>
                              {parsed.hardestPart}
                            </div>
                          )}
                          {parsed.solutionApproach && (
                            <div>
                              <span className="font-medium text-primary">Solution Approach: </span>
                              {parsed.solutionApproach}
                            </div>
                          )}
                          {parsed.usedAI && (
                            <div>
                              <span className="font-medium text-primary">Used AI: </span>
                              {parsed.usedAI === 'yes' ? 'Yes' : 'No'}
                            </div>
                          )}
                          {parsed.aiUsage && parsed.usedAI === 'yes' && (
                            <div>
                              <span className="font-medium text-primary">AI Usage: </span>
                              {parsed.aiUsage}
                            </div>
                          )}
                        </div>
                      )
                    } catch {
                      return <p className="text-xs sm:text-sm text-secondary-600">{selectedTask.notes}</p>
                    }
                  })()
                ) : (
                  <p className="text-xs sm:text-sm text-secondary-600">No notes provided.</p>
                )}
              </div>

              {/* Proof Attachments */}
              {selectedTask.files.length > 0 && (
                <div className="border-b border-secondary-100 py-4 sm:py-6">
                  <h3 className="mb-2 sm:mb-3 text-xs sm:text-sm font-semibold text-primary">PROOF ATTACHMENTS</h3>
                  <div className="space-y-2">
                    {selectedTask.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between rounded-lg border border-secondary-200 bg-neutral-100 p-3">
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 sm:h-5 w-4 sm:w-5 text-secondary-400" />
                          <span className="text-xs sm:text-sm font-medium text-gray-700 truncate">{file.name}</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className="text-xs text-secondary-500">{file.size}</span>
                          {file.url && (
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center rounded hover:bg-secondary-100 transition-colors"
                            >
                              <ExternalLink className="h-3 sm:h-4 w-3 sm:w-4 text-secondary-500" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 sm:gap-3 pt-4 sm:pt-6 flex-wrap">
                <Button
                  variant="outline"
                  className="text-red-600 hover:bg-red-50 text-xs sm:text-sm"
                  onClick={() => setRejectDialogOpen(true)}
                  disabled={approveTask.isPending || rejectTask.isPending}
                >
                  Reject
                </Button>
                <Button
                  className="bg-primary text-xs sm:text-sm"
                  onClick={() => setApproveDialogOpen(true)}
                  disabled={approveTask.isPending || rejectTask.isPending}
                >
                  Approve
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reject Dialog */}
        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Task</DialogTitle>
              <DialogDescription>
                Provide feedback to the student on why this task was rejected.
              </DialogDescription>
            </DialogHeader>
            <Textarea
              placeholder="Enter your feedback here..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
            />
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setRejectDialogOpen(false)
                  setFeedback("")
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={rejectTask.isPending}
              >
                {rejectTask.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Reject Task
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Approve Dialog */}
        <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Approve Task</DialogTitle>
              <DialogDescription>
                Optionally provide feedback to the student on their submission.
              </DialogDescription>
            </DialogHeader>
            <Textarea
              placeholder="Enter your feedback here (optional)..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
            />
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setApproveDialogOpen(false)
                  setFeedback("")
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleApprove}
                disabled={approveTask.isPending}
              >
                {approveTask.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Approve Task
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
