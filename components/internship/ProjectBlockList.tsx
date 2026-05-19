"use client"

import * as React from "react"
import { Lock, Play, CheckCircle2, Clock, Calendar, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { ProjectBlock, MilestoneStatus } from "@/lib/types"

interface ProjectBlockListProps {
  blocks: ProjectBlock[]
  onBlockClick?: (block: ProjectBlock) => void
  className?: string
}

export function ProjectBlockList({ blocks, onBlockClick, className }: ProjectBlockListProps) {
  const getStatusConfig = (status: MilestoneStatus) => {
    switch (status) {
      case "completed":
        return {
          icon: <CheckCircle2 className="h-5 w-5" />,
          color: "text-emerald-600",
          bgColor: "bg-emerald-50",
          borderColor: "border-emerald-200",
          badge: "Completed"
        }
      case "in_progress":
        return {
          icon: <Play className="h-5 w-5" />,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          badge: "In Progress"
        }
      case "available":
        return {
          icon: <Clock className="h-5 w-5" />,
          color: "text-amber-600",
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
          badge: "Available"
        }
      case "locked":
        return {
          icon: <Lock className="h-5 w-5" />,
          color: "text-secondary-400",
          bgColor: "bg-secondary-50",
          borderColor: "border-secondary-200",
          badge: "Locked"
        }
      default:
        return {
          icon: <Clock className="h-5 w-5" />,
          color: "text-secondary-600",
          bgColor: "bg-secondary-50",
          borderColor: "border-secondary-200",
          badge: "Unknown"
        }
    }
  }

  // Calculate week ranges
  let currentWeek = 1
  const blocksWithWeeks = blocks.map(block => {
    const startWeek = currentWeek
    const endWeek = currentWeek + block.duration - 1
    currentWeek = endWeek + 1
    return { ...block, startWeek, endWeek }
  })

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-primary">Project Timeline</h3>
      </div>

      <div className="space-y-3">
        {blocksWithWeeks.map((block) => {
          const config = getStatusConfig(block.status)
          const isClickable = block.status === "available" || block.status === "in_progress"

          return (
            <button
              key={block.id}
              onClick={() => isClickable && onBlockClick?.(block)}
              disabled={!isClickable}
              className={cn(
                "w-full text-left p-5 rounded-xl border-2 transition-all duration-200",
                "hover:shadow-md",
                config.bgColor,
                config.borderColor,
                isClickable ? "cursor-pointer hover:opacity-90" : "cursor-not-allowed opacity-75"
              )}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-xl bg-white shadow-sm flex-shrink-0",
                  config.color
                )}>
                  {config.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={cn(
                      "text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                      config.color,
                      config.bgColor
                    )}>
                      {config.badge}
                    </span>
                    <span className="text-xs text-secondary-500">
                      Week {block.startWeek} - {block.endWeek}
                    </span>
                    <span className="text-xs text-secondary-400">•</span>
                    <span className="text-xs text-secondary-500">{block.duration} weeks</span>
                  </div>

                  <h4 className="font-bold text-primary text-lg mb-1">{block.projectTitle}</h4>

                  {block.enrolledAt && (
                    <p className="text-sm text-secondary-600">
                      Started on {new Date(block.enrolledAt).toLocaleDateString()}
                    </p>
                  )}

                  {block.completedAt && (
                    <p className="text-sm text-emerald-600 font-medium">
                      Completed on {new Date(block.completedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {/* Arrow for clickable blocks */}
                {isClickable && (
                  <div className="flex items-center justify-center flex-shrink-0">
                    <ChevronRight className={cn("h-6 w-6", config.color)} />
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
