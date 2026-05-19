"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Search,
  Clock,
  User,
  FileCheck,
  Briefcase,
  FolderKanban,
  ChevronRight,
  Loader2,
} from "lucide-react"
import { useReviewerProjects } from "@/lib/hooks/use-reviewer"

export default function BrowseProjectsPage() {
  const { data: projects, isLoading } = useReviewerProjects()
  const [searchQuery, setSearchQuery] = useState("")

  // Group by project title to deduplicate (API returns one entry per student assignment)
  const groupedProjects = useMemo(() => {
    if (!projects) return []
    const map = new Map<string, typeof projects[0] & { totalPendingTasks: number }>()
    projects.forEach((p) => {
      const existing = map.get(p.title)
      if (existing) {
        existing.totalPendingTasks += p.pendingTasks
      } else {
        map.set(p.title, { ...p, totalPendingTasks: p.pendingTasks })
      }
    })
    return Array.from(map.values())
  }, [projects])

  const filteredProjects = groupedProjects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.difficulty.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  const stats = {
    totalProjects: groupedProjects.length,
    totalPending: groupedProjects.reduce((sum, p) => sum + p.totalPendingTasks, 0),
    activeStudents: new Set(projects?.map(p => p.student.email)).size,
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-primary tracking-tight">My Assignments</h1>
        <p className="mt-1 text-sm text-secondary-500">
          Manage your assigned projects and track student progress
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-secondary-600">Loading assignments...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Quick Stats */}
          <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-3">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-secondary-500">Assigned Projects</p>
                    <p className="text-xl sm:text-2xl font-bold text-primary">{stats.totalProjects}</p>
                  </div>
                  <div className="h-8 sm:h-10 w-8 sm:w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Briefcase className="h-4 sm:h-5 w-4 sm:w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-secondary-500">Pending Reviews</p>
                    <p className="text-xl sm:text-2xl font-bold text-amber-600">{stats.totalPending}</p>
                  </div>
                  <div className="h-8 sm:h-10 w-8 sm:w-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                    <FileCheck className="h-4 sm:h-5 w-4 sm:w-5 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-secondary-500">Active Students</p>
                    <p className="text-xl sm:text-2xl font-bold text-blue-600">{stats.activeStudents}</p>
                  </div>
                  <div className="h-8 sm:h-10 w-8 sm:w-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                    <User className="h-4 sm:h-5 w-4 sm:w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
                <input
                  type="text"
                  placeholder="Search by project, student, or difficulty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 w-full rounded-lg border border-secondary-200 bg-white pl-10 pr-4 text-sm focus:border-primary focus:outline-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Projects List */}
          <div className="space-y-3 sm:space-y-4">
            {filteredProjects.length === 0 ? (
              <Card>
                <CardContent className="p-8 sm:p-12 text-center">
                  <FolderKanban className="h-10 sm:h-12 w-10 sm:w-12 text-secondary-300 mx-auto mb-4" />
                  <p className="text-sm sm:text-base text-secondary-600">
                    {searchQuery ? "No assignments match your search" : "No assignments yet"}
                  </p>
                  <p className="text-xs sm:text-sm text-secondary-400 mt-1">
                    {searchQuery ? "Try adjusting your search" : "You'll see assigned projects here"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-md transition-all">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <FolderKanban className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="font-semibold text-base text-secondary-900">
                                {project.title}
                              </h3>
                              <Badge variant="outline" className="text-xs">
                                {project.difficulty}
                              </Badge>
                            </div>
                            <p className="text-sm text-secondary-600 line-clamp-2 mb-3">
                              {project.description}
                            </p>
                            <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-secondary-500">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 sm:h-4 w-3 sm:w-4" />
                                <span>{project.duration} weeks</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 sm:flex-col">
                        <Link href={`/reviewer/projects/${project.id}`} className="flex-1">
                          <Button size="sm" className="w-full gap-2 text-xs sm:text-sm">
                            View Tasks
                            <ChevronRight className="h-3 sm:h-4 w-3 sm:w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}
