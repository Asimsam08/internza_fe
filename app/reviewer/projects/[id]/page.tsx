"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  FileCheck,
  Loader2,
  ArrowLeft,
  CheckCircle,
  XCircle,
  MessageSquare,
  Clock,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api-client"
import { DataTable } from "@/components/ui/data-table"

interface ProjectTask {
  id: string
  title: string
  description: string
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED'
  order: number
  milestone: {
    id: string
    title: string
    order: number
  }
}

interface ProjectStudent {
  name: string
  email: string
  university: string | null
  graduationYear: number | null
}

interface ProjectDetail {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  duration: number
  student: {
    name: string
    email: string
  }
  students: ProjectStudent[]
  tasks: ProjectTask[]
}

type TabType = "students" | "tasks"

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = params.id as string
  const [activeTab, setActiveTab] = useState<TabType>("tasks")

  console.log('Component mounted, projectId:', projectId)

  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project-detail', projectId],
    queryFn: async (): Promise<ProjectDetail> => {
      try {
        console.log('Fetching project:', projectId)
        const url = `/students/reviewer/project/${projectId}`
        console.log('Request URL:', url)
        const response = await api.get<{ data: ProjectDetail }>(url)
        console.log('Project data response:', response)
        return response.data
      } catch (err) {
        console.error('Error fetching project:', err)
        throw err
      }
    },
    enabled: !!projectId,
  })

  if (error) {
    console.error('Query error:', error)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading project</p>
          <p className="text-sm text-secondary-600">{error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      </div>
    )
  }

  console.log('Project data:', project)
  console.log('Tasks:', project?.tasks)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle className="h-4 w-4 text-emerald-600" />
      case "REJECTED":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "CHANGES_REQUESTED":
        return <MessageSquare className="h-4 w-4 text-amber-600" />
      case "SUBMITTED":
      case "UNDER_REVIEW":
        return <Clock className="h-4 w-4 text-blue-600" />
      default:
        return <FileCheck className="h-4 w-4 text-secondary-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "REJECTED":
        return "bg-red-100 text-red-700 border-red-200"
      case "CHANGES_REQUESTED":
        return "bg-amber-100 text-amber-700 border-amber-200"
      case "SUBMITTED":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "UNDER_REVIEW":
        return "bg-purple-100 text-purple-700 border-purple-200"
      default:
        return "bg-secondary-100 text-secondary-700 border-secondary-200"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "Approved"
      case "REJECTED":
        return "Rejected"
      case "CHANGES_REQUESTED":
        return "Changes Requested"
      case "SUBMITTED":
        return "Submitted"
      case "UNDER_REVIEW":
        return "In Review"
      default:
        return "Draft"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-secondary-600">Loading project details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Link href="/reviewer/projects">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Assignments
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-primary">{project?.title}</h1>
            <Badge variant="outline" className="text-xs">{project?.difficulty}</Badge>
          </div>
          <p className="text-sm text-secondary-500">Review Assignment • {project?.duration} weeks</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-secondary-200">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab("students")}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
              activeTab === "students"
                ? "border-primary text-primary"
                : "border-transparent text-secondary-500 hover:text-secondary-700"
            )}
          >
            Students ({project?.students?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
              activeTab === "tasks"
                ? "border-primary text-primary"
                : "border-transparent text-secondary-500 hover:text-secondary-700"
            )}
          >
            Tasks ({project?.tasks?.length || 0})
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "students" && (
        <DataTable
          columns={[
            {
              key: "name",
              header: "Student",
              render: (student: ProjectStudent) => (
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-semibold text-sm">
                      {student.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium text-secondary-900">{student.name}</span>
                </div>
              ),
            },
            {
              key: "email",
              header: "Email",
              render: (student: ProjectStudent) => (
                <span className="text-secondary-600">{student.email}</span>
              ),
            },
            {
              key: "university",
              header: "University",
              render: (student: ProjectStudent) => (
                <span className="text-secondary-600">{student.university ?? "—"}</span>
              ),
            },
            {
              key: "graduationYear",
              header: "Graduation Year",
              render: (student: ProjectStudent) => (
                <span className="text-secondary-600">{student.graduationYear ?? "—"}</span>
              ),
            },
          ]}
          data={project?.students ?? []}
          keyExtractor={(item, index) => `${item.email}-${index}`}
          emptyMessage="No students enrolled"
          emptySubMessage="Students will appear here once assigned"
        />
      )}

      {activeTab === "tasks" && (
        <div className="space-y-3">
          {project?.tasks.length === 0 ? (
            <Card>
              <CardContent className="p-8 sm:p-12 text-center">
                <FileCheck className="h-10 sm:h-12 w-10 sm:w-12 text-secondary-300 mx-auto mb-4" />
                <p className="text-sm sm:text-base text-secondary-600">No tasks found</p>
                <p className="text-xs sm:text-sm text-secondary-400 mt-1">Tasks will appear here once added</p>
              </CardContent>
            </Card>
          ) : (
            project?.tasks.map((task) => (
              <Card key={task.id} className="hover:shadow-md transition-all">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="font-semibold text-base text-secondary-900">
                          {task.title}
                        </h3>
                        <Badge
                          variant="outline"
                          className={cn("text-xs", getStatusColor(task.status))}
                        >
                          <div className="flex items-center gap-1">
                            {getStatusIcon(task.status)}
                            {getStatusLabel(task.status)}
                          </div>
                        </Badge>
                      </div>
                      <p className="text-sm text-secondary-600 mb-2">
                        {task.milestone.title} • Task {task.order}
                      </p>
                      <p className="text-sm text-secondary-500 line-clamp-2">
                        {task.description}
                      </p>
                    </div>

                    {(task.status === "SUBMITTED" || task.status === "UNDER_REVIEW") && (
                      <Link href={`/reviewer/dashboard?task=${task.id}`}>
                        <Button size="sm" className="gap-2 text-sm shrink-0">
                          Review
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
