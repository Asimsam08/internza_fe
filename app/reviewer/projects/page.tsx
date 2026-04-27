"use client"

import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import {
  Search,
  Filter,
  Clock,
  User,
  FileCheck,
  Briefcase,
  TrendingUp,
  Star,
  ChevronRight,
  Bookmark
} from "lucide-react"
import { cn } from "@/lib/utils"
import { mockProjectTemplates } from "@/lib/mockData"

export default function BrowseProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [selectedDuration, setSelectedDuration] = useState<string>("all")

  const difficulties = ["all", "Beginner", "Intermediate", "Advanced"]
  const durations = ["all", "4 weeks", "8 weeks", "12 weeks", "16 weeks"]

  const filteredProjects = mockProjectTemplates.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesDifficulty =
      selectedDifficulty === "all" || project.difficulty === selectedDifficulty

    const matchesDuration =
      selectedDuration === "all" || project.duration === selectedDuration

    return matchesSearch && matchesDifficulty && matchesDuration
  })

  const stats = {
    totalProjects: mockProjectTemplates.length,
    activeStudents: 156,
    pendingReviews: 42,
    avgReviewTime: "45m",
  }

  return (
    <div className="space-y-6">
      {/* Page Title & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">Browse Projects</h1>
          <p className="mt-1 text-sm text-secondary-500">
            Explore available projects and review guidelines
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2 self-start sm:self-auto">
          <Bookmark className="h-4 w-4" />
          My Bookmarks
        </Button>
      </div>

      {/* Platform Stats */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-secondary-500">Total Projects</p>
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
                <p className="text-xs sm:text-sm text-secondary-500">Active Students</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">{stats.activeStudents}</p>
              </div>
              <div className="h-8 sm:h-10 w-8 sm:w-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                <User className="h-4 sm:h-5 w-4 sm:w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-secondary-500">Pending Reviews</p>
                <p className="text-xl sm:text-2xl font-bold text-amber-600">{stats.pendingReviews}</p>
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
                <p className="text-xs sm:text-sm text-secondary-500">Avg Review Time</p>
                <p className="text-xl sm:text-2xl font-bold text-emerald-600">{stats.avgReviewTime}</p>
              </div>
              <div className="h-8 sm:h-10 w-8 sm:w-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                <Clock className="h-4 sm:h-5 w-4 sm:w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 w-full sm:w-64 rounded-lg border border-secondary-200 bg-white pl-10 pr-4 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="h-9 rounded-lg border border-secondary-200 bg-white px-3 text-sm focus:border-primary focus:outline-none"
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>
                    {diff === "all" ? "All Difficulties" : diff}
                  </option>
                ))}
              </select>
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="h-9 rounded-lg border border-secondary-200 bg-white px-3 text-sm focus:border-primary focus:outline-none"
              >
                {durations.map(duration => (
                  <option key={duration} value={duration}>
                    {duration === "all" ? "All Durations" : duration}
                  </option>
                ))}
              </select>
            </div>
            <Button variant="outline" size="sm" className="gap-2 text-xs sm:text-sm">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="p-8 sm:p-12 text-center">
              <Briefcase className="h-10 sm:h-12 w-10 sm:w-12 text-secondary-300 mx-auto mb-4" />
              <p className="text-sm sm:text-base text-secondary-600">No projects match your criteria</p>
              <p className="text-xs sm:text-sm text-secondary-400 mt-1">Try adjusting your filters</p>
            </CardContent>
          </Card>
        ) : (
          filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-all flex flex-col">
              <div className="relative h-40 sm:h-48 overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-3 right-3">
                  <Badge className="bg-white/90 text-secondary-900 border-white text-xs">
                    {project.duration}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4 sm:p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm sm:text-base text-secondary-900 line-clamp-1 mb-1">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-secondary-600 line-clamp-2">
                      {project.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                  <Badge variant="secondary" className="text-xs">
                    {project.difficulty}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {project.category}
                  </Badge>
                </div>

                <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-secondary-600">
                    <User className="h-3 sm:h-4 w-3 sm:w-4" />
                    <span>{Math.floor(Math.random() * 20) + 5} active students</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-secondary-600">
                    <FileCheck className="h-3 sm:h-4 w-3 sm:w-4" />
                    <span>{Math.floor(Math.random() * 10) + 2} pending reviews</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-secondary-600">
                    <Clock className="h-3 sm:h-4 w-3 sm:w-4" />
                    <span>~{Math.floor(Math.random() * 30) + 30}m avg review</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-3 sm:mb-4">
                  {project.skills.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {project.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{project.skills.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="mt-auto space-y-2">
                  <Button size="sm" className="w-full gap-2 text-xs sm:text-sm">
                    View Details
                    <ChevronRight className="h-3 sm:h-4 w-3 sm:w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="w-full gap-2 text-xs sm:text-sm">
                    <Bookmark className="h-3 sm:h-4 w-3 sm:w-4" />
                    Bookmark
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
