"use client"

import * as React from "react"
import { Trophy, Lock, Unlock, Download, Share2, QrCode, CheckCircle2, Sparkles, Award } from "lucide-react"
import { cn } from "@/lib/utils"
import { InternshipPlan } from "@/lib/types"

interface CertificateUnlockSectionProps {
  plan: InternshipPlan
  onDownload?: () => void
  onShare?: () => void
  onViewQR?: () => void
  className?: string
}

export function CertificateUnlockSection({ plan, onDownload, onShare, onViewQR, className }: CertificateUnlockSectionProps) {
  const isUnlocked = plan.certificateUnlocked

  const completedWeeks = plan.projectBlocks
    .filter(block => block.status === "completed")
    .reduce((sum, block) => sum + block.duration, 0)

  const progressPercentage = (completedWeeks / plan.totalWeeks) * 100

  return (
    <div className={cn("space-y-4", className)}>
      {isUnlocked ? (
        /* Unlocked State */
        <div className="p-6 bg-gradient-to-br from-emerald-50 via-emerald-50/50 to-white rounded-2xl border-2 border-emerald-200 shadow-xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-emerald-100 border-2 border-emerald-300 shadow-lg">
              <Trophy className="h-10 w-10 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-5 w-5 text-emerald-600" />
                <h3 className="text-2xl font-bold text-emerald-900">Certificate Unlocked!</h3>
              </div>
              <p className="text-emerald-700">
                You've successfully completed your {plan.totalWeeks}-week internship
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-white rounded-xl border border-emerald-200 text-center">
              <Award className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-emerald-900">{plan.totalWeeks}</p>
              <p className="text-xs text-emerald-600">Weeks</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-emerald-200 text-center">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-emerald-900">{plan.projectBlocks.length}</p>
              <p className="text-xs text-emerald-600">Projects</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-emerald-200 text-center">
              <Trophy className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-emerald-900">100%</p>
              <p className="text-xs text-emerald-600">Complete</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={onDownload}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
            >
              <Download className="h-5 w-5" />
              Download Certificate (PDF)
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onShare}
                className="py-3 bg-white hover:bg-emerald-50 text-emerald-700 border-2 border-emerald-200 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Share2 className="h-5 w-5" />
                Share
              </button>
              <button
                onClick={onViewQR}
                className="py-3 bg-white hover:bg-emerald-50 text-emerald-700 border-2 border-emerald-200 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <QrCode className="h-5 w-5" />
                View QR Code
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Locked State */
        <div className="p-6 bg-gradient-to-br from-secondary-50 via-secondary-50/50 to-white rounded-2xl border-2 border-secondary-200 shadow-xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-secondary-100 border-2 border-secondary-300 shadow-lg">
              <Lock className="h-10 w-10 text-secondary-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-secondary-700 mb-1">Certificate Locked</h3>
              <p className="text-secondary-600">
                Complete your internship to unlock your certificate
              </p>
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-secondary-200 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-secondary-600">Progress</span>
              <span className="text-2xl font-bold text-primary">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="h-3 bg-secondary-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-sm text-secondary-600 mt-3 text-center">
              {plan.totalWeeks - completedWeeks} week{plan.totalWeeks - completedWeeks > 1 ? "s" : ""} remaining
            </p>
          </div>

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
            <div className="flex items-start gap-3">
              <Unlock className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-900 mb-1">Unlock Requirements</p>
                <ul className="text-xs text-amber-800 space-y-1">
                  <li>• Complete all {plan.totalWeeks} weeks of internship</li>
                  <li>• Finish all project blocks</li>
                  <li>• Get approval on all submissions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
