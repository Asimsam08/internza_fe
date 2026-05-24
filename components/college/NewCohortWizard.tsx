"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Loader2 } from "lucide-react"
import { useCollegeReviewers, useCollegeTemplatesFor, useCreateCohort } from "@/lib/hooks/use-college-admin"
import { CohortLaunchDialog } from "./CohortLaunchDialog"
import { useAuthStore } from "@/stores/authStore"
import { toast } from "sonner"

interface NewCohortWizardProps {
  collegeId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewCohortWizard({ collegeId, open, onOpenChange }: NewCohortWizardProps) {
  const { data: templates = [] } = useCollegeTemplatesFor(collegeId)
  const { data: reviewers = [] } = useCollegeReviewers(collegeId)
  const createCohort = useCreateCohort(collegeId)
  const currentUser = useAuthStore((s) => s.user)

  const [step, setStep] = useState(1)
  const [launchOpen, setLaunchOpen] = useState(false)
  const [createdCohort, setCreatedCohort] = useState<{ id: string; name: string } | null>(null)

  const [form, setForm] = useState({
    name: "",
    templateId: "",
    startDate: "",
    endDate: "",
    reviewerUserIds: [] as string[],
  })

  const reset = () => {
    setStep(1)
    setCreatedCohort(null)
    setForm({ name: "", templateId: "", startDate: "", endDate: "", reviewerUserIds: [] })
  }

  const handleClose = (next: boolean) => {
    if (!next) reset()
    onOpenChange(next)
  }

  const createDraft = async () => {
    const res = await createCohort.mutateAsync({
      name: form.name,
      templateId: form.templateId,
      startDate: form.startDate,
      endDate: form.endDate,
      reviewerUserIds: form.reviewerUserIds,
    })
    const payload = (res as { data?: { id: string; name: string } })?.data ?? (res as { id: string; name: string })
    const id = payload?.id
    const name = payload?.name ?? form.name
    if (!id) {
      toast.error("Cohort created but id missing in response")
      return null
    }
    return { id, name }
  }

  const onCreateAndLaunch = async () => {
    const cohort = await createDraft()
    if (!cohort) return
    setCreatedCohort(cohort)
    handleClose(false)
    setLaunchOpen(true)
  }

  const onSaveDraft = async () => {
    const cohort = await createDraft()
    if (cohort) {
      toast.success("Cohort saved as draft — upload students when ready")
      handleClose(false)
    }
  }

  const stepLabels = ["Details", "Template", "Reviewers"]
  const progress = step === 4 ? 100 : (step / 3) * 100

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New cohort</DialogTitle>
            <DialogDescription>
              Set up a batch internship: pick a template, assign reviewers, then upload students.
            </DialogDescription>
          </DialogHeader>
          {step <= 3 && (
            <section className="space-y-2">
              <Progress value={progress} className="h-1.5" />
              <p className="text-xs text-secondary-500">
                Step {step} of 3 — {stepLabels[step - 1]}
              </p>
            </section>
          )}

          {step === 1 && (
            <section className="space-y-4">
              <fieldset className="space-y-2 border-0 p-0">
                <Label>Cohort name</Label>
                <Input
                  placeholder="e.g. CSE Batch #3"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </fieldset>
              <fieldset className="grid grid-cols-2 gap-3 border-0 p-0">
                <fieldset className="space-y-2 border-0 p-0">
                  <Label>Start date</Label>
                  <Input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                  />
                </fieldset>
                <fieldset className="space-y-2 border-0 p-0">
                  <Label>End date</Label>
                  <Input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                  />
                </fieldset>
              </fieldset>
              <Button
                className="w-full"
                disabled={!form.name || !form.startDate || !form.endDate}
                onClick={() => setStep(2)}
              >
                Continue
              </Button>
            </section>
          )}

          {step === 2 && (
            <section className="space-y-4">
              <fieldset className="space-y-2 border-0 p-0">
                <Label>Project template</Label>
                <Select value={form.templateId} onValueChange={(v) => setForm((f) => ({ ...f, templateId: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select published template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((t: { id: string; title: string; duration: number }) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.title} · {t.duration} weeks
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </fieldset>
              <section className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button className="flex-1" disabled={!form.templateId} onClick={() => setStep(3)}>
                  Continue
                </Button>
              </section>
            </section>
          )}

          {step === 3 && (
            <section className="space-y-4">
              <p className="text-sm text-secondary-600">
                You are assigned as the default reviewer for this cohort. Add faculty below when they have joined
                your team — newly invited reviewers are automatically linked to all cohorts once they accept.
              </p>
              <article className="rounded-lg border border-primary-100 bg-primary-50/50 px-3 py-2 text-sm text-secondary-800">
                <span className="font-medium text-secondary-900">Default reviewer: </span>
                {currentUser?.email ?? "Placement officer (you)"}
              </article>
              <p className="text-xs text-secondary-500">Additional faculty reviewers (optional)</p>
              <section className="max-h-44 overflow-y-auto rounded-lg border p-3 space-y-2">
                {reviewers.length === 0 ? (
                  <p className="text-sm text-secondary-500">
                    No reviewers yet. Invite them from the Team page.
                  </p>
                ) : (
                  reviewers.map((r: { id: string; email: string }) => (
                    <label key={r.id} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-secondary-300"
                        checked={form.reviewerUserIds.includes(r.id)}
                        onChange={(e) => {
                          setForm((f) => ({
                            ...f,
                            reviewerUserIds: e.target.checked
                              ? [...f.reviewerUserIds, r.id]
                              : f.reviewerUserIds.filter((id) => id !== r.id),
                          }))
                        }}
                      />
                      {r.email}
                    </label>
                  ))
                )}
              </section>
              <section className="flex flex-col gap-2">
                <Button disabled={createCohort.isPending} onClick={onCreateAndLaunch}>
                  {createCohort.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Create & upload students
                </Button>
                <Button variant="outline" disabled={createCohort.isPending} onClick={onSaveDraft}>
                  Save as draft (launch later)
                </Button>
                <Button variant="ghost" onClick={() => setStep(2)}>
                  Back
                </Button>
              </section>
            </section>
          )}
        </DialogContent>
      </Dialog>

      {createdCohort && (
        <CohortLaunchDialog
          collegeId={collegeId}
          cohortId={createdCohort.id}
          cohortName={createdCohort.name}
          open={launchOpen}
          onOpenChange={setLaunchOpen}
        />
      )}
    </>
  )
}
