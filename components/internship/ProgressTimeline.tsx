"use client"

import * as React from "react"
import { CheckCircle2, Circle, Clock, Trophy, Target } from "lucide-react"
import { cn } from "@/lib/utils"
import { DurationProgress } from "@/lib/types"

interface ProgressTimelineProps {
  progress: DurationProgress
  className?: string
}

export function ProgressTimeline({ progress, className }: ProgressTimelineProps) {
  const milestones = [
    { label: "Start", completed: true },
    { label: "Week 4", completed: progress.completedWeeks >= 4 },
    { label: "Week 8", completed: progress.completedWeeks >= 8 },
    { label: "Week 12", completed: progress.completedWeeks >= 12 },
    { label: "Certificate", completed: progress.canUnlockCertificate },
  ]

  const getMilestoneIcon = (milestone: { label: string; completed: boolean }) => {
    if (milestone.label === "Certificate") {
      return milestone.completed ? (
        <Trophy className="h-5 w-5 text-emerald-600" />
      ) : (
        <Trophy className="h-5 w-5 text-secondary-300" />
      )
    }
    if (milestone.completed) {
      return <CheckCircle2 className="h-5 w-5 text-emerald-600" />
    }
    return <Circle className="h-5 w-5 text-secondary-300" />
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Overall Progress */}
      <div className="p-6 bg-gradient-to-br from-primary/5 via-primary/[0.02] to-accent/5 rounded-2xl border border-primary/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Target className="h-6 w-6 text-primary" />
            <div>
              <h3 className="text-lg font-bold text-primary">Overall Progress</h3>
              <p className="text-sm text-secondary-600">
                {progress.completedWeeks} of {progress.totalWeeks} weeks completed
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">{progress.percentage}%</div>
          </div>
        </div>

        <div className="h-3 bg-secondary-100 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              progress.canUnlockCertificate ? "bg-emerald-500" : "bg-primary"
            )}
            style={{ width: `${progress.percentage}%` }}
          />
        </div>

        {progress.currentBlock && (
          <div className="mt-4 p-4 bg-white rounded-xl border border-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Currently Working On</span>
            </div>
            <p className="font-medium text-primary">{progress.currentBlock.projectTitle}</p>
            <p className="text-sm text-secondary-600 mt-1">
              {progress.currentBlock.duration} weeks • Week {progress.completedWeeks + 1}
            </p>
          </div>
        )}
      </div>

      {/* Milestone Timeline */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-secondary-600 uppercase tracking-wider">Milestones</h4>
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-secondary-200" />

          {/* Milestones */}
          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <div key={milestone.label} className="relative flex items-center gap-4">
                {/* Icon */}
                <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-white border-2 border-secondary-200 shadow-sm">
                  {getMilestoneIcon(milestone)}
                </div>

                {/* Label */}
                <div className={cn(
                  "font-semibold",
                  milestone.completed ? "text-primary" : "text-secondary-400"
                )}>
                  {milestone.label}
                </div>

                {/* Checkmark for completed */}
                {milestone.completed && (
                  <div className="ml-auto">
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                      Done
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Next Steps */}
      {progress.nextBlock && (
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-semibold text-amber-700">Up Next</span>
          </div>
          <p className="font-medium text-amber-900">{progress.nextBlock.projectTitle}</p>
          <p className="text-sm text-amber-700 mt-1">
            {progress.nextBlock.duration} weeks • Starts after current project
          </p>
        </div>
      )}
    </div>
  )
}
