"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  FileCheck
} from "lucide-react"
import { mockReviewTasks } from "@/lib/mockData"

export default function AdminReviewsPage() {
  const statuses = ["all", "pending", "approved", "changes_requested"] as const
  type ReviewStatus = (typeof statuses)[number]
  const [statusFilter, setStatusFilter] = useState<ReviewStatus>("all")

  const filteredReviews = useMemo(() => {
    if (statusFilter === "all") return mockReviewTasks
    return mockReviewTasks.filter(task => task.status === statusFilter)
  }, [statusFilter])

  const reviewStats = useMemo(() => {
    const pending = mockReviewTasks.filter(t => t.status === "pending").length
    const approved = mockReviewTasks.filter(t => t.status === "approved").length
    const changes = mockReviewTasks.filter(t => t.status === "changes_requested").length
    const today = mockReviewTasks.filter(t => {
      const today = new Date()
      const taskDate = new Date(t.submittedAt)
      return taskDate.toDateString() === today.toDateString() && t.status === "approved"
    }).length

    return {
      pending,
      approved,
      changes,
      today,
      total: mockReviewTasks.length
    }
  }, [])

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-primary">Review Queue</h1>
        <p className="text-sm text-secondary-600">Monitor and manage all submission reviews</p>
      </div>

      {/* Review Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-amber-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">{reviewStats.pending}</p>
            <p className="text-sm text-slate-600">Pending Reviews</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">{reviewStats.today}</p>
            <p className="text-sm text-slate-600">Approved Today</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <AlertCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">{reviewStats.changes}</p>
            <p className="text-sm text-slate-600">Changes Requested</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <FileCheck className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">{reviewStats.total}</p>
            <p className="text-sm text-slate-600">Total Reviews</p>
          </CardContent>
        </Card>
      </div>

      {/* Review Queue */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>All Reviews</CardTitle>
              <CardDescription>Filter and manage submission reviews</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-2">
              {statuses.map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                >
                  {status === "changes_requested" ? "Changes" : status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredReviews.map((task) => (
              <div 
                key={task.id} 
                className="flex items-center justify-between p-4 hover:bg-secondary-50 rounded-lg transition-colors border border-secondary-100"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-medium text-secondary-900">{task.taskTitle}</p>
                    <Badge variant={
                      task.status === "pending" ? "warning" : 
                      task.status === "approved" ? "success" : "secondary"
                    } className="text-xs">
                      {task.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-secondary-500 mb-2">
                    {task.studentName} · {task.projectName}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-secondary-500">
                    <span>Submitted {task.submittedAt.toLocaleDateString()}</span>
                    <span>Assigned to {task.reviewerName || "Unassigned"}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Assign Reviewer
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
