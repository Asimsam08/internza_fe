"use client"

import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

export type EnrollmentStep = 1 | 2 | 3

const STEP_META: { step: EnrollmentStep; label: string; short: string }[] = [
  { step: 1, label: "Internship duration", short: "Duration" },
  { step: 2, label: "Project selection", short: "Projects" },
  { step: 3, label: "Review and confirm", short: "Review" },
]

export function EnrollmentStepIndicator({
  currentStep,
  onStepClick,
  currentStepSatisfied = true,
}: {
  currentStep: EnrollmentStep
  onStepClick?: (step: EnrollmentStep) => void
  currentStepSatisfied?: boolean
}) {
  return (
    <nav
      aria-label="Enrollment progress"
      className="w-full rounded-2xl border border-secondary-200 bg-white px-4 py-3 shadow-sm"
    >
      <ol className="grid grid-cols-[auto_1fr_auto_1fr_auto] items-center gap-x-3">
        {STEP_META.map(({ step, label, short }, index) => {
          const isComplete = currentStep > step
          const isCurrent = currentStep === step
          const isFuture = currentStep < step
          const allowBack = isComplete && typeof onStepClick === "function"

          const isCurrentSatisfied = isCurrent && currentStepSatisfied

          const circleClass = cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
            "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            isComplete && "border-primary bg-primary text-white",
            isCurrentSatisfied && "border-primary bg-primary text-white",
            isCurrent && !currentStepSatisfied && "border-primary bg-white text-primary",
            isFuture && "border-secondary-200 bg-white text-secondary-400",
            allowBack && "cursor-pointer hover:bg-primary/5",
          )

          const labelClass = cn(
            "text-[11px] font-semibold uppercase tracking-wide",
            isComplete && "text-secondary-700",
            isCurrent && "text-secondary-900",
            isFuture && "text-secondary-400",
          )

          const connectorDone = currentStep > step

          return (
            <div key={step} className="contents">
              <li className="flex min-w-0 items-center gap-2">
                <button
                  type="button"
                  disabled={!allowBack}
                  onClick={() => allowBack && onStepClick?.(step)}
                  className={circleClass}
                  aria-current={isCurrent ? "step" : undefined}
                  aria-label={
                    allowBack
                      ? `Go back to ${label}`
                      : isCurrent
                        ? `Current step: ${label}`
                        : `${label} (complete earlier steps first)`
                  }
                >
                  {isComplete ? <Check className="h-4 w-4" strokeWidth={2.5} /> : step}
                </button>
                <span className={cn(labelClass, "truncate")}>
                  <span className="sm:hidden">{short}</span>
                  <span className="hidden sm:inline">{label}</span>
                </span>
              </li>

              {index < STEP_META.length - 1 && (
                <li aria-hidden className="flex items-center">
                  <div className="h-0.5 w-full rounded-full bg-secondary-100">
                    <div
                      className={cn("h-0.5 rounded-full transition-colors", connectorDone ? "bg-primary" : "bg-transparent")}
                      style={{ width: connectorDone ? "100%" : "0%" }}
                    />
                  </div>
                </li>
              )}
            </div>
          )
        })}
      </ol>
    </nav>
  )
}
