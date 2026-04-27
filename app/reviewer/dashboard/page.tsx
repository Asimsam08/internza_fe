"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  CheckCircle,
  Clock,
  AlertCircle,
  FileCheck,
  ExternalLink,
  Eye,
  Calendar,
  Download,
  TrendingUp,
  Star,
  FileText,
} from "lucide-react"

const reviewTasks = [
  {
    id: 1,
    student: {
      name: "Alex Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop",
    },
    milestone: {
      title: "Milestone 3: Database Optimization & API Security",
      internship: "Full-Stack Architecture Internship",
    },
    submittedAt: "2 hours ago",
    files: [
      { name: "prisma-schema.diff", type: "diff", size: "2.4 KB" },
      { name: "benchmark-results.pdf", type: "pdf", size: "184 KB" },
    ],
    notes: "Implemented the indexing strategy discussed in our last sync. Query latency was reduced by 45% across the nine user tables. I also integrated JWT with rotating refresh tokens for the security milestone.",
    checklist: [
      { label: "Architecture Scalability", checked: true },
      { label: "Security Protocol Adherence", checked: true },
      { label: "Code Documentation", checked: false },
    ],
    mentorComments: "Great job on the query optimization...",
    status: "pending",
  },
  {
    id: 2,
    student: {
      name: "Maya Rodriguez",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop",
    },
    milestone: {
      title: "Milestone 1: User Interview Protocol",
      internship: "UX Research Mastery",
    },
    submittedAt: "5 hours ago",
    files: [
      { name: "interview-guide.md", type: "markdown", size: "8.9 KB" },
      { name: "consent-forms.pdf", type: "pdf", size: "156 KB" },
    ],
    status: "pending",
  },
  {
    id: 3,
    student: {
      name: "Jordan Smith",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop",
    },
    milestone: {
      title: "Milestone 2: Statistical Analysis Pipeline",
      internship: "Data Science Fellowship",
    },
    submittedAt: "1 day ago",
    files: [
      { name: "analysis.ipynb", type: "jupyter", size: "452 KB" },
    ],
    status: "in_progress",
  },
]

export default function ReviewerDashboard() {
  const [selectedTask, setSelectedTask] = useState(reviewTasks[0])

  const stats = {
    total: reviewTasks.length,
    pending: reviewTasks.filter(t => t.status === "pending").length,
    inProgress: reviewTasks.filter(t => t.status === "in_progress").length,
    urgent: reviewTasks.filter(t => t.status === "pending" && t.submittedAt.includes("day")).length,
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
                    selectedTask.id === task.id ? "bg-primary/5" : ""
                  )}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={task.student.avatar}
                      alt={task.student.name}
                      className="h-8 w-8 sm:h-10 sm:w-10 rounded-full flex-shrink-0"
                    />
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
                            task.status === "pending" ? "text-amber-600 border-amber-200" : "text-blue-600 border-blue-200"
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
        <Card className="lg:col-span-2">
          <CardContent className="p-4 sm:p-6">
            {/* Task Header */}
            <div className="flex items-start gap-3 sm:gap-4 border-b border-secondary-100 pb-4 sm:pb-6">
              <img
                src={selectedTask.student.avatar}
                alt={selectedTask.student.name}
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-full flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <Badge variant="secondary" className="mb-1 sm:mb-2 text-xs">MILESTONE 3</Badge>
                    <h2 className="font-semibold text-primary text-sm sm:text-base">{selectedTask.student.name}</h2>
                    <p className="text-xs sm:text-sm text-secondary-600">{selectedTask.milestone.title}</p>
                  </div>
                  <Badge variant="success" className="text-xs">IN REVIEW</Badge>
                </div>
              </div>
            </div>

            {/* Submission Overview */}
            <div className="border-b border-secondary-100 py-4 sm:py-6">
              <h3 className="mb-2 sm:mb-3 text-xs sm:text-sm font-semibold text-primary">SUBMISSION OVERVIEW</h3>
              <p className="text-xs sm:text-sm text-secondary-600">{selectedTask.notes || "No notes provided."}</p>
            </div>

            {/* Proof Attachments */}
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
                      <Button variant="ghost" size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0">
                        <ExternalLink className="h-3 sm:h-4 w-3 sm:w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Review Checklist */}
            {selectedTask.checklist && (
              <div className="border-b border-secondary-100 py-4 sm:py-6">
                <h3 className="mb-2 sm:mb-3 text-xs sm:text-sm font-semibold text-primary">TECHNICAL REVIEW CHECKLIST</h3>
                <div className="space-y-2">
                  {selectedTask.checklist.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className={cn(
                        "flex h-4 sm:h-5 w-4 sm:w-5 items-center justify-center rounded border flex-shrink-0",
                        item.checked ? "border-emerald-500 bg-emerald-500" : "border-secondary-300"
                      )}>
                        {item.checked && <CheckCircle className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-white" />}
                      </div>
                      <span className={cn("text-xs sm:text-sm", item.checked ? "text-primary" : "text-secondary-500")}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mentor Comments */}
            {selectedTask.mentorComments && (
              <div className="border-b border-secondary-100 py-4 sm:py-6">
                <h3 className="mb-2 sm:mb-3 text-xs sm:text-sm font-semibold text-primary">MENTOR COMMENTS</h3>
                <div className="rounded-lg bg-neutral-100 p-3">
                  <p className="text-xs sm:text-sm text-secondary-600">{selectedTask.mentorComments}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 sm:gap-3 pt-4 sm:pt-6 flex-wrap">
              <Button variant="outline" className="text-red-600 hover:bg-red-50 text-xs sm:text-sm">
                Reject
              </Button>
              <Button variant="outline" className="text-xs sm:text-sm">
                Request Changes
              </Button>
              <Button className="bg-primary text-xs sm:text-sm">
                Approve Proof
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
