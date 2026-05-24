"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, ArrowLeft, Save, X, Clock, Upload, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useTemplate, useUpdateTemplate } from "@/lib/hooks/use-templates"
import { toast } from "sonner"

interface TaskForm {
  id: string
  title: string
  description: string
  durationDays: string
  dependsOnTaskId?: string
}

export default function EditTemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const difficulties = ["Beginner", "Intermediate", "Advanced"] as const
  type Difficulty = (typeof difficulties)[number]

  const resolvedParams = use(params)
  const id = resolvedParams.id

  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [shortDescription, setShortDescription] = useState("")
  const [difficulty, setDifficulty] = useState<Difficulty>("Beginner")
  const [duration, setDuration] = useState("")
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [techStack, setTechStack] = useState<string[]>([])
  const [newTech, setNewTech] = useState("")
  const [figmaLink, setFigmaLink] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [imageAlt, setImageAlt] = useState("")
  const [tasks, setTasks] = useState<TaskForm[]>([
    { id: "1", title: "", description: "", durationDays: "" }
  ])

  const { data: template, isLoading: isLoadingTemplate, error } = useTemplate(id)
  const updateMutation = useUpdateTemplate()

  // Populate form when template loads
  useEffect(() => {
    if (template) {
      setTitle(template.title)
      setCategory(template.category)
      setDescription(template.description)
      setShortDescription(template.shortDescription || "")
      setDifficulty(template.difficulty as Difficulty)
      setDuration(template.duration.toString())
      setSkills(template.skills)
      setTechStack(template.techStack || [])
      setFigmaLink(template.figmaLink || "")
      setImageUrl(template.imageUrl || "")
      setImageAlt(template.imageAlt || "")
      setTasks(template.templateTasks.map(t => ({
        id: t.id,
        title: t.title,
        description: t.description,
        durationDays: t.durationDays.toString(),
        dependsOnTaskId: t.dependsOnTaskId
      })))
    }
  }, [template])

  if (isLoadingTemplate) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm text-secondary-600">Loading template...</p>
        </div>
      </div>
    )
  }

  if (error || !template) {
    return (
      <div className="p-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 flex items-center gap-4">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <div>
              <p className="font-medium text-red-900">Failed to load template</p>
              <p className="text-sm text-red-700">The template may not exist or you may not have access</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => router.back()} className="ml-auto">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (template.status !== "DRAFT") {
    return (
      <div className="p-8">
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-6 flex items-center gap-4">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <div>
              <p className="font-medium text-amber-900">Cannot Edit Published Template</p>
              <p className="text-sm text-amber-700">Only draft templates can be edited. Create a new version instead.</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => router.push(`/admin/templates/${template.id}`)} className="ml-auto">
              View Template
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const addTask = () => {
    setTasks([...tasks, { 
      id: Date.now().toString(), 
      title: "", 
      description: "", 
      durationDays: "" 
    }])
  }

  const removeTask = (id: string) => {
    if (tasks.length > 1) {
      setTasks(tasks.filter(t => t.id !== id))
    }
  }

  const updateTask = (id: string, field: keyof TaskForm, value: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, [field]: value } : t))
  }

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill))
  }

  const addTech = () => {
    if (newTech.trim() && !techStack.includes(newTech.trim())) {
      setTechStack([...techStack, newTech.trim()])
      setNewTech("")
    }
  }

  const removeTech = (tech: string) => {
    setTechStack(techStack.filter(t => t !== tech))
  }

  const validateForm = () => {
    if (!title.trim()) {
      toast.error("Title is required")
      return false
    }
    if (!category.trim()) {
      toast.error("Category is required")
      return false
    }
    if (!description.trim()) {
      toast.error("Description is required")
      return false
    }
    if (!duration.trim() || isNaN(parseInt(duration))) {
      toast.error("Duration must be a valid number")
      return false
    }
    if (skills.length === 0) {
      toast.error("At least one skill is required")
      return false
    }
    if (tasks.length === 0) {
      toast.error("At least one task is required")
      return false
    }
    for (const task of tasks) {
      if (!task.title.trim()) {
        toast.error("All tasks must have a title")
        return false
      }
      if (!task.description.trim()) {
        toast.error("All tasks must have a description")
        return false
      }
      if (!task.durationDays.trim() || isNaN(parseInt(task.durationDays))) {
        toast.error("All tasks must have a valid duration in days")
        return false
      }
    }
    return true
  }

  const handleSaveDraft = async () => {
    if (!validateForm()) return

    const templateData = {
      title,
      category,
      description,
      shortDescription,
      difficulty,
      duration: parseInt(duration),
      skills,
      techStack,
      figmaLink,
      imageUrl,
      imageAlt,
      tasks: tasks.map((t, i) => ({
        title: t.title,
        description: t.description,
        order: i + 1,
        durationDays: parseInt(t.durationDays),
        dependsOnTaskId: t.dependsOnTaskId
      }))
    }

    try {
      await updateMutation.mutateAsync({ id, data: templateData })
      router.push(`/admin/templates/${id}`)
    } catch {
      // Error handled by mutation
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/admin/templates/${id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edit Project Template</h1>
          <p className="text-slate-600">Update the project template</p>
        </div>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Project overview and details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input 
                id="title" 
                placeholder="e.g., AI/ML Image Classifier"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AI/ML">AI/ML</SelectItem>
                  <SelectItem value="Frontend">Frontend</SelectItem>
                  <SelectItem value="Backend">Backend</SelectItem>
                  <SelectItem value="Fullstack">Fullstack</SelectItem>
                  <SelectItem value="DevOps">DevOps</SelectItem>
                  <SelectItem value="Mobile">Mobile</SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="Blockchain">Blockchain</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty *</Label>
              <Select
                value={difficulty}
                onValueChange={(v) => {
                  if (difficulties.includes(v as Difficulty)) setDifficulty(v as Difficulty)
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (weeks) *</Label>
              <Input 
                id="duration" 
                type="number"
                placeholder="e.g., 4"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="figma">Figma/UI Link (Optional)</Label>
              <Input 
                id="figma" 
                placeholder="https://figma.com/..."
                value={figmaLink}
                onChange={(e) => setFigmaLink(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="shortDesc">Short Description</Label>
            <Input 
              id="shortDesc" 
              placeholder="Brief one-line description"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Full Description *</Label>
            <Textarea 
              id="description" 
              placeholder="Detailed project description..."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Image Upload (Optional) */}
          <div className="space-y-2">
            <Label>Project Image (Optional)</Label>
            <div className="flex gap-2">
              <Input 
                placeholder="Image URL (or leave empty for default)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <Button type="button" variant="outline" size="icon">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            {imageUrl && (
              <div className="mt-2">
                <img 
                  src={imageUrl} 
                  alt={imageAlt || "Project preview"} 
                  className="h-32 w-48 object-cover rounded-lg border"
                />
              </div>
            )}
            <Input 
              placeholder="Image alt text (for accessibility)"
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle>Skills & Technologies</CardTitle>
          <CardDescription>What students will learn</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Skills *</Label>
            <div className="flex gap-2">
              <Input 
                placeholder="Add a skill (e.g., React, Python)"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
              />
              <Button type="button" onClick={addSkill} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="gap-1">
                  {skill}
                  <button onClick={() => removeSkill(skill)} className="ml-1 hover:text-red-500">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Tech Stack (Optional)</Label>
            <div className="flex gap-2">
              <Input 
                placeholder="Add technology (e.g., Node.js, TensorFlow)"
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
              />
              <Button type="button" onClick={addTech} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {techStack.map((tech) => (
                <Badge key={tech} variant="outline" className="gap-1">
                  {tech}
                  <button onClick={() => removeTech(tech)} className="ml-1 hover:text-red-500">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>Define the sequential tasks students must complete with estimated duration</CardDescription>
          </div>
          <Button onClick={addTask} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Task
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {tasks.map((task, index) => (
            <div key={task.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Task {index + 1}</h4>
                {tasks.length > 1 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeTask(task.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Task Title *</Label>
                <Input 
                  placeholder="e.g., Setup Development Environment"
                  value={task.title}
                  onChange={(e) => updateTask(task.id, "title", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea 
                  placeholder="What should the student do?"
                  rows={2}
                  value={task.description}
                  onChange={(e) => updateTask(task.id, "description", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Duration (days) *</Label>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-secondary-400" />
                  <Input 
                    type="number"
                    placeholder="e.g., 3"
                    value={task.durationDays}
                    onChange={(e) => updateTask(task.id, "durationDays", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={handleSaveDraft}
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
