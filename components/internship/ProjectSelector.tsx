"use client"

import * as React from "react"
import { Clock, CheckCircle2, ArrowRight, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { DurationType, ProjectTemplate } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface ProjectSelectorProps {
  durationType: DurationType
  customWeeks?: number
  availableProjects: ProjectTemplate[]
  selectedProjects: ProjectTemplate[]
  onSelectProjects: (projects: ProjectTemplate[]) => void
  onConfirm: () => void
  className?: string
}

interface CombinationOption {
  id: string
  description: string
  requiredSlots: number[]
  example: string
}

export function ProjectSelector({
  durationType,
  customWeeks,
  availableProjects,
  selectedProjects,
  onSelectProjects,
  onConfirm,
  className,
}: ProjectSelectorProps) {
  const [selectedCombination, setSelectedCombination] = React.useState<string | null>(null)
  const totalWeeks = durationType === "custom" ? customWeeks || 4 : parseInt(durationType)

  // Get combination options based on duration
  const getCombinations = (): CombinationOption[] => {
    const combinations: CombinationOption[] = []

    if (totalWeeks === 4) {
      combinations.push({
        id: "4",
        description: "One 4-week project",
        requiredSlots: [4],
        example: "Select 1 project of 4 weeks"
      })
    } else if (totalWeeks === 8) {
      combinations.push({
        id: "8",
        description: "One 8-week project",
        requiredSlots: [8],
        example: "Select 1 project of 8 weeks"
      })
      combinations.push({
        id: "4+4",
        description: "Two 4-week projects",
        requiredSlots: [4, 4],
        example: "Select 2 projects of 4 weeks each"
      })
    } else if (totalWeeks === 12) {
      combinations.push({
        id: "12",
        description: "One 12-week project",
        requiredSlots: [12],
        example: "Select 1 project of 12 weeks"
      })
      combinations.push({
        id: "8+4",
        description: "One 8-week + One 4-week project",
        requiredSlots: [8, 4],
        example: "Select 1 project of 8 weeks + 1 of 4 weeks"
      })
      combinations.push({
        id: "4+4+4",
        description: "Three 4-week projects",
        requiredSlots: [4, 4, 4],
        example: "Select 3 projects of 4 weeks each"
      })
    }

    return combinations
  }

  const combinations = getCombinations()
  const activeCombination = combinations.find(c => c.id === selectedCombination)

  // Filter projects by duration based on selected combination
  const getEligibleProjects = (weekDuration: number): ProjectTemplate[] => {
    return availableProjects.filter(p => {
      const durationNum = parseInt(p.duration)
      return durationNum === weekDuration
    })
  }

  // Check if selection is valid
  const isSelectionValid = (): boolean => {
    if (!selectedCombination) return false
    const combo = combinations.find(c => c.id === selectedCombination)
    if (!combo) return false

    const selectedDurations = selectedProjects.map(p => parseInt(p.duration)).sort((a, b) => a - b)
    const requiredDurations = combo.requiredSlots.sort((a, b) => a - b)

    if (selectedDurations.length !== requiredDurations.length) return false

    return selectedDurations.every((d, i) => d === requiredDurations[i])
  }

  const toggleProject = (project: ProjectTemplate) => {
    const isSelected = selectedProjects.some(p => p.id === project.id)
    let newSelection: ProjectTemplate[]

    if (isSelected) {
      newSelection = selectedProjects.filter(p => p.id !== project.id)
    } else {
      newSelection = [...selectedProjects, project]
    }

    onSelectProjects(newSelection)
  }

  const selectedDuration = selectedProjects.reduce((sum, p) => sum + parseInt(p.duration), 0)

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-primary">
          Build Your {totalWeeks}-Week Plan
        </h3>
      </div>

      {/* Combination Options */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-secondary-700">Choose your project combination:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {combinations.map((combo) => (
            <button
              key={combo.id}
              onClick={() => {
                setSelectedCombination(combo.id)
                onSelectProjects([])
              }}
              className={cn(
                "p-4 rounded-xl border-2 text-left transition-all",
                selectedCombination === combo.id
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-secondary-200 bg-white hover:border-primary/30 hover:shadow-md"
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-primary">{combo.description}</span>
                </div>
                {selectedCombination === combo.id && (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                )}
              </div>
              <p className="text-xs text-secondary-600">{combo.example}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Project Selection */}
      {activeCombination && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-secondary-700">
              Select projects ({activeCombination.requiredSlots.join(" + ")} weeks total):
            </p>
            <Badge variant={isSelectionValid() ? "success" : "secondary"}>
              {selectedDuration} / {totalWeeks} weeks selected
            </Badge>
          </div>

          <div className="space-y-3">
            {activeCombination.requiredSlots.map((weekDuration, slotIndex) => (
              <div key={slotIndex} className="space-y-2">
                <p className="text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                  Slot {slotIndex + 1}: {weekDuration}-week project
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getEligibleProjects(weekDuration).map((project) => {
                    const isSelected = selectedProjects.some(p => p.id === project.id)

                    return (
                      <Card
                        key={project.id}
                        className={cn(
                          "cursor-pointer transition-all hover:shadow-md",
                          isSelected
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                            : "border-secondary-200 bg-white hover:border-primary/30"
                        )}
                        onClick={() => toggleProject(project)}
                      >
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-secondary-100 flex-shrink-0">
                              <Image
                                src={project.image}
                                alt={project.title}
                                fill
                                className="object-cover"
                                sizes="80px"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h4 className="font-semibold text-secondary-900 line-clamp-1 text-sm">
                                  {project.title}
                                </h4>
                                {isSelected && (
                                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-xs text-secondary-600 line-clamp-2 mb-2">
                                {project.shortDescription}
                              </p>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {project.duration}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {project.difficulty}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
                {getEligibleProjects(weekDuration).length === 0 && (
                  <div className="p-4 text-center border-2 border-dashed border-secondary-200 rounded-xl">
                    <p className="text-sm text-secondary-500">No {weekDuration}-week projects available</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirm Button */}
      {activeCombination && isSelectionValid() && (
        <Button
          size="lg"
          className="w-full gap-2"
          onClick={onConfirm}
        >
          Confirm Plan Selection
          <ArrowRight className="h-4 w-4" />
        </Button>
      )}

      {!activeCombination && (
        <div className="p-6 text-center border-2 border-dashed border-secondary-200 rounded-xl">
          <Clock className="h-8 w-8 text-secondary-300 mx-auto mb-2" />
          <p className="text-sm text-secondary-600">Select a combination option above to continue</p>
        </div>
      )}
    </div>
  )
}
