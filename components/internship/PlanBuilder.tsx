"use client"

import * as React from "react"
import { Clock, CheckCircle2, Sparkles, ArrowRight, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { PlanOption, DurationType } from "@/lib/types"
import { getPlanOptions } from "@/lib/durationRules"

interface PlanBuilderProps {
  durationType: DurationType
  customWeeks?: number
  availableProjects: Array<{ id: string; title: string; duration: number }>
  selectedPlan?: PlanOption
  onSelectPlan: (plan: PlanOption) => void
  onEnroll: (plan: PlanOption) => void
  className?: string
}

export function PlanBuilder({
  durationType,
  customWeeks,
  availableProjects,
  selectedPlan,
  onSelectPlan,
  onEnroll,
  className,
}: PlanBuilderProps) {
  const [planOptions, setPlanOptions] = React.useState<PlanOption[]>([])

  React.useEffect(() => {
    const options = getPlanOptions(durationType, availableProjects, customWeeks)
    setPlanOptions(options)
  }, [durationType, customWeeks, availableProjects])

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-primary">
          {durationType === "custom" ? `Custom ${customWeeks}-Week Plans` : `${durationType.replace("_", " ")} Plans`}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {planOptions.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              "relative p-6 rounded-2xl border-2 transition-all duration-200",
              selectedPlan?.id === plan.id
                ? "border-primary bg-primary/5 shadow-md ring-2 ring-primary/20"
                : "border-secondary-200 bg-white hover:shadow-lg hover:border-primary/30 cursor-pointer"
            )}
            onClick={() => onSelectPlan(plan)}
          >
            {plan.recommended && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1 px-3 py-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 rounded-full border border-emerald-200 shadow-sm">
                  <Sparkles className="h-3 w-3" />
                  RECOMMENDED
                </span>
              </div>
            )}

            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold text-primary">{plan.totalWeeks}</span>
                <span className="text-sm text-secondary-500">weeks total</span>
              </div>
              {selectedPlan?.id === plan.id && (
                <CheckCircle2 className="h-5 w-5 text-primary" />
              )}
            </div>

            <h4 className="font-semibold text-primary mb-2">{plan.description}</h4>

            <div className="space-y-2 mb-4">
              {plan.blocks.map((block, index) => (
                <div key={block.id} className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    {index + 1}
                  </div>
                  <span className="text-secondary-600">
                    {block.duration}-week: {block.projectTitle}
                  </span>
                </div>
              ))}
            </div>

            {selectedPlan?.id === plan.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onEnroll(plan)
                }}
                className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                Start This Plan
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {planOptions.length === 0 && (
        <div className="p-8 text-center border-2 border-dashed border-secondary-200 rounded-2xl">
          <Clock className="h-12 w-12 text-secondary-300 mx-auto mb-4" />
          <p className="text-secondary-600">No valid plan options available for this duration.</p>
          <p className="text-sm text-secondary-400 mt-2">
            Try a different duration or contact support for custom arrangements.
          </p>
        </div>
      )}
    </div>
  )
}
