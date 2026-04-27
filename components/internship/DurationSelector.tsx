"use client"

import * as React from "react"
import { Clock, CheckCircle2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { DurationOption } from "@/lib/types"

interface DurationSelectorProps {
  options: DurationOption[]
  selectedDuration?: DurationType
  onSelect: (duration: DurationType) => void
  className?: string
}

type DurationType = "4_weeks" | "8_weeks" | "12_weeks" | "custom"

export function DurationSelector({ options, selectedDuration, onSelect, className }: DurationSelectorProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-primary">Choose Your Internship Duration</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            className={cn(
              "relative p-6 rounded-xl border-2 transition-all duration-200 text-left",
              "hover:shadow-lg hover:border-primary/30",
              selectedDuration === option.value
                ? "border-primary bg-primary/5 shadow-md ring-2 ring-primary/20"
                : "border-secondary-200 bg-white hover:bg-secondary-50"
            )}
          >
            {option.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1 px-3 py-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 rounded-full border border-emerald-200 shadow-sm">
                  <Sparkles className="h-3 w-3" />
                  POPULAR
                </span>
              </div>
            )}

            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className={cn(
                  "h-5 w-5",
                  selectedDuration === option.value ? "text-primary" : "text-secondary-400"
                )} />
                <span className="text-2xl font-bold text-primary">{option.weeks}</span>
                <span className="text-sm text-secondary-500">weeks</span>
              </div>
              {selectedDuration === option.value && (
                <CheckCircle2 className="h-5 w-5 text-primary" />
              )}
            </div>

            <h4 className="font-semibold text-primary mb-2">{option.label}</h4>
            <p className="text-sm text-secondary-600 leading-relaxed">{option.description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
