"use client"

import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  CheckCircle,
  XCircle,
  MessageSquare,
  Calendar,
  Search,
  Filter,
  Download,
  TrendingUp,
  Clock,
  Star,
  User
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data for review history
const mockHistory = [
  {
    id: "1",
    student: {
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128&h=128&fit=crop",
    },
    project: {
      title: "Full-Stack Architecture Internship",
      duration: "8 weeks",
    },
    task: {
      title: "Milestone 2: API Design & Implementation",
    },
    reviewedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    status: "approved" as const,
    reviewDuration: 45, // minutes
    rating: 5,
  },
  {
    id: "2",
    student: {
      name: "Michael Brown",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop",
    },
    project: {
      title: "Data Science Fellowship",
      duration: "12 weeks",
    },
    task: {
      title: "Milestone 1: Data Collection & Cleaning",
    },
    reviewedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    status: "changes_requested" as const,
    reviewDuration: 60,
    rating: 3,
  },
  {
    id: "3",
    student: {
      name: "Emily Davis",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop",
    },
    project: {
      title: "UX Research Mastery",
      duration: "4 weeks",
    },
    task: {
      title: "Milestone 3: User Testing Analysis",
    },
    reviewedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    status: "approved" as const,
    reviewDuration: 30,
    rating: 4,
  },
  {
    id: "4",
    student: {
      name: "James Wilson",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop",
    },
    project: {
      title: "Machine Learning Engineer",
      duration: "16 weeks",
    },
    task: {
      title: "Milestone 4: Model Deployment",
    },
    reviewedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
    status: "approved" as const,
    reviewDuration: 55,
    rating: 5,
  },
]

type FilterType = "all" | "approved" | "changes_requested"

export default function ReviewHistoryPage() {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredHistory = mockHistory.filter((review) => {
    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "approved" && review.status === "approved") ||
      (selectedFilter === "changes_requested" && review.status === "changes_requested")

    const matchesSearch =
      review.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.task.title.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesFilter && matchesSearch
  })

  const getTimeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return "Today"
    if (days === 1) return "Yesterday"
    if (days < 7) return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`
    return `${Math.floor(days / 30)} months ago`
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-emerald-600" />
      case "changes_requested":
        return <MessageSquare className="h-4 w-4 text-amber-600" />
      default:
        return <XCircle className="h-4 w-4 text-red-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "changes_requested":
        return "bg-amber-100 text-amber-700 border-amber-200"
      default:
        return "bg-red-100 text-red-700 border-red-200"
    }
  }

  const stats = {
    total: mockHistory.length,
    approved: mockHistory.filter(r => r.status === "approved").length,
    changesRequested: mockHistory.filter(r => r.status === "changes_requested").length,
    averageRating: (mockHistory.reduce((sum, r) => sum + r.rating, 0) / mockHistory.length).toFixed(1),
    averageTime: Math.round(mockHistory.reduce((sum, r) => sum + r.reviewDuration, 0) / mockHistory.length),
  }

  return (
    <div className="space-y-6">
      {/* Page Title & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">Review History</h1>
          <p className="mt-1 text-sm text-secondary-500">
            Track your completed reviews and performance
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2 self-start sm:self-auto">
          <Download className="h-4 w-4" />
          Export History
        </Button>
      </div>

      {/* Performance Stats */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-secondary-500">Total Reviews</p>
                <p className="text-xl sm:text-2xl font-bold text-primary">{stats.total}</p>
              </div>
              <div className="h-8 sm:h-10 w-8 sm:w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <CheckCircle className="h-4 sm:h-5 w-4 sm:w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-secondary-500">Approval Rate</p>
                <p className="text-xl sm:text-2xl font-bold text-emerald-600">
                  {Math.round((stats.approved / stats.total) * 100)}%
                </p>
              </div>
              <div className="h-8 sm:h-10 w-8 sm:w-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                <TrendingUp className="h-4 sm:h-5 w-4 sm:w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-secondary-500">Avg Rating</p>
                <div className="flex items-center gap-1">
                  <p className="text-xl sm:text-2xl font-bold text-amber-600">{stats.averageRating}</p>
                  <Star className="h-3 sm:h-4 w-3 sm:w-4 text-amber-600 fill-amber-600" />
                </div>
              </div>
              <div className="h-8 sm:h-10 w-8 sm:w-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                <Star className="h-4 sm:h-5 w-4 sm:w-5 text-amber-600 fill-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-secondary-500">Avg Review Time</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">{stats.averageTime}m</p>
              </div>
              <div className="h-8 sm:h-10 w-8 sm:w-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                <Clock className="h-4 sm:h-5 w-4 sm:w-5 text-blue-600" />
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
                variant={selectedFilter === "approved" ? "primary" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("approved")}
                className="text-xs sm:text-sm"
              >
                Approved ({stats.approved})
              </Button>
              <Button
                variant={selectedFilter === "changes_requested" ? "primary" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("changes_requested")}
                className="text-xs sm:text-sm"
              >
                Changes Requested ({stats.changesRequested})
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

      {/* Review History List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredHistory.length === 0 ? (
          <Card>
            <CardContent className="p-8 sm:p-12 text-center">
              <CheckCircle className="h-10 sm:h-12 w-10 sm:w-12 text-secondary-300 mx-auto mb-4" />
              <p className="text-sm sm:text-base text-secondary-600">No reviews match your criteria</p>
              <p className="text-xs sm:text-sm text-secondary-400 mt-1">Try adjusting your filters</p>
            </CardContent>
          </Card>
        ) : (
          filteredHistory.map((review) => (
            <Card key={review.id} className="hover:shadow-md transition-all">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-start lg:justify-between">
                  {/* Left: Student & Task Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <img
                        src={review.student.avatar}
                        alt={review.student.name}
                        className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-sm sm:text-base text-secondary-900">
                            {review.student.name}
                          </h3>
                          <Badge
                            variant="outline"
                            className={cn("text-xs", getStatusColor(review.status))}
                          >
                            <div className="flex items-center gap-1">
                              {getStatusIcon(review.status)}
                              {review.status === "approved" ? "Approved" : "Changes Requested"}
                            </div>
                          </Badge>
                        </div>
                        <p className="text-xs sm:text-sm text-secondary-600">
                          {review.project.title} • {review.project.duration}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-secondary-900 mb-1">
                          {review.task.title}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-secondary-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 sm:h-4 w-3 sm:w-4" />
                          <span>Reviewed {getTimeAgo(review.reviewedAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 sm:h-4 w-3 sm:w-4" />
                          <span>{review.reviewDuration} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 sm:h-4 w-3 sm:w-4 text-amber-500 fill-amber-500" />
                          <span>{review.rating}/5</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Action */}
                  <div className="flex lg:flex-col lg:w-auto">
                    <Button variant="outline" size="sm" className="gap-2 text-xs sm:text-sm">
                      <User className="h-3 sm:h-4 w-3 sm:w-4" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
