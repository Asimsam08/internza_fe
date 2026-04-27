"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TaskStatus, Subtask } from "@/lib/types"
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  PlayCircle,
  GitPullRequest,
  FileText,
  MessageSquare
} from "lucide-react"
import Link from "next/link"

interface TaskBoardProps {
  subtasks: Subtask[]
  milestoneId: string
  projectId: string
  isStudent?: boolean
  isReviewer?: boolean
}

const columns: { id: TaskStatus; label: string; color: string }[] = [
  { id: "pending", label: "To Do", color: "bg-secondary-100" },
  { id: "in_progress", label: "In Progress", color: "bg-primary/10" },
  { id: "under_review", label: "Under Review", color: "bg-warning/10" },
  { id: "changes_requested", label: "Changes Needed", color: "bg-error/10" },
  { id: "approved", label: "Approved", color: "bg-accent/10" },
  { id: "done", label: "Done", color: "bg-accent/20" },
]

export function TaskBoard({ subtasks, milestoneId, projectId, isStudent = true, isReviewer = false }: TaskBoardProps) {
  const [selectedTask, setSelectedTask] = useState<Subtask | null>(null)

  const getTasksByStatus = (status: TaskStatus) => 
    subtasks.filter(t => t.status === status)

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case "pending": return <Clock className="h-4 w-4" />
      case "in_progress": return <PlayCircle className="h-4 w-4" />
      case "under_review": return <Clock className="h-4 w-4" />
      case "changes_requested": return <AlertCircle className="h-4 w-4" />
      case "approved": return <CheckCircle2 className="h-4 w-4" />
      case "done": return <CheckCircle2 className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: TaskStatus) => {
    const variants: Record<TaskStatus, "secondary" | "default" | "warning" | "error" | "success"> = {
      pending: "secondary",
      in_progress: "default",
      under_review: "warning",
      changes_requested: "error",
      approved: "success",
      done: "success",
    }
    return variants[status] || "secondary"
  }

  return (
    <div className="space-y-4">
      {/* Board Stats */}
      <div className="flex flex-wrap gap-2">
        {columns.map(col => {
          const count = getTasksByStatus(col.id).length
          return (
            <div key={col.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${col.color}`}>
              {getStatusIcon(col.id)}
              <span className="text-sm font-medium">{col.label}</span>
              <Badge variant="secondary" className="ml-1">{count}</Badge>
            </div>
          )
        })}
      </div>

      {/* Task Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {columns.map(column => {
          const tasks = getTasksByStatus(column.id)
          if (tasks.length === 0) return null

          return (
            <div key={column.id} className="space-y-3">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${column.color}`}>
                {getStatusIcon(column.id)}
                <span className="font-medium text-sm">{column.label}</span>
                <Badge variant="secondary" className="ml-auto">{tasks.length}</Badge>
              </div>

              <div className="space-y-2">
                {tasks.map(task => (
                  <Card 
                    key={task.id} 
                    className="border-secondary-200 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedTask(task)}
                  >
                    <CardHeader className="p-3 pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-sm text-primary line-clamp-2">{task.title}</h4>
                        <Badge variant={getStatusBadge(task.status)} className="shrink-0 text-xs">
                          {task.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <p className="text-xs text-secondary-500 line-clamp-2 mb-3">{task.description}</p>
                      
                      <div className="flex items-center gap-3 text-xs text-secondary-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {task.estimatedHours}h
                        </span>
                        {task.proofRequired.length > 0 && (
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {task.proofRequired.length} proofs
                          </span>
                        )}
                      </div>

                      {task.aiHints && task.aiHints.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-secondary-100">
                          <p className="text-xs text-accent-600 flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            AI hints available
                          </p>
                        </div>
                      )}

                      <div className="mt-3 flex gap-2">
                        {isStudent && task.status === "pending" && (
                          <Button size="sm" className="w-full text-xs">
                            Start Task
                          </Button>
                        )}
                        {isStudent && task.status === "in_progress" && (
                          <Link
                            href={`/submissions?project=${encodeURIComponent(projectId)}&milestone=${encodeURIComponent(
                              milestoneId
                            )}&task=${encodeURIComponent(task.id)}`}
                            className="flex-1"
                          >
                            <Button size="sm" variant="outline" className="w-full text-xs gap-1">
                              <GitPullRequest className="h-3 w-3" />
                              Submit
                            </Button>
                          </Link>
                        )}
                        {isReviewer && task.status === "under_review" && (
                          <Link href={`/reviewer/dashboard?task=${task.id}`} className="flex-1">
                            <Button size="sm" variant="outline" className="w-full text-xs">
                              Review
                            </Button>
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {subtasks.length === 0 && (
        <Card className="border-secondary-200">
          <CardContent className="py-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary-100 mb-4">
              <CheckCircle2 className="h-8 w-8 text-secondary-400" />
            </div>
            <h3 className="text-lg font-semibold text-secondary-900">No tasks yet</h3>
            <p className="mt-1 text-sm text-secondary-500">Tasks will appear here once the milestone is configured.</p>
          </CardContent>
        </Card>
      )}

      {selectedTask ? (
        <TaskDetail
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      ) : null}
    </div>
  )
}

// Task Detail Drawer/Modal component
export function TaskDetail({ task, onClose }: { task: Subtask; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <Badge variant={task.status === "done" ? "success" : "default"} className="mb-2">
              {task.status.replace("_", " ")}
            </Badge>
            <h2 className="text-xl font-bold text-primary">{task.title}</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium text-secondary-900 mb-2">Description</h3>
            <p className="text-secondary-600">{task.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-secondary-50 rounded-lg">
              <p className="text-sm text-secondary-500">Estimated Time</p>
              <p className="font-medium">{task.estimatedHours} hours</p>
            </div>
            <div className="p-3 bg-secondary-50 rounded-lg">
              <p className="text-sm text-secondary-500">Order</p>
              <p className="font-medium">#{task.order}</p>
            </div>
          </div>

          {task.dependencies.length > 0 && (
            <div>
              <h3 className="font-medium text-secondary-900 mb-2">Dependencies</h3>
              <div className="flex flex-wrap gap-2">
                {task.dependencies.map(dep => (
                  <Badge key={dep} variant="secondary">{dep}</Badge>
                ))}
              </div>
            </div>
          )}

          {task.proofRequired.length > 0 && (
            <div>
              <h3 className="font-medium text-secondary-900 mb-2">Required Proofs</h3>
              <div className="space-y-2">
                {task.proofRequired.map((proof, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 border border-secondary-200 rounded-lg">
                    <FileText className="h-4 w-4 text-secondary-400" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{proof.type.replace("_", " ")}</p>
                      <p className="text-xs text-secondary-500">{proof.description}</p>
                    </div>
                    {proof.required && <Badge>Required</Badge>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {task.aiHints && task.aiHints.length > 0 && (
            <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
              <h3 className="font-medium text-accent-700 mb-2 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                AI Suggestions
              </h3>
              <ul className="space-y-1">
                {task.aiHints.map((hint, idx) => (
                  <li key={idx} className="text-sm text-accent-600 flex items-start gap-2">
                    <span className="text-accent-400 mt-1">•</span>
                    {hint}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-secondary-200">
            <Link href={`/submissions?task=${task.id}`} className="flex-1">
              <Button className="w-full gap-2">
                <GitPullRequest className="h-4 w-4" />
                Submit Proof
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
