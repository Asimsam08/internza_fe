"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  FileText,
  Search,
  Eye,
  Edit,
  Trash2,
  Archive,
  Clock,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { useTemplates, useDeleteTemplate, useArchiveTemplate, usePublishTemplate } from "@/lib/hooks/use-templates"
import { useReviewers, useAssignReviewer, useUnassignReviewer } from "@/lib/hooks/use-admin"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
type TabValue = "all" | "draft" | "published" | "archived"

export default function AdminTemplatesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<TabValue>("all")
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; templateId: string; templateTitle: string }>({ open: false, templateId: "", templateTitle: "" })
  const [archiveDialog, setArchiveDialog] = useState<{ open: boolean; templateId: string; templateTitle: string }>({ open: false, templateId: "", templateTitle: "" })

  // Fetch templates including drafts
  const { data: templates = [], isLoading, error, refetch } = useTemplates(true)
  const { data: reviewers = [], isLoading: isLoadingReviewers } = useReviewers()
  const deleteMutation = useDeleteTemplate()
  const archiveMutation = useArchiveTemplate()
  const publishMutation = usePublishTemplate()
  const assignReviewerMutation = useAssignReviewer()
  const unassignReviewerMutation = useUnassignReviewer()

  // Filter templates based on search and tab
  const filteredTemplates = useMemo(() => {
    let filtered = templates

    // Filter by tab
    if (activeTab !== "all") {
      filtered = filtered.filter(t => t.status.toLowerCase() === activeTab)
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(template => {
        const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            template.category.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesSearch
      })
    }

    return filtered
  }, [templates, searchQuery, activeTab])

  // Calculate statistics
  const templateStats = useMemo(() => {
    const draft = templates.filter(t => t.status === "DRAFT").length
    const published = templates.filter(t => t.status === "PUBLISHED").length
    const archived = templates.filter(t => t.status === "ARCHIVED").length
    const totalTasks = templates.reduce((sum, t) => sum + t.templateTasks.length, 0)

    return {
      total: templates.length,
      draft,
      published,
      archived,
      totalTasks
    }
  }, [templates])

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(deleteDialog.templateId)
      setDeleteDialog({ open: false, templateId: "", templateTitle: "" })
    } catch {
      // Error handled by mutation
    }
  }

  const handleArchive = async () => {
    try {
      await archiveMutation.mutateAsync(archiveDialog.templateId)
      setArchiveDialog({ open: false, templateId: "", templateTitle: "" })
    } catch {
      // Error handled by mutation
    }
  }

  const handlePublish = async (templateId: string, _templateTitle: string) => {
    try {
      await publishMutation.mutateAsync({ templateId })
    } catch {
      // Error handled by mutation
    }
  }

  const handleAssignReviewer = async (templateId: string, reviewerId: string) => {
    if (reviewerId === "unassigned") {
      await unassignReviewerMutation.mutateAsync(templateId)
    } else {
      await assignReviewerMutation.mutateAsync({ templateId, reviewerId })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return <Badge className="bg-emerald-100 text-emerald-800">Published</Badge>
      case "DRAFT":
        return <Badge className="bg-amber-100 text-amber-800">Draft</Badge>
      case "ARCHIVED":
        return <Badge className="bg-slate-100 text-slate-800">Archived</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const canEdit = (status: string) => status === "DRAFT"
  const canDelete = (status: string) => status === "DRAFT" || status === "ARCHIVED"

  if (isLoading || isLoadingReviewers) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm text-secondary-600">Loading templates...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 flex items-center gap-4">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <div>
              <p className="font-medium text-red-900">Failed to load templates</p>
              <p className="text-sm text-red-700">Please try refreshing the page</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="ml-auto">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-primary">Project Templates</h1>
        <p className="text-sm text-secondary-600">Create and manage project templates</p>
      </div>

      {/* Template Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <FileText className="h-8 w-8 text-amber-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">{templateStats.total}</p>
            <p className="text-sm text-slate-600">Total</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <Eye className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">{templateStats.published}</p>
            <p className="text-sm text-slate-600">Published</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <Edit className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">{templateStats.draft}</p>
            <p className="text-sm text-slate-600">Drafts</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <Archive className="h-8 w-8 text-slate-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">{templateStats.archived}</p>
            <p className="text-sm text-slate-600">Archived</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">{templateStats.totalTasks}</p>
            <p className="text-sm text-slate-600">Total Tasks</p>
          </CardContent>
        </Card>
      </div>

      {/* Template Management */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Project Templates</CardTitle>
              <CardDescription>Search and manage project templates</CardDescription>
            </div>
            <Link href="/admin/templates/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Template
              </Button>
            </Link>
          </div>
          
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({templateStats.total})</TabsTrigger>
              <TabsTrigger value="draft">Drafts ({templateStats.draft})</TabsTrigger>
              <TabsTrigger value="published">Published ({templateStats.published})</TabsTrigger>
              <TabsTrigger value="archived">Archived ({templateStats.archived})</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
            <Input
              placeholder="Search templates by title, description, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-secondary-300 mx-auto mb-4" />
              <p className="text-sm text-secondary-600 mb-4">
                {searchQuery ? "No templates match your search" : "No templates found"}
              </p>
              {!searchQuery && (
                <Link href="/admin/templates/new">
                  <Button variant="outline" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Your First Template
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTemplates.map((template) => {
                const assignedReviewer = reviewers.find(r => r.reviewerProfile?.id === template.reviewerId)
                const isMutating = assignReviewerMutation.isPending || unassignReviewerMutation.isPending

                return (
                  <div
                    key={template.id}
                    className="flex flex-col lg:flex-row lg:items-center justify-between p-4 hover:bg-secondary-50 rounded-lg transition-colors border border-secondary-100 gap-4"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      {/* Template Image or Fallback */}
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {template.imageUrl ? (
                          <img
                            src={template.imageUrl}
                            alt={template.imageAlt || template.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <FileText className="h-6 w-6 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-medium text-secondary-900 truncate">{template.title}</h3>
                          {getStatusBadge(template.status)}
                          {template.version > 1 && (
                            <Badge variant="outline" className="text-xs">v{template.version}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-secondary-600 mb-2 line-clamp-1">{template.shortDescription || template.description}</p>
                        <div className="flex items-center gap-4 text-xs text-secondary-500 flex-wrap">
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {template.templateTasks.length} tasks
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {template.duration} weeks
                          </span>
                          <span>{template.difficulty}</span>
                          <span>{template.category}</span>
                        </div>
                      </div>
                    </div>

                    {/* Reviewer Assignment */}
                    <div className="flex items-center gap-2 lg:ml-4">
                      <div className="text-right mr-2 hidden sm:block">
                        <p className="text-xs font-medium text-slate-600">Reviewer:</p>
                        <p className="text-sm text-slate-900">{assignedReviewer?.name || "Unassigned"}</p>
                      </div>
                      <Select
                        value={template.reviewerId || "unassigned"}
                        onValueChange={(value) => handleAssignReviewer(template.id, value)}
                        disabled={isMutating}
                      >
                        <SelectTrigger className="w-[160px] h-9 text-sm border-secondary-200">
                          <SelectValue placeholder="Assign..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned">
                            <span className="text-secondary-500">- Unassigned -</span>
                          </SelectItem>
                          {reviewers.map((reviewer) => (
                            <SelectItem key={reviewer.reviewerProfile?.id || reviewer.id} value={reviewer.reviewerProfile?.id || reviewer.id}>
                              {reviewer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/admin/templates/${template.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {canEdit(template.status) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/admin/templates/${template.id}/edit`)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      )}
                      {template.status === "DRAFT" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePublish(template.id, template.title)}
                          disabled={publishMutation.isPending || !template.reviewerId}
                        >
                          {publishMutation.isPending ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <Eye className="h-4 w-4 mr-1" />
                          )}
                          Publish
                        </Button>
                      )}
                      {template.status === "PUBLISHED" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setArchiveDialog({ open: true, templateId: template.id, templateTitle: template.title })}
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
                      {canDelete(template.status) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => setDeleteDialog({ open: true, templateId: template.id, templateTitle: template.title })}
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
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteDialog.templateTitle}"? This action cannot be undone.
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
      <AlertDialog open={archiveDialog.open} onOpenChange={(open) => setArchiveDialog({ ...archiveDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to archive "{archiveDialog.templateTitle}"? Archived templates are hidden from students but can be restored later.
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
