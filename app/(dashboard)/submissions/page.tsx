"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuthStore } from "@/stores/authStore"
import { mockProjectTemplates, mockStudentProgress } from "@/lib/mockData"
import { useRouter, useSearchParams } from "next/navigation"
import { 
  GitBranch, 
  Image, 
  FileText, 
  Globe, 
  Video, 
  Upload,
  CheckCircle2,
  X,
  AlertCircle,
  ClipboardList
} from "lucide-react"

type ProofKind = "commit_hash" | "screenshot" | "file_upload" | "deployment_link" | "documentation" | "video"

interface ProofItem {
  type: ProofKind
  title: string
  content?: string
  url?: string
}

export default function SubmissionsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuthStore()

  const studentId = user?.id ?? mockStudentProgress[0]?.studentId

  const enrollments = useMemo(() => {
    if (!studentId) return []
    return mockStudentProgress.filter((p) => p.studentId === studentId)
  }, [studentId])

  const selectedProjectId =
    searchParams.get("project") ||
    enrollments[0]?.projectId ||
    mockProjectTemplates.find((t) => t.isPublished)?.id ||
    mockProjectTemplates[0]?.id

  const project = mockProjectTemplates.find((t) => t.id === selectedProjectId) ?? mockProjectTemplates[0]

  const selectedTaskIdFromUrl = searchParams.get("task")
  const selectedTask =
    project.tasks.find((t) => t.id === selectedTaskIdFromUrl) ??
    (selectedTaskIdFromUrl ? undefined : project.tasks[0])

  const [proofs, setProofs] = useState<ProofItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeProofType, setActiveProofType] = useState<ProofKind>("commit_hash")
  const [notes, setNotes] = useState("")

  // Form states
  const [gitForm, setGitForm] = useState({ commitHash: "", repoUrl: "", branch: "" })
  const [deploymentForm, setDeploymentForm] = useState({ url: "", description: "" })
  const [docForm, setDocForm] = useState({ title: "", content: "" })

  const proofTypes = [
    { id: "commit_hash" as ProofKind, label: "Commit", icon: GitBranch },
    { id: "screenshot" as ProofKind, label: "Screenshot", icon: Image },
    { id: "file_upload" as ProofKind, label: "Files", icon: FileText },
    { id: "deployment_link" as ProofKind, label: "Deployment", icon: Globe },
    { id: "documentation" as ProofKind, label: "Documentation", icon: FileText },
    { id: "video" as ProofKind, label: "Video", icon: Video },
  ]

  const addProof = () => {
    let newProof: ProofItem = { type: activeProofType, title: "" }
    
    switch (activeProofType) {
      case "commit_hash":
        newProof = { 
          type: activeProofType, 
          title: `Git: ${gitForm.commitHash.slice(0, 7) || "commit"}`,
          url: gitForm.repoUrl 
        }
        setGitForm({ commitHash: "", repoUrl: "", branch: "" })
        break
      case "deployment_link":
        newProof = { 
          type: activeProofType, 
          title: deploymentForm.description || "Deployment",
          url: deploymentForm.url 
        }
        setDeploymentForm({ url: "", description: "" })
        break
      case "documentation":
        newProof = { 
          type: activeProofType, 
          title: docForm.title,
          content: docForm.content 
        }
        setDocForm({ title: "", content: "" })
        break
    }
    
    setProofs([...proofs, newProof])
  }

  const removeProof = (index: number) => {
    setProofs(proofs.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!selectedTask) return
    if (proofs.length === 0) return

    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    setProofs([])
    setNotes("")
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">Submit Proof</h1>
          <p className="mt-1 text-sm text-secondary-500">
            Select a project and task, then attach evidence for review.
          </p>
        </div>
      </div>

      {/* Context selector */}
      <Card className="border-secondary-200">
        <CardContent className="p-5">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Project</Label>
              <Select
                value={project.id}
                onValueChange={(v) => {
                  const next = new URLSearchParams(searchParams.toString())
                  next.set("project", v)
                  next.delete("task")
                  router.replace(`/submissions?${next.toString()}`)
                  setProofs([])
                  setNotes("")
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {(enrollments.length > 0 ? enrollments : mockStudentProgress).map((p) => {
                    const t = mockProjectTemplates.find((x) => x.id === p.projectId)
                    if (!t) return null
                    return (
                      <SelectItem key={t.id} value={t.id}>
                        {t.title}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Task</Label>
              <Select
                value={selectedTask?.id ?? ""}
                onValueChange={(v) => {
                  const next = new URLSearchParams(searchParams.toString())
                  next.set("project", project.id)
                  next.set("task", v)
                  router.replace(`/submissions?${next.toString()}`)
                  setProofs([])
                  setNotes("")
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select task" />
                </SelectTrigger>
                <SelectContent>
                  {project.tasks
                    .slice()
                    .sort((a, b) => a.order - b.order)
                    .map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        Task {t.order}: {t.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {selectedTask ? (
                <p className="text-xs text-secondary-500">
                  Expected output: <span className="font-medium text-secondary-700">{selectedTask.expectedOutput}</span>
                </p>
              ) : (
                <p className="text-xs text-secondary-500">Choose a task to start submitting proof.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Proof Type Selector */}
          <Card className="border-secondary-200">
            <CardHeader>
              <CardTitle className="text-base">Add Proof</CardTitle>
              <CardDescription>Select proof type and fill details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {proofTypes.map((type) => (
                  <Button
                    key={type.id}
                    variant={activeProofType === type.id ? "primary" : "outline"}
                    size="sm"
                    className="gap-1"
                    onClick={() => setActiveProofType(type.id)}
                  >
                    <type.icon className="h-4 w-4" />
                    {type.label}
                  </Button>
                ))}
              </div>

              {/* Dynamic Form */}
              {activeProofType === "commit_hash" && (
                <div className="space-y-3">
                  <div>
                    <Label>Repository URL</Label>
                    <Input 
                      placeholder="https://github.com/username/repo"
                      value={gitForm.repoUrl}
                      onChange={(e) => setGitForm({...gitForm, repoUrl: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Commit Hash</Label>
                      <Input 
                        placeholder="abc123..."
                        value={gitForm.commitHash}
                        onChange={(e) => setGitForm({...gitForm, commitHash: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Branch</Label>
                      <Input 
                        placeholder="main"
                        value={gitForm.branch}
                        onChange={(e) => setGitForm({...gitForm, branch: e.target.value})}
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={addProof}
                    disabled={!gitForm.repoUrl}
                    className="w-full"
                  >
                    <GitBranch className="h-4 w-4 mr-2" />
                    Add commit proof
                  </Button>
                </div>
              )}

              {activeProofType === "deployment_link" && (
                <div className="space-y-3">
                  <div>
                    <Label>Deployment URL</Label>
                    <Input 
                      placeholder="https://my-project.vercel.app"
                      value={deploymentForm.url}
                      onChange={(e) => setDeploymentForm({...deploymentForm, url: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input 
                      placeholder="What did you deploy?"
                      value={deploymentForm.description}
                      onChange={(e) => setDeploymentForm({...deploymentForm, description: e.target.value})}
                    />
                  </div>
                  <Button 
                    onClick={addProof}
                    disabled={!deploymentForm.url}
                    className="w-full"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Add Deployment
                  </Button>
                </div>
              )}

              {activeProofType === "documentation" && (
                <div className="space-y-3">
                  <div>
                    <Label>Title</Label>
                    <Input 
                      placeholder="Documentation title"
                      value={docForm.title}
                      onChange={(e) => setDocForm({...docForm, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Content</Label>
                    <Textarea 
                      placeholder="Write your documentation..."
                      rows={4}
                      value={docForm.content}
                      onChange={(e) => setDocForm({...docForm, content: e.target.value})}
                    />
                  </div>
                  <Button 
                    onClick={addProof}
                    disabled={!docForm.title}
                    className="w-full"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Add Documentation
                  </Button>
                </div>
              )}

              {(activeProofType === "screenshot" || activeProofType === "file_upload" || activeProofType === "video") && (
                <div className="border-2 border-dashed border-secondary-300 rounded-lg p-8 text-center">
                  <Upload className="h-8 w-8 mx-auto text-secondary-400 mb-2" />
                  <p className="text-sm text-secondary-600 mb-4">
                    {activeProofType === "screenshot" && "Upload screenshots showing your work"}
                    {activeProofType === "file_upload" && "Upload code files, PDFs, or reports"}
                    {activeProofType === "video" && "Upload or link video walkthroughs"}
                  </p>
                  <Input type="file" className="hidden" id="file-upload" />
                  <Label htmlFor="file-upload">
                    <Button variant="outline" type="button">Select Files</Button>
                  </Label>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="border-secondary-200">
            <CardHeader>
              <CardTitle className="text-base">Submission Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Describe what you accomplished..."
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => { setProofs([]); setNotes(""); }}>
              Clear
            </Button>
            <Button 
              className="flex-1"
              disabled={!selectedTask || proofs.length === 0 || isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? "Submitting..." : "Submit for Review"}
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="border-secondary-200">
            <CardHeader>
              <CardTitle className="text-base">Submission context</CardTitle>
              <CardDescription>Confirm the task before submitting.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg border border-secondary-100 bg-secondary-50 p-3">
                <div className="text-xs font-semibold text-secondary-500">Project</div>
                <div className="mt-1 text-sm font-semibold text-secondary-900">{project.title}</div>
              </div>
              <div className="rounded-lg border border-secondary-100 bg-white p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-secondary-500">Task</div>
                    <div className="mt-1 text-sm font-semibold text-secondary-900">
                      {selectedTask ? `Task ${selectedTask.order}: ${selectedTask.title}` : "Not selected"}
                    </div>
                  </div>
                  {selectedTask ? (
                    <Badge className="bg-accent/10 text-accent-700 border-0 text-xs font-semibold">
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                      Ready
                    </Badge>
                  ) : null}
                </div>
              </div>

              {selectedTask ? (
                <div className="rounded-lg border border-secondary-100 bg-white p-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-secondary-500">
                    <ClipboardList className="h-4 w-4 text-secondary-500" />
                    Required proofs
                  </div>
                  <div className="mt-2 space-y-2">
                    {selectedTask.proofRequirements.map((p, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-secondary-700">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-secondary-400" />
                        <span className="flex-1">
                          <span className="font-semibold">{p.type.replace("_", " ")}</span>
                          {p.required ? <span className="text-secondary-500"> • required</span> : null}
                          <div className="text-secondary-500">{p.description}</div>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-secondary-100 bg-secondary-50 p-3 text-sm text-secondary-600">
                  Select a task to see required proof formats.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-secondary-200">
            <CardHeader>
              <CardTitle className="text-base">Proof Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {proofs.length === 0 ? (
                <div className="text-center py-4 text-secondary-500">
                  <AlertCircle className="h-6 w-6 mx-auto mb-2" />
                  <p className="text-sm">No proofs added</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {proofs.map((proof, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-secondary-50 rounded">
                      <span className="text-sm truncate">{proof.title}</span>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => removeProof(idx)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
