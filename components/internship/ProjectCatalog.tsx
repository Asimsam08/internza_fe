"use client"

import * as React from "react"
import { Clock, Award, BookOpen, Eye, Plus, ArrowRight, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { ProjectCatalogItem } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ProjectCatalogProps {
  projects: ProjectCatalogItem[]
  onViewDetails?: (project: ProjectCatalogItem) => void
  onAddToPlan?: (project: ProjectCatalogItem) => void
  onPreview?: (project: ProjectCatalogItem) => void
  className?: string
}

export function ProjectCatalog({
  projects,
  onViewDetails,
  onAddToPlan,
  onPreview,
  className,
}: ProjectCatalogProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "Intermediate":
        return "bg-amber-100 text-amber-700 border-amber-200"
      case "Advanced":
        return "bg-rose-100 text-rose-700 border-rose-200"
      default:
        return "bg-secondary-100 text-secondary-700 border-secondary-200"
    }
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-primary">Project Catalog</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-2xl border border-secondary-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-secondary-100">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-secondary-600">{project.duration} weeks</span>
                </div>
                <Badge className={cn("text-xs", getDifficultyColor(project.difficulty))}>
                  {project.difficulty}
                </Badge>
              </div>

              <h4 className="text-xl font-bold text-primary mb-2">{project.title}</h4>
              <p className="text-sm text-secondary-600 leading-relaxed">{project.shortOutcome}</p>
            </div>

            {/* Skills */}
            <div className="px-6 py-4 bg-secondary-50/50">
              <div className="flex flex-wrap gap-2">
                {project.skills.slice(0, 4).map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-medium text-secondary-600 bg-white px-2 py-1 rounded-full border border-secondary-200"
                  >
                    {skill}
                  </span>
                ))}
                {project.skills.length > 4 && (
                  <span className="text-xs font-medium text-secondary-400">
                    +{project.skills.length - 4} more
                  </span>
                )}
              </div>
            </div>

            {/* Deliverables Preview */}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Award className="h-4 w-4 text-secondary-400" />
                <span className="text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                  You'll Build
                </span>
              </div>
              <ul className="space-y-2">
                {project.deliverablesPreview.slice(0, 3).map((deliverable, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-secondary-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    {deliverable}
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="p-6 pt-0 space-y-2">
              {project.isAvailableForPlan && onAddToPlan && (
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => onAddToPlan(project)}
                >
                  <Plus className="h-4 w-4" />
                  Add to Plan
                </Button>
              )}
              <div className="grid grid-cols-2 gap-2">
                {onViewDetails && (
                  <Button
                    variant="ghost"
                    className="w-full gap-2"
                    onClick={() => onViewDetails(project)}
                  >
                    <Eye className="h-4 w-4" />
                    Details
                  </Button>
                )}
                {onPreview && (
                  <Button
                    variant="ghost"
                    className="w-full gap-2"
                    onClick={() => onPreview(project)}
                  >
                    <Zap className="h-4 w-4" />
                    Preview
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="p-12 text-center border-2 border-dashed border-secondary-200 rounded-2xl">
          <BookOpen className="h-16 w-16 text-secondary-300 mx-auto mb-4" />
          <p className="text-lg font-semibold text-secondary-600 mb-2">No projects available</p>
          <p className="text-sm text-secondary-400">
            Check back later or contact support for more project options.
          </p>
        </div>
      )}
    </div>
  )
}
