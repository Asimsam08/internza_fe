"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStudentDashboard, useSubmitTask } from "@/lib/hooks/use-student"
import { useUploadTaskScreenshots } from "@/lib/hooks/use-task-screenshots"
import { MultiImageUpload, type ScreenshotItem } from "@/components/ui/multi-image-upload"
import { resolveStorageUrl } from "@/lib/storage-url"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
  ArrowLeft,
  Clock,
  Lock,
} from "lucide-react"

const MIN_SCREENSHOTS = 5

function pathsToItems(
  paths: string[],
  previewUrls?: string[],
): ScreenshotItem[] {
  return paths.map((path, i) => ({
    id: `existing-${i}-${path}`,
    path,
    previewUrl:
      previewUrls?.[i] ?? resolveStorageUrl(path) ?? path,
    status: "done" as const,
  }))
}

export default function SubmissionsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: dashboard, isLoading } = useStudentDashboard()
  const submitTask = useSubmitTask()

  const selectedTaskIdFromUrl = searchParams?.get("task")
  
  // Get all unlocked tasks from dashboard
  const allTasks = dashboard?.taskTimeline || []
  // Tasks are unlocked if: not locked AND (DRAFT, REJECTED, CHANGES_REQUESTED, SUBMITTED, UNDER_REVIEW)
  // Tasks become locked by default and only unlock when previous task is APPROVED
  const unlockedTasks = allTasks.filter(t => !t.isLocked && (
    t.status === 'DRAFT' || 
    t.status === 'REJECTED' || 
    t.status === 'CHANGES_REQUESTED' ||
    t.status === 'SUBMITTED' ||
    t.status === 'UNDER_REVIEW'
  ))
  
  // Pre-select task from URL or first unlocked task
  const selectedTask = unlockedTasks.find(t => t.id === selectedTaskIdFromUrl) || unlockedTasks[0]
  const uploadScreenshots = useUploadTaskScreenshots(selectedTask?.id ?? "")

  // Find the previous task to check if it's pending approval
  const selectedTaskIndex = allTasks.findIndex((t) => t.id === selectedTask?.id)
  const previousTask = selectedTaskIndex > 0 ? allTasks[selectedTaskIndex - 1] : null

  // Form states - Proof of Work
  const [prLink, setPrLink] = useState("")
  const [commitHash, setCommitHash] = useState("")
  const [screenshotItems, setScreenshotItems] = useState<ScreenshotItem[]>([])

  // Form states - Reflection
  const [builtWhat, setBuiltWhat] = useState("")
  const [problemSolved, setProblemSolved] = useState("")
  const [hardestPart, setHardestPart] = useState("")
  const [solutionApproach, setSolutionApproach] = useState("")

  // Form states - AI Disclosure
  const [usedAI, setUsedAI] = useState<"yes" | "no" | "">("")
  const [aiUsage, setAiUsage] = useState("")

  // Pre-fill form when a rejected task is selected
  useEffect(() => {
    if (selectedTask && (selectedTask.status === 'REJECTED' || selectedTask.status === 'CHANGES_REQUESTED') && selectedTask.submission) {
      try {
        const parsed = JSON.parse(selectedTask.submission.description || '{}')
        setBuiltWhat(parsed.builtWhat || '')
        setProblemSolved(parsed.problemSolved || '')
        setHardestPart(parsed.hardestPart || '')
        setSolutionApproach(parsed.solutionApproach || '')
        setUsedAI(parsed.usedAI || '')
        setAiUsage(parsed.aiUsage || '')
        setPrLink(selectedTask.submission.prLink || '')
        setCommitHash(selectedTask.submission.commitHash || '')
        setScreenshotItems(
          pathsToItems(
            selectedTask.submission.screenshots || [],
            selectedTask.submission.screenshotUrls,
          ),
        )
      } catch {
        setPrLink(selectedTask.submission.prLink || '')
        setCommitHash(selectedTask.submission.commitHash || '')
        setScreenshotItems(
          pathsToItems(
            selectedTask.submission.screenshots || [],
            selectedTask.submission.screenshotUrls,
          ),
        )
      }
    } else if (selectedTask && selectedTask.status === 'DRAFT') {
      setBuiltWhat('')
      setProblemSolved('')
      setHardestPart('')
      setSolutionApproach('')
      setUsedAI('')
      setAiUsage('')
      setPrLink('')
      setCommitHash('')
      setScreenshotItems([])
    }
  }, [selectedTask])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedTask) {
      toast.error("Please select a task")
      return
    }
    
    if (!prLink.trim()) {
      toast.error("PR Link is required")
      return
    }

    if (!builtWhat.trim()) {
      toast.error("Please describe what you built")
      return
    }

    if (!problemSolved.trim()) {
      toast.error("Please describe what problem you solved")
      return
    }


    if (!usedAI) {
      toast.error("Please answer the AI disclosure question")
      return
    }

    const screenshotPaths = screenshotItems
      .filter((i) => i.status === "done" && i.path)
      .map((i) => i.path)

    if (screenshotPaths.length < MIN_SCREENSHOTS) {
      toast.error(`Upload at least ${MIN_SCREENSHOTS} screenshots`)
      return
    }

    const stillUploading = screenshotItems.some((i) => i.status === "uploading")
    if (stillUploading) {
      toast.error("Wait for all screenshots to finish uploading")
      return
    }

    try {
      await submitTask.mutateAsync({
        taskId: selectedTask.id,
        prLink: prLink.trim(),
        commitHash: commitHash.trim() || undefined,
        description: JSON.stringify({
          builtWhat: builtWhat.trim(),
          problemSolved: problemSolved.trim(),
          hardestPart: hardestPart.trim() || undefined,
          solutionApproach: solutionApproach.trim() || undefined,
          usedAI: usedAI,
          aiUsage: usedAI === "yes" ? aiUsage.trim() : undefined,
        }),
        screenshots: screenshotPaths,
      })
      setPrLink("")
      setCommitHash("")
      setBuiltWhat("")
      setProblemSolved("")
      setHardestPart("")
      setSolutionApproach("")
      setUsedAI("")
      setAiUsage("")
      setScreenshotItems([])
      toast.success("Task submitted successfully!")
      router.push("/dashboard")
    } catch {
      // Error is handled by the hook
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-secondary-600">Loading submissions...</p>
        </div>
      </div>
    )
  }

  if (!dashboard || unlockedTasks.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-amber-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Tasks Available</h3>
            <p className="text-secondary-600 mb-4">You don't have any unlocked tasks to submit.</p>
            <Button onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-primary tracking-tight">Submit Task</h1>
        <p className="mt-1 text-sm text-secondary-500">
          Provide your work details for review.
        </p>
      </div>

      {/* Task Selector */}
      <Card className="border-secondary-200">
        <CardContent className="p-5">
          <div className="space-y-2">
            <Label>Select Task</Label>
            <Select
              value={selectedTask?.id ?? ""}
              onValueChange={(v) => {
                const next = new URLSearchParams(searchParams?.toString())
                next.set("task", v)
                router.replace(`/submissions?${next.toString()}`)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select task" />
              </SelectTrigger>
              <SelectContent>
                {unlockedTasks.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    Task {t.order}: {t.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedTask && (
              <div className="flex items-center gap-2 mt-2">
                <Badge className={`${
                  selectedTask.status === 'REJECTED' || selectedTask.status === 'CHANGES_REQUESTED'
                    ? 'bg-red-100 text-red-800 border-red-200'
                    : selectedTask.status === 'SUBMITTED' || selectedTask.status === 'UNDER_REVIEW'
                    ? 'bg-blue-100 text-blue-800 border-blue-200'
                    : 'bg-blue-100 text-blue-800 border-blue-200'
                }`}>
                  {selectedTask.status === 'REJECTED' || selectedTask.status === 'CHANGES_REQUESTED' ? (
                    <>
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Needs Changes
                    </>
                  ) : selectedTask.status === 'SUBMITTED' || selectedTask.status === 'UNDER_REVIEW' ? (
                    <>
                      <Clock className="h-3 w-3 mr-1" />
                      Under Review
                    </>
                  ) : (
                    <>
                      <Clock className="h-3 w-3 mr-1" />
                      In Progress
                    </>
                  )}
                </Badge>
                <p className="text-xs text-secondary-500">
                  <span className="font-medium text-secondary-700">{selectedTask.title}</span>
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Task Progression Info */}
      {selectedTask && (selectedTask.status === 'SUBMITTED' || selectedTask.status === 'UNDER_REVIEW') && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 mb-1">Task Under Review</h4>
                <p className="text-sm text-blue-700 mb-2">
                  Your submission is being reviewed by the mentor. The next task will unlock once this task is approved.
                </p>
                <p className="text-xs text-blue-600">
                  Completion is not equivalent to approval. Please wait for the reviewer's feedback.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Approved Task Info */}
      {selectedTask && selectedTask.status === 'APPROVED' && (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-emerald-900 mb-1">Task Approved</h4>
                <p className="text-sm text-emerald-700 mb-2">
                  Congratulations! Your task has been approved by the reviewer. The next task is now unlocked.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rejected Task Info */}
      {selectedTask && (selectedTask.status === 'REJECTED' || selectedTask.status === 'CHANGES_REQUESTED') && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-red-900 mb-1">
                  {selectedTask.status === 'REJECTED' ? 'Task Rejected' : 'Changes Requested'}
                </h4>
                <p className="text-sm text-red-700 mb-2">
                  {selectedTask.status === 'REJECTED'
                    ? 'Your task has been rejected. Please review the feedback below and resubmit with the necessary changes.'
                    : 'The reviewer has requested changes. Please review the feedback below and update your submission.'}
                </p>
                {selectedTask.review?.feedback && (
                  <div className="mt-3 p-3 bg-white rounded-lg border border-red-200">
                    <p className="text-xs text-red-600 font-medium mb-1">Reviewer Feedback:</p>
                    <p className="text-sm text-red-800">{selectedTask.review.feedback}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Locked Task Info */}
      {selectedTask && selectedTask.isLocked && previousTask && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-amber-900 mb-1">Task Locked</h4>
                <p className="text-sm text-amber-700 mb-2">
                  This task is locked because the previous task (Task {previousTask.order}: {previousTask.title}) is not yet approved.
                </p>
                {previousTask.status === 'SUBMITTED' || previousTask.status === 'UNDER_REVIEW' ? (
                  <p className="text-xs text-amber-600">
                    The previous task is currently under review. Please wait for approval to proceed.
                  </p>
                ) : (
                  <p className="text-xs text-amber-600">
                    Complete and submit the previous task to unlock this one.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submission Form */}
      {selectedTask && selectedTask.status !== 'SUBMITTED' && selectedTask.status !== 'UNDER_REVIEW' && (
        <Card className="border-secondary-200">
          <CardHeader>
            <CardTitle className="text-base">Task Submission</CardTitle>
            <CardDescription>
              {selectedTask.status === 'REJECTED' || selectedTask.status === 'CHANGES_REQUESTED'
                ? "Your previous submission was rejected. Please update your work and resubmit."
                : "Provide your work details and reflection for review."
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Section 1: Proof of Work */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-1 bg-primary rounded-full" />
                  <h3 className="text-lg font-semibold text-primary">Proof of Work</h3>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="prLink">
                    Pull Request Link <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="prLink"
                    type="url"
                    placeholder="https://github.com/username/repo/pull/123"
                    value={prLink}
                    onChange={(e) => setPrLink(e.target.value)}
                    required
                    disabled={submitTask.isPending}
                    className={prLink ? "border-green-300" : ""}
                  />
                  <p className="text-sm text-secondary-500">
                    Link to your pull request on GitHub/GitLab
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="commitHash">Commit Hash (Optional)</Label>
                  <Input
                    id="commitHash"
                    placeholder="abc123def456..."
                    value={commitHash}
                    onChange={(e) => setCommitHash(e.target.value)}
                    disabled={submitTask.isPending}
                  />
                  <p className="text-sm text-secondary-500">
                    The commit hash of your submission
                  </p>
                </div>

                {selectedTask && (
                  <MultiImageUpload
                    min={MIN_SCREENSHOTS}
                    max={10}
                    items={screenshotItems}
                    onChange={setScreenshotItems}
                    disabled={submitTask.isPending || uploadScreenshots.isPending}
                    onUpload={(files) =>
                      uploadScreenshots.mutateAsync(files)
                    }
                  />
                )}
              </div>

              {/* Section 2: Task Reflection */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-1 bg-primary rounded-full" />
                  <h3 className="text-lg font-semibold text-primary">Task Reflection</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="builtWhat">
                    What did you build? <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="builtWhat"
                    placeholder="Describe the feature, component, or functionality you implemented..."
                    value={builtWhat}
                    onChange={(e) => setBuiltWhat(e.target.value)}
                    rows={3}
                    disabled={submitTask.isPending}
                    required
                    className={builtWhat ? "border-green-300" : ""}
                  />
                  <p className="text-sm text-secondary-500">
                    Brief overview of what you implemented
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="problemSolved">
                    What problem did you solve? <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="problemSolved"
                    placeholder="What challenge or requirement did this task address?"
                    value={problemSolved}
                    onChange={(e) => setProblemSolved(e.target.value)}
                    rows={3}
                    disabled={submitTask.isPending}
                    required
                    className={problemSolved ? "border-green-300" : ""}
                  />
                  <p className="text-sm text-secondary-500">
                    The specific problem or user need your solution addresses
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hardestPart">
                    What was the hardest part? <span className="text-amber-600">*</span>
                  </Label>
                  <Textarea
                    id="hardestPart"
                    placeholder="What aspect was most challenging or time-consuming?"
                    value={hardestPart}
                    onChange={(e) => setHardestPart(e.target.value)}
                    rows={3}
                    disabled={submitTask.isPending}
                  />
                  <p className="text-sm text-secondary-500">
                    Technical challenges or complexities you encountered
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="solutionApproach">
                    How did you solve it? <span className="text-amber-600">*</span>
                  </Label>
                  <Textarea
                    id="solutionApproach"
                    placeholder="Describe your approach, research, or problem-solving process..."
                    value={solutionApproach}
                    onChange={(e) => setSolutionApproach(e.target.value)}
                    rows={3}
                    disabled={submitTask.isPending}
                  />
                  <p className="text-sm text-secondary-500">
                    Your thought process and implementation strategy
                  </p>
                </div>
              </div>

              {/* Section 3: AI Disclosure */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-1 bg-amber-500 rounded-full" />
                  <h3 className="text-lg font-semibold text-amber-700">AI Disclosure</h3>
                </div>

                <div className="space-y-2">
                  <Label>
                    Did you use AI for this task? <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="ai-yes"
                        name="usedAI"
                        value="yes"
                        checked={usedAI === "yes"}
                        onChange={(e) => setUsedAI(e.target.value as "yes" | "no")}
                        disabled={submitTask.isPending}
                        className="h-4 w-4 text-primary"
                      />
                      <Label htmlFor="ai-yes" className="cursor-pointer">Yes</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="ai-no"
                        name="usedAI"
                        value="no"
                        checked={usedAI === "no"}
                        onChange={(e) => setUsedAI(e.target.value as "yes" | "no")}
                        disabled={submitTask.isPending}
                        className="h-4 w-4 text-primary"
                      />
                      <Label htmlFor="ai-no" className="cursor-pointer">No</Label>
                    </div>
                  </div>
                  <p className="text-sm text-secondary-500">
                    Honest disclosure helps us understand your learning process
                  </p>
                </div>

                {usedAI === "yes" && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <Label htmlFor="aiUsage">
                      If yes, how did you use it? <span className="text-amber-600">(Strongly encouraged)</span>
                    </Label>
                    <Textarea
                      id="aiUsage"
                      placeholder="e.g., Used AI for debugging, code suggestions, understanding concepts, etc."
                      value={aiUsage}
                      onChange={(e) => setAiUsage(e.target.value)}
                      rows={3}
                      disabled={submitTask.isPending}
                    />
                    <p className="text-sm text-secondary-500">
                      Describe how AI assisted you in completing this task
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setPrLink("")
                    setCommitHash("")
                    setBuiltWhat("")
                    setProblemSolved("")
                    setHardestPart("")
                    setSolutionApproach("")
                    setUsedAI("")
                    setAiUsage("")
                    setScreenshotItems([])
                  }}
                  disabled={submitTask.isPending}
                >
                  Clear
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-12 text-base"
                  disabled={submitTask.isPending}
                >
                  {submitTask.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Submit Task
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
