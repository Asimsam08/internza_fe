"use client"

import * as React from "react"
import { Briefcase, Flag, CheckCircle2, ArrowRight, ChevronRight, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { DurationProgress, ProjectBlock } from "@/lib/types"

interface CurrentWorkWidgetProps {
  progress: DurationProgress | null
  activePlan: string | null
  onGoToMilestones: () => void
  className?: string
}

export function CurrentWorkWidget({
  progress,
  activePlan,
  onGoToMilestones,
  className,
}: CurrentWorkWidgetProps) {
  if (!progress || !activePlan) {
    return (
      <Card className={cn("border-secondary-200 bg-gradient-to-br from-primary/5 to-accent/5", className)}>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Briefcase className="h-4 w-4" />
              <span>Start Your Internship</span>
            </div>
            <p className="text-xs text-secondary-600">
              Select a duration and build your personalized internship plan.
            </p>
            <Button
              size="sm"
              className="w-full"
              onClick={() => window.location.href = "/internship"}
            >
              Get Started
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const currentBlock = progress.currentBlock
  const nextBlock = progress.nextBlock

  return (
    <Card className={cn("border-secondary-200 bg-gradient-to-br from-primary/5 to-accent/5", className)}>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" />
              <span>Current Work</span>
            </div>
            {progress.canUnlockCertificate && (
              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="h-3 w-3" />
                Complete
              </div>
            )}
          </div>

          {/* Plan Info */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-secondary-500 uppercase tracking-wider">
              {progress.totalWeeks}-Week Plan
            </div>
            <div className="text-sm font-semibold text-secondary-900">
              {currentBlock?.projectTitle || "No active project"}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-secondary-600">Progress</span>
              <span className="font-semibold text-primary">{progress.percentage}%</span>
            </div>
            <Progress value={progress.percentage} variant="brand" className="h-2" />
          </div>

          {/* Current Block */}
          {currentBlock && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-medium text-secondary-500 uppercase tracking-wider">
                <Flag className="h-3 w-3" />
                Current Block
              </div>
              <div className="rounded-lg border border-primary/20 bg-white p-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-secondary-900 line-clamp-1">
                      {currentBlock.projectTitle}
                    </div>
                    <div className="text-[10px] text-secondary-500 mt-0.5">
                      {currentBlock.duration} weeks • Block {currentBlock.order}
                    </div>
                  </div>
                  <div className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold",
                    currentBlock.status === "in_progress" ? "bg-primary text-white" :
                    currentBlock.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                    "bg-secondary-100 text-secondary-500"
                  )}>
                    {currentBlock.status === "in_progress" ? "→" :
                     currentBlock.status === "completed" ? "✓" :
                     currentBlock.order}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Next Block */}
          {nextBlock && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-medium text-secondary-500 uppercase tracking-wider">
                <ChevronRight className="h-3 w-3" />
                Next Up
              </div>
              <div className="rounded-lg border border-secondary-200 bg-secondary-50 p-2.5 opacity-75">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-secondary-700 line-clamp-1">
                      {nextBlock.projectTitle}
                    </div>
                    <div className="text-[10px] text-secondary-500 mt-0.5">
                      {nextBlock.duration} weeks • Block {nextBlock.order}
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary-200 text-secondary-500 text-[10px] font-bold">
                    {nextBlock.order}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CTA */}
          <Button
            size="sm"
            className="w-full"
            onClick={onGoToMilestones}
          >
            {progress.canUnlockCertificate ? "View Certificate" : "Continue Work"}
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
