"use client"

import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import {
  CheckCircle,
  Clock,
  AlertCircle,
  FileCheck,
  ExternalLink,
  ChevronRight,
  User,
  Calendar,
  Filter,
  Search,
  Eye,
  Check,
  X,
  MessageSquare,
  Download
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data for review assignments
const mockAssignments = [
  {
    id: "1",
    student: {
      name: "Alex Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop",
    },
    project: {
      title: "Full-Stack Architecture Internship",
      duration: "8 weeks",
      difficulty: "Advanced",
    },
    task: {
      title: "Milestone 3: Database Optimization & API Security",
      description: "Implement indexing strategy and JWT authentication",
    },
    submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: "pending" as const,
    urgency: "normal" as const,
    proofData: {
      prLink: "https://github.com/example/pr/123",
      commitHash: "abc123def456",
      description: "Implemented the indexing strategy discussed in our last sync. Query latency was reduced by 45% across the nine user tables. I also integrated JWT with rotating refresh tokens for the security milestone.",
    },
  },
  {
    id: "2",
    student: {
      name: "Maya Rodriguez",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop",
    },
    project: {
      title: "UX Research Mastery",
      duration: "4 weeks",
      difficulty: "Intermediate",
    },
    task: {
      title: "Milestone 1: User Interview Protocol",
      description: "Create interview guide and consent forms",
    },
    submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    status: "pending" as const,
    urgency: "normal" as const,
    proofData: {
      description: "Created comprehensive interview protocol with 15 questions covering user behavior patterns. Also included IRB-approved consent forms with proper data handling clauses.",
    },
  },
  {
    id: "3",
    student: {
      name: "Jordan Smith",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop",
    },
    project: {
      title: "Data Science Fellowship",
      duration: "12 weeks",
      difficulty: "Advanced",
    },
    task: {
      title: "Milestone 2: Statistical Analysis Pipeline",
      description: "Build data pipeline with statistical models",
    },
    submittedAt: new Date(Date.now() - 26 * 60 * 60 * 1000), // 26 hours ago
    status: "in_progress" as const,
    urgency: "high" as const,
    proofData: {
      prLink: "https://github.com/example/pr/456",
      description: "Built end-to-end pipeline using Airflow and scikit-learn. Model achieved 87% accuracy on validation set.",
    },
  },
]

type FilterType = "all" | "pending" | "in_progress" | "urgent"

export default function MyReviewsPage() {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null)

  const filteredAssignments = mockAssignments.filter((assignment) => {
    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "pending" && assignment.status === "pending") ||
      (selectedFilter === "in_progress" && assignment.status === "in_progress") ||
      (selectedFilter === "urgent" && assignment.urgency === "high")

    const matchesSearch =
      assignment.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.task.title.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesFilter && matchesSearch
  })

  const getTimeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`
    return "Just now"
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200"
      case "critical":
        return "bg-red-500 text-white border-red-600"
      default:
        return "bg-secondary-100 text-secondary-600 border-secondary-200"
    }
  }

  const stats = {
    total: mockAssignments.length,
    pending: mockAssignments.filter(a => a.status === "pending").length,
    inProgress: mockAssignments.filter(a => a.status === "in_progress").length,
    urgent: mockAssignments.filter(a => a.urgency === "high").length,
  }

  return (
    <div className="space-y-6">
      {/* Page Title & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">My Reviews</h1>
          <p className="mt-1 text-sm text-secondary-500">
            Manage your assigned review tasks
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2 self-start sm:self-auto">
          <Download className="h-4 w-4" />
          Export
        </Button>
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

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedFilter === "all" ? "primary" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("all")}
                className="text-xs sm:text-sm"
              >
                All ({stats.total})
              </Button>
              <Button
                variant={selectedFilter === "pending" ? "primary" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("pending")}
                className="text-xs sm:text-sm"
              >
                Pending ({stats.pending})
              </Button>
              <Button
                variant={selectedFilter === "in_progress" ? "primary" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("in_progress")}
                className="text-xs sm:text-sm"
              >
                In Progress ({stats.inProgress})
              </Button>
              <Button
                variant={selectedFilter === "urgent" ? "primary" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("urgent")}
                className={cn("text-xs sm:text-sm", selectedFilter === "urgent" ? "bg-red-600" : "")}
              >
                Urgent ({stats.urgent})
              </Button>
            </div>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-full sm:w-64 rounded-lg border border-secondary-200 bg-white pl-10 pr-4 text-sm focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredAssignments.length === 0 ? (
          <Card>
            <CardContent className="p-8 sm:p-12 text-center">
              <FileCheck className="h-10 sm:h-12 w-10 sm:w-12 text-secondary-300 mx-auto mb-4" />
              <p className="text-sm sm:text-base text-secondary-600">No reviews match your criteria</p>
              <p className="text-xs sm:text-sm text-secondary-400 mt-1">Try adjusting your filters</p>
            </CardContent>
          </Card>
        ) : (
          filteredAssignments.map((assignment) => (
            <Card
              key={assignment.id}
              className={cn(
                "transition-all hover:shadow-md",
                selectedAssignment === assignment.id && "ring-2 ring-primary"
              )}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-start lg:justify-between">
                  {/* Left: Student & Task Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <img
                        src={assignment.student.avatar}
                        alt={assignment.student.name}
                        className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-sm sm:text-base text-secondary-900">
                            {assignment.student.name}
                          </h3>
                          <Badge
                            variant="outline"
                            className={cn("text-xs", getUrgencyColor(assignment.urgency))}
                          >
                            {assignment.urgency === "high" ? "Urgent" : assignment.status}
                          </Badge>
                        </div>
                        <p className="text-xs sm:text-sm text-secondary-600">
                          {assignment.project.title} • {assignment.project.duration} • {assignment.project.difficulty}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 sm:h-4 w-3 sm:w-4 text-secondary-400" />
                        <span className="text-xs sm:text-sm text-secondary-500">
                          Submitted {getTimeAgo(assignment.submittedAt)}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-secondary-900 mb-1">
                          {assignment.task.title}
                        </p>
                        <p className="text-xs sm:text-sm text-secondary-600 line-clamp-2">
                          {assignment.task.description}
                        </p>
                      </div>
                      {assignment.proofData.prLink && (
                        <div className="flex items-center gap-2">
                          <a
                            href={assignment.proofData.prLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs sm:text-sm text-primary hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            View PR
                          </a>
                          {assignment.proofData.commitHash && (
                            <span className="text-xs text-secondary-400">
                              • {assignment.proofData.commitHash.slice(0, 8)}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-col gap-2 sm:flex-row lg:flex-col lg:w-auto">
                    <Button
                      size="sm"
                      className="gap-2 text-xs sm:text-sm"
                      onClick={() => setSelectedAssignment(assignment.id)}
                    >
                      <Eye className="h-3 sm:h-4 w-3 sm:w-4" />
                      View & Review
                    </Button>
                    {assignment.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-1 text-emerald-600 border-emerald-200 hover:bg-emerald-50 text-xs sm:text-sm"
                        >
                          <Check className="h-3 sm:h-4 w-3 sm:w-4" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-1 text-amber-600 border-amber-200 hover:bg-amber-50 text-xs sm:text-sm"
                        >
                          <MessageSquare className="h-3 sm:h-4 w-3 sm:w-4" />
                          Request Changes
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Review Detail Modal (shown when assignment is selected) */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              {(() => {
                const assignment = mockAssignments.find(a => a.id === selectedAssignment)
                if (!assignment) return null

                return (
                  <div className="space-y-6">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img
                          src={assignment.student.avatar}
                          alt={assignment.student.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                        <div>
                          <h2 className="text-xl font-bold text-secondary-900">
                            {assignment.student.name}
                          </h2>
                          <p className="text-sm text-secondary-600">
                            {assignment.project.title}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedAssignment(null)}
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>

                    {/* Task Details */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-secondary-900">Task</h3>
                      <p className="text-base text-secondary-900 font-medium">
                        {assignment.task.title}
                      </p>
                      <p className="text-sm text-secondary-600">
                        {assignment.task.description}
                      </p>
                    </div>

                    {/* Submission Details */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-secondary-900">Submission</h3>
                      <div className="p-4 bg-secondary-50 rounded-lg">
                        <p className="text-sm text-secondary-700">
                          {assignment.proofData.description}
                        </p>
                        {assignment.proofData.prLink && (
                          <a
                            href={assignment.proofData.prLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-2 text-sm text-primary hover:underline"
                          >
                            <ExternalLink className="h-3 w-3" />
                            View Pull Request
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Review Form */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-secondary-900">Your Review</h3>
                      <div>
                        <label className="text-sm font-medium text-secondary-700 mb-2 block">
                          Overall Feedback
                        </label>
                        <textarea
                          placeholder="Provide detailed feedback on the submission..."
                          className="w-full min-h-[120px] rounded-lg border border-secondary-200 bg-white p-3 text-sm focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-secondary-700 mb-2 block">
                            Code Quality
                          </label>
                          <select className="w-full rounded-lg border border-secondary-200 bg-white p-2 text-sm focus:border-primary focus:outline-none">
                            <option>Excellent</option>
                            <option>Good</option>
                            <option>Fair</option>
                            <option>Needs Improvement</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-secondary-700 mb-2 block">
                            Documentation
                          </label>
                          <select className="w-full rounded-lg border border-secondary-200 bg-white p-2 text-sm focus:border-primary focus:outline-none">
                            <option>Excellent</option>
                            <option>Good</option>
                            <option>Fair</option>
                            <option>Needs Improvement</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t">
                      <Button className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700">
                        <Check className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 gap-2 text-amber-600 border-amber-200 hover:bg-amber-50"
                      >
                        <MessageSquare className="h-4 w-4" />
                        Request Changes
                      </Button>
                      <Button variant="ghost" onClick={() => setSelectedAssignment(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )
              })()}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
