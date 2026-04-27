"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api, getErrorMessage } from "@/lib/api-client"
import { toast } from "sonner"

// Types
export interface TemplateTask {
  id: string
  templateId: string
  title: string
  description: string
  order: number
  durationDays: number
  dependsOnTaskId?: string
  createdAt: string
  updatedAt: string
}

export interface ProjectTemplate {
  id: string
  title: string
  description: string
  shortDescription?: string
  category: string
  difficulty: string
  duration: number
  skills: string[]
  techStack?: string[]
  figmaLink?: string
  imageUrl?: string
  imagePublicId?: string
  imageAlt?: string
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
  publishedAt?: string
  version: number
  createdAt: string
  updatedAt: string
  reviewerId?: string
  templateTasks: TemplateTask[]
}

export interface CreateTemplateDto {
  title: string
  description: string
  shortDescription?: string
  category: string
  difficulty: string
  duration: number
  skills: string[]
  techStack?: string[]
  figmaLink?: string
  imageUrl?: string
  imagePublicId?: string
  imageAlt?: string
  tasks?: TemplateTaskDto[]
}

export interface TemplateTaskDto {
  title: string
  description: string
  order: number
  durationDays: number
  dependsOnTaskId?: string
}

export interface UpdateTemplateDto extends Partial<CreateTemplateDto> {}

export interface PublishTemplateDto {
  templateId: string
}

// Query keys
export const templateKeys = {
  all: ["templates"] as const,
  lists: () => [...templateKeys.all, "list"] as const,
  list: (includeDrafts: boolean) => [...templateKeys.lists(), includeDrafts] as const,
  details: () => [...templateKeys.all, "detail"] as const,
  detail: (id: string) => [...templateKeys.details(), id] as const,
}

/**
 * Hook to fetch all templates
 */
export function useTemplates(includeDrafts = false) {
  return useQuery({
    queryKey: templateKeys.list(includeDrafts),
    queryFn: async (): Promise<ProjectTemplate[]> => {
      const response: any = await api.get(`/admin/templates?includeDrafts=${includeDrafts}`)
      return response.data || response
    },
  })
}

/**
 * Hook to fetch a single template by ID
 */
export function useTemplate(id: string) {
  return useQuery({
    queryKey: templateKeys.detail(id),
    queryFn: async (): Promise<ProjectTemplate> => {
      const response: any = await api.get(`/admin/templates/${id}`)
      return response.data || response
    },
    enabled: !!id,
  })
}

/**
 * Hook to create a new template
 */
export function useCreateTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateTemplateDto): Promise<ProjectTemplate> => {
      const response: any = await api.post("/admin/templates", data)
      return response.data || response
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() })
      toast.success("Template created successfully", {
        description: `"${data.title}" has been saved as draft`,
      })
    },
    onError: (error: any) => {
      toast.error("Failed to create template", {
        description: getErrorMessage(error),
      })
    },
  })
}

/**
 * Hook to update a template
 */
export function useUpdateTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTemplateDto }): Promise<ProjectTemplate> => {
      const response: any = await api.put(`/admin/templates/${id}`, data)
      return response.data || response
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() })
      queryClient.invalidateQueries({ queryKey: templateKeys.detail(data.id) })
      toast.success("Template updated successfully", {
        description: `"${data.title}" has been updated`,
      })
    },
    onError: (error: any) => {
      toast.error("Failed to update template", {
        description: getErrorMessage(error),
      })
    },
  })
}

/**
 * Hook to publish a template
 */
export function usePublishTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: PublishTemplateDto): Promise<ProjectTemplate> => {
      const response: any = await api.post("/admin/templates/publish", data)
      return response.data || response
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() })
      queryClient.invalidateQueries({ queryKey: templateKeys.detail(data.id) })
      toast.success("Template published successfully", {
        description: `"${data.title}" is now visible to students`,
      })
    },
    onError: (error: any) => {
      toast.error("Failed to publish template", {
        description: getErrorMessage(error),
      })
    },
  })
}

/**
 * Hook to archive a template
 */
export function useArchiveTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<ProjectTemplate> => {
      const response: any = await api.post(`/admin/templates/${id}/archive`, {})
      return response.data || response
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() })
      queryClient.invalidateQueries({ queryKey: templateKeys.detail(data.id) })
      toast.success("Template archived successfully", {
        description: `"${data.title}" has been archived`,
      })
    },
    onError: (error: any) => {
      toast.error("Failed to archive template", {
        description: getErrorMessage(error),
      })
    },
  })
}

/**
 * Hook to delete a template
 */
export function useDeleteTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<{ message: string }> => {
      const response: any = await api.delete(`/admin/templates/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() })
      toast.success("Template deleted successfully")
    },
    onError: (error: any) => {
      toast.error("Failed to delete template", {
        description: getErrorMessage(error),
      })
    },
  })
}
