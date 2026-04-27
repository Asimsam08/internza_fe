"use client"

import * as React from "react"
import { Calendar, Clock, Trophy, Lock, Play, CheckCircle2, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { InternshipPlan } from "@/lib/types"

interface InternshipPlanCardProps {
  plan: InternshipPlan
  onEnroll?: () => void
  onViewDetails?: () => void
  className?: string
}

export function InternshipPlanCard({ plan, onEnroll, onViewDetails, className }: InternshipPlanCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-emerald-600 bg-emerald-50 border-emerald-200"
      case "in_progress":
        return "text-blue-600 bg-blue-50 border-blue-200"
      case "available":
        return "text-amber-600 bg-amber-50 border-amber-200"
      case "locked":
        return "text-secondary-400 bg-secondary-50 border-secondary-200"
      default:
        return "text-secondary-600 bg-secondary-50 border-secondary-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />
      case "in_progress":
        return <Play className="h-4 w-4" />
      case "available":
        return <Clock className="h-4 w-4" />
      case "locked":
        return <Lock className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const completedWeeks = plan.projectBlocks
    .filter(block => block.status === "completed")
    .reduce((sum, block) => sum + block.duration, 0)

  const progressPercentage = (completedWeeks / plan.totalWeeks) * 100

  return (
    <div className={cn(
      "bg-white rounded-2xl border-2 border-secondary-200 shadow-sm hover:shadow-md transition-shadow duration-200",
      className
    )}>
      {/* Header */}
      <div className="p-6 border-b border-secondary-100">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-secondary-600 uppercase tracking-wider">
                {plan.durationType.replace("_", " ")}
              </span>
            </div>
            <h3 className="text-xl font-bold text-primary mb-1">{plan.totalWeeks} Week Internship</h3>
            <p className="text-sm text-secondary-600">
              {plan.projectBlocks.length} project{plan.projectBlocks.length > 1 ? "s" : ""} • {plan.totalWeeks} weeks total
            </p>
          </div>
          {plan.certificateUnlocked && (
            <div className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-200">
              <Trophy className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-bold text-emerald-700">Certificate Ready</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-secondary-600">Progress</span>
            <span className="font-semibold text-primary">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="h-2 bg-secondary-100 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                plan.certificateUnlocked ? "bg-emerald-500" : "bg-primary"
              )}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Project Blocks */}
      <div className="p-6 space-y-3">
        {plan.projectBlocks.map((block, index) => (
          <div
            key={block.id}
            className={cn(
              "flex items-center gap-4 p-4 rounded-xl border transition-all",
              getStatusColor(block.status)
            )}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm">
              {getStatusIcon(block.status)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-secondary-500">
                  Week {plan.projectBlocks.slice(0, index + 1).reduce((sum, b) => sum + b.duration, 0) - block.duration + 1}
                  {"-"}
                  {plan.projectBlocks.slice(0, index + 1).reduce((sum, b) => sum + b.duration, 0)}
                </span>
                <span className="text-xs text-secondary-400">•</span>
                <span className="text-xs font-semibold text-secondary-500">{block.duration} weeks</span>
              </div>
              <h4 className="font-semibold text-primary truncate">{block.projectTitle}</h4>
            </div>
            {block.status === "available" && (
              <button
                onClick={onEnroll}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                Start
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-secondary-100 bg-secondary-50/50 rounded-b-2xl">
        <button
          onClick={onViewDetails}
          className="w-full py-3 text-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          View Full Details →
        </button>
      </div>
    </div>
  )
}
