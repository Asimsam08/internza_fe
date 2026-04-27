"use client"

import { useRouter } from "next/navigation"
import { use } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Edit,
  Trash2,
  Clock,
  FileText,
  Calendar,
  Archive,
  Eye,
  CheckCircle,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  User
} from "lucide-react"
import { useTemplate, useDeleteTemplate, useArchiveTemplate, usePublishTemplate } from "@/lib/hooks/use-templates"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useState } from "react"

export default function TemplateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [archiveDialog, setArchiveDialog] = useState(false)

  const resolvedParams = use(params)
  const id = resolvedParams.id

  const { data: template, isLoading, error } = useTemplate(id)
  const deleteMutation = useDeleteTemplate()
  const archiveMutation = useArchiveTemplate()
  const publishMutation = usePublishTemplate()

  if (isLoading) {
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

  const canEdit = template.status === "DRAFT"
  const canDelete = template.status === "DRAFT" || template.status === "ARCHIVED"

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(template.id)
      router.push("/admin/templates")
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleArchive = async () => {
    try {
      await archiveMutation.mutateAsync(template.id)
      setArchiveDialog(false)
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handlePublish = async () => {
    try {
      await publishMutation.mutateAsync({ templateId: template.id })
    } catch (error) {
      // Error handled by mutation
    }
  }

  const getStatusBadge = () => {
    switch (template.status) {
      case "PUBLISHED":
        return <Badge className="bg-emerald-100 text-emerald-800">Published</Badge>
      case "DRAFT":
        return <Badge className="bg-amber-100 text-amber-800">Draft</Badge>
      case "ARCHIVED":
        return <Badge className="bg-slate-100 text-slate-800">Archived</Badge>
      default:
        return <Badge>{template.status}</Badge>
    }
  }

  const totalTaskDays = template.templateTasks.reduce((sum, task) => sum + task.durationDays, 0)

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/templates">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-slate-900">{template.title}</h1>
            {getStatusBadge()}
            {template.version > 1 && (
              <Badge variant="outline" className="text-xs">v{template.version}</Badge>
            )}
          </div>
          <p className="text-sm text-secondary-600">{template.shortDescription || template.description}</p>
        </div>
        <div className="flex items-center gap-2">
          {canEdit && (
            <Link href={`/admin/templates/${template.id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </Link>
          )}
          {template.status === "DRAFT" && (
            <>
              {!template.reviewerId && (
                <div className="text-right">
                  <p className="text-xs text-amber-600 font-medium mb-1">⚠️ No reviewer assigned</p>
                  <p className="text-xs text-secondary-500">Assign a reviewer before publishing</p>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handlePublish}
                disabled={publishMutation.isPending || !template.reviewerId}
              >
                {publishMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Eye className="h-4 w-4 mr-1" />
                )}
                Publish
              </Button>
            </>
          )}
          {template.status === "PUBLISHED" && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setArchiveDialog(true)}
              disabled={archiveMutation.isPending}
            >
              {archiveMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Archive className="h-4 w-4 mr-1" />
              )}
              Archive
            </Button>
          )}
          {canDelete && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-600 hover:text-red-700"
              onClick={() => setDeleteDialog(true)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Template Image */}
      {template.imageUrl && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <img 
              src={template.imageUrl} 
              alt={template.imageAlt || template.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </CardContent>
        </Card>
      )}

      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-secondary-600">Duration</p>
                <p className="font-semibold text-slate-900">{template.duration} weeks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-10 flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-secondary-600">Reviewer</p>
                <p className="font-semibold text-slate-900">
                  {template.reviewerId ? "Assigned" : "Not assigned"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <FileText className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-secondary-600">Total Tasks</p>
                <p className="font-semibold text-slate-900">{template.templateTasks.length} tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-secondary-600">Est. Days</p>
                <p className="font-semibold text-slate-900">{totalTaskDays} days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-secondary-600 mb-1">Category</p>
            <p className="text-slate-900">{template.category}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-secondary-600 mb-1">Difficulty</p>
            <Badge className={template.difficulty === "Beginner" ? "bg-green-100 text-green-800" : template.difficulty === "Intermediate" ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"}>
              {template.difficulty}
            </Badge>
          </div>
          <div>
            <p className="text-sm font-medium text-secondary-600 mb-1">Description</p>
            <p className="text-slate-900 whitespace-pre-wrap">{template.description}</p>
          </div>
          {template.figmaLink && (
            <div>
              <p className="text-sm font-medium text-secondary-600 mb-1">Figma/UI Link</p>
              <a 
                href={template.figmaLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {template.figmaLink}
              </a>
            </div>
          )}
          {template.skills.length > 0 && (
            <div>
              <p className="text-sm font-medium text-secondary-600 mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {template.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </div>
          )}
          {template.techStack && template.techStack.length > 0 && (
            <div>
              <p className="text-sm font-medium text-secondary-600 mb-2">Tech Stack</p>
              <div className="flex flex-wrap gap-2">
                {template.techStack.map((tech) => (
                  <Badge key={tech} variant="outline">{tech}</Badge>
                ))}
              </div>
            </div>
          )}
          {template.publishedAt && (
            <div>
              <p className="text-sm font-medium text-secondary-600 mb-1">Published At</p>
              <p className="text-slate-900">{new Date(template.publishedAt).toLocaleDateString()}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>Sequential tasks with estimated completion time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {template.templateTasks.map((task, index) => (
              <div key={task.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-semibold text-primary">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-slate-900">{task.title}</h4>
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {task.durationDays}d
                      </Badge>
                    </div>
                    <p className="text-sm text-secondary-600 whitespace-pre-wrap">{task.description}</p>
                    {task.dependsOnTaskId && (
                      <p className="text-xs text-secondary-500 mt-2">
                        Depends on previous task
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{template.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Archive Confirmation Dialog */}
      <AlertDialog open={archiveDialog} onOpenChange={setArchiveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to archive "{template.title}"? Archived templates are hidden from students but can be restored later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleArchive}>
              Archive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
