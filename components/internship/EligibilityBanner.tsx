"use client"

import * as React from "react"
import { Trophy, Lock, AlertCircle, CheckCircle2, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { EligibilityCheck } from "@/lib/types"

interface EligibilityBannerProps {
  eligibility: EligibilityCheck
  onViewCertificate?: () => void
  onContinue?: () => void
  className?: string
}

export function EligibilityBanner({
  eligibility,
  onViewCertificate,
  onContinue,
  className,
}: EligibilityBannerProps) {
  if (eligibility.isEligible) {
    return (
      <div className={cn(
        "p-6 bg-gradient-to-r from-emerald-50 via-emerald-50/50 to-white rounded-2xl border-2 border-emerald-200 shadow-lg",
        className
      )}>
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 border-2 border-emerald-300">
            <Trophy className="h-8 w-8 text-emerald-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-emerald-900 mb-1">Certificate Unlocked!</h3>
            <p className="text-emerald-700">You've met all requirements. View and download your certificate.</p>
          </div>
          {onViewCertificate && (
            <button
              onClick={onViewCertificate}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors flex items-center gap-2 shadow-lg shadow-emerald-200"
            >
              View Certificate
              <Trophy className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      "p-6 bg-gradient-to-r from-amber-50 via-amber-50/50 to-white rounded-2xl border-2 border-amber-200 shadow-lg",
      className
    )}>
      <div className="flex items-start gap-4">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-100 border-2 border-amber-300 flex-shrink-0">
          <Lock className="h-8 w-8 text-amber-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <h3 className="text-xl font-bold text-amber-900">Certificate Locked</h3>
          </div>
          <p className="text-amber-700 mb-3">{eligibility.reason}</p>

          {eligibility.missingRequirements && eligibility.missingRequirements.length > 0 && (
            <div className="p-4 bg-white rounded-xl border border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-semibold text-amber-900">Missing Requirements:</span>
              </div>
              <ul className="space-y-1">
                {eligibility.missingRequirements.map((req, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-amber-800">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {onContinue && (
          <button
            onClick={onContinue}
            className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold transition-colors flex items-center gap-2 shadow-lg shadow-amber-200 flex-shrink-0"
          >
            Continue
            <CheckCircle2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
