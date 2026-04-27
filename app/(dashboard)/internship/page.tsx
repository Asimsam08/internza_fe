"use client"

import * as React from "react"
import { useState } from "react"
import { Calendar, Clock, Trophy, ArrowRight, ChevronLeft, Info } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { DurationSelector } from "@/components/internship/DurationSelector"
import { ProjectSelector } from "@/components/internship/ProjectSelector"
import { ProjectBlockList } from "@/components/internship/ProjectBlockList"
import { ProgressTimeline } from "@/components/internship/ProgressTimeline"
import { CompletionStatus } from "@/components/internship/CompletionStatus"
import { CertificateUnlockSection } from "@/components/internship/CertificateUnlockSection"
import { EligibilityBanner } from "@/components/internship/EligibilityBanner"
import {
  mockDurationOptions,
  mockInternshipPlans,
  mockDurationProgress,
  mockProjectTemplates,
} from "@/lib/mockData"
import { checkCertificateEligibility } from "@/lib/durationRules"
import type { DurationType, InternshipPlan, PlanOption, ProjectTemplate } from "@/lib/types"

type View = "selection" | "plans" | "details" | "custom"

export default function InternshipPage() {
  const [view, setView] = useState<View>("selection")
  const [selectedDuration, setSelectedDuration] = useState<DurationType | undefined>()
  const [selectedPlan, setSelectedPlan] = useState<InternshipPlan | undefined>()
  const [selectedPlanOption, setSelectedPlanOption] = useState<PlanOption | undefined>()
  const [selectedProjects, setSelectedProjects] = useState<ProjectTemplate[]>([])
  const [customWeeks, setCustomWeeks] = useState<number>(0)
  const [showCustomInput, setShowCustomInput] = useState(false)

  const handleDurationSelect = (duration: DurationType) => {
    setSelectedDuration(duration)
    if (duration === "custom") {
      setView("custom")
    } else {
      setView("plans")
    }
  }

  const handleCustomWeeksSubmit = () => {
    if (customWeeks > 0 && customWeeks <= 24) {
      setView("plans")
    }
  }

  const handlePlanSelect = (planOption: PlanOption) => {
    setSelectedPlanOption(planOption)
    // Convert plan option to internship plan (in real app, this would create a new plan)
    const newPlan: InternshipPlan = {
      id: `plan-${Date.now()}`,
      studentId: "user-1", // Would come from auth
      durationType: selectedDuration || "4_weeks",
      totalWeeks: planOption.totalWeeks,
      projectBlocks: planOption.blocks.map((block, index) => ({
        ...block,
        status: index === 0 ? "available" : "locked",
      })),
      startedAt: undefined,
      completedAt: undefined,
      certificateUnlocked: false,
    }
    setSelectedPlan(newPlan)
    setView("details")
  }

  const handleProjectSelectionConfirm = () => {
    // Convert selected projects to internship plan
    const newPlan: InternshipPlan = {
      id: `plan-${Date.now()}`,
      studentId: "user-1",
      durationType: selectedDuration || "4_weeks",
      totalWeeks: selectedProjects.reduce((sum, p) => sum + parseInt(p.duration), 0),
      projectBlocks: selectedProjects.map((project, index) => ({
        id: `block-${project.id}`,
        projectId: project.id,
        projectTitle: project.title,
        duration: parseInt(project.duration),
        status: index === 0 ? "available" : "locked",
        order: index + 1,
        skills: project.skills,
      })),
      startedAt: undefined,
      completedAt: undefined,
      certificateUnlocked: false,
    }
    setSelectedPlan(newPlan)
    setView("details")
  }

  const handleBack = () => {
    if (view === "details") {
      setView("plans")
    } else if (view === "plans") {
      setView("selection")
    } else if (view === "custom") {
      setView("selection")
    }
  }

  const getEligibility = () => {
    if (!selectedPlan) return { isEligible: false }

    const completedWeeks = selectedPlan.projectBlocks
      .filter(block => block.status === "completed")
      .reduce((sum, block) => sum + block.duration, 0)

    const allBlocksApproved = selectedPlan.projectBlocks.every(
      block => block.status === "completed"
    )

    const check = checkCertificateEligibility(
      completedWeeks,
      selectedPlan.totalWeeks,
      allBlocksApproved
    )

    return {
      ...check,
      missingRequirements: !check.isEligible
        ? [
            ...(completedWeeks < selectedPlan.totalWeeks
              ? [`Complete ${selectedPlan.totalWeeks - completedWeeks} more week${selectedPlan.totalWeeks - completedWeeks > 1 ? 's' : ''}`]
              : []),
            ...(allBlocksApproved ? [] : ["Complete all project blocks"]),
          ]
        : undefined,
    }
  }

  // Use published project templates for selection
  const availableProjects = mockProjectTemplates.filter(p => p.isPublished)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          {view !== "selection" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="hover:bg-secondary-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-3xl font-display font-bold text-primary">
            {view === "selection" && "Start Your Internship"}
            {view === "custom" && "Custom Duration"}
            {view === "plans" && "Select Your Projects"}
            {view === "details" && "Internship Progress"}
          </h1>
        </div>
        <p className="text-secondary-600 max-w-2xl">
          {view === "selection" &&
            "Select your preferred internship duration. We offer flexible options to fit your schedule and learning goals."}
          {view === "custom" &&
            "Enter your desired internship duration. The system will suggest valid project combinations."}
          {view === "plans" &&
            "Choose your project combination and select specific projects to build your personalized internship plan."}
          {view === "details" &&
            "Track your progress, view project milestones, and unlock your certificate upon completion."}
        </p>
      </div>

      {/* Selection View */}
      {view === "selection" && (
        <DurationSelector
          options={mockDurationOptions}
          selectedDuration={selectedDuration}
          onSelect={handleDurationSelect}
        />
      )}

      {/* Custom Duration View */}
      {view === "custom" && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8">
            <div className="max-w-md mx-auto space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold text-primary">Enter Custom Duration</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-secondary-700 mb-2 block">
                    Total weeks (4-24)
                  </label>
                  <Input
                    type="number"
                    min={4}
                    max={24}
                    value={customWeeks || ""}
                    onChange={(e) => setCustomWeeks(parseInt(e.target.value) || 0)}
                    placeholder="e.g., 10"
                    className="text-lg"
                  />
                </div>

                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-800">
                      <p className="font-semibold mb-1">Custom Duration Rules</p>
                      <p className="text-amber-700">
                        The system will only show valid project combinations. Not all week values may be supported.
                        Supported blocks are 4, 8, or 12 weeks.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleCustomWeeksSubmit}
                  disabled={!customWeeks || customWeeks < 4 || customWeeks > 24}
                  className="w-full"
                  size="lg"
                >
                  Continue to Plans
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plans View */}
      {view === "plans" && (
        <ProjectSelector
          durationType={selectedDuration || "4_weeks"}
          customWeeks={selectedDuration === "custom" ? customWeeks : undefined}
          availableProjects={availableProjects}
          selectedProjects={selectedProjects}
          onSelectProjects={setSelectedProjects}
          onConfirm={handleProjectSelectionConfirm}
        />
      )}

      {/* Details View */}
      {view === "details" && selectedPlan && (
        <div className="space-y-6">
          {/* Eligibility Banner */}
          <EligibilityBanner
            eligibility={getEligibility()}
            onViewCertificate={() => console.log("View certificate")}
            onContinue={() => console.log("Continue")}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Progress & Timeline */}
            <div className="lg:col-span-2 space-y-6">
              <ProgressTimeline progress={mockDurationProgress} />
              <ProjectBlockList
                blocks={selectedPlan.projectBlocks}
                onBlockClick={(block) => console.log("Block clicked:", block)}
              />
            </div>

            {/* Right Column - Status & Certificate */}
            <div className="space-y-6">
              <CompletionStatus
                progress={mockDurationProgress}
                onViewCertificate={() => console.log("View certificate")}
                onContinue={() => console.log("Continue")}
              />
              <CertificateUnlockSection
                plan={selectedPlan}
                onDownload={() => console.log("Download certificate")}
                onShare={() => console.log("Share certificate")}
                onViewQR={() => console.log("View QR code")}
              />
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats Banner */}
      {view === "selection" && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 via-primary/[0.02] to-accent/5">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-secondary-600">Flexible Duration</p>
                  <p className="text-lg font-bold text-primary">4, 8, or 12 weeks</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10">
                  <Trophy className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-secondary-600">Real Projects</p>
                  <p className="text-lg font-bold text-primary">Build portfolio</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-10">
                  <Calendar className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-secondary-600">Verified Certificate</p>
                  <p className="text-lg font-bold text-primary">Upon completion</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
