"use client"

import * as React from "react"
import { Trophy, Lock, Sparkles, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { DurationProgress } from "@/lib/types"

interface CompletionStatusProps {
  progress: DurationProgress
  onViewCertificate?: () => void
  onContinue?: () => void
  className?: string
}

export function CompletionStatus({ progress, onViewCertificate, onContinue, className }: CompletionStatusProps) {
  const isComplete = progress.canUnlockCertificate
  const isAlmostComplete = progress.percentage >= 75 && !isComplete

  return (
    <div className={cn("space-y-4", className)}>
      {isComplete ? (
        /* Completed State */
        <div className="p-6 bg-gradient-to-br from-emerald-50 via-emerald-50/50 to-white rounded-2xl border-2 border-emerald-200 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 border-2 border-emerald-300 shadow-sm">
              <Trophy className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-emerald-900 mb-1">Congratulations! 🎉</h3>
              <p className="text-emerald-700">You've completed your internship!</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-white rounded-xl border border-emerald-200">
              <p className="text-sm text-emerald-600 mb-1">Total Duration</p>
              <p className="text-2xl font-bold text-emerald-900">{progress.totalWeeks} weeks</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-emerald-200">
              <p className="text-sm text-emerald-600 mb-1">Completion</p>
              <p className="text-2xl font-bold text-emerald-900">100%</p>
            </div>
          </div>

          <button
            onClick={onViewCertificate}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
          >
            <Sparkles className="h-5 w-5" />
            View Your Certificate
          </button>
        </div>
      ) : isAlmostComplete ? (
        /* Almost Complete State */
        <div className="p-6 bg-gradient-to-br from-amber-50 via-amber-50/50 to-white rounded-2xl border-2 border-amber-200 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-100 border-2 border-amber-300 shadow-sm">
              <Sparkles className="h-8 w-8 text-amber-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-amber-900 mb-1">Almost There! 🚀</h3>
              <p className="text-amber-700">
                {progress.totalWeeks - progress.completedWeeks} week{progress.totalWeeks - progress.completedWeeks > 1 ? "s" : ""} left to complete
              </p>
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-amber-200 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-amber-600">Progress</span>
              <span className="text-2xl font-bold text-amber-900">{progress.percentage}%</span>
            </div>
            <div className="h-3 bg-amber-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>

          <button
            onClick={onContinue}
            className="w-full py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-200"
          >
            <Clock className="h-5 w-5" />
            Continue Your Journey
          </button>
        </div>
      ) : (
        /* In Progress State */
        <div className="p-6 bg-gradient-to-br from-primary/5 via-primary/[0.02] to-accent/5 rounded-2xl border-2 border-primary/10 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border-2 border-primary/20 shadow-sm">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-primary mb-1">In Progress</h3>
              <p className="text-secondary-600">
                {progress.completedWeeks} of {progress.totalWeeks} weeks completed
              </p>
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-primary/10 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-secondary-600">Progress</span>
              <span className="text-2xl font-bold text-primary">{progress.percentage}%</span>
            </div>
            <div className="h-3 bg-secondary-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-white rounded-xl border border-primary/10">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <p className="text-sm text-secondary-600">Completed</p>
              </div>
              <p className="text-xl font-bold text-primary">{progress.completedWeeks} weeks</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-primary/10">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <p className="text-sm text-secondary-600">Remaining</p>
              </div>
              <p className="text-xl font-bold text-primary">{progress.totalWeeks - progress.completedWeeks} weeks</p>
            </div>
          </div>

          <button
            onClick={onContinue}
            className="w-full py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          >
            Continue Working
          </button>
        </div>
      )}

      {/* Certificate Unlock Info */}
      {!isComplete && (
        <div className="p-4 bg-secondary-50 rounded-xl border border-secondary-200">
          <div className="flex items-start gap-3">
            <Lock className="h-5 w-5 text-secondary-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-secondary-700 mb-1">Certificate Unlocks When Complete</p>
              <p className="text-xs text-secondary-600">
                Complete all {progress.totalWeeks} weeks of your internship to unlock your certificate.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
