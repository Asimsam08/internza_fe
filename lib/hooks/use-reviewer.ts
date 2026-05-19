import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { toast } from 'sonner'

export interface ReviewerTask {
  id: string
  taskId: string
  student: {
    name: string
    email: string
    avatar: string | null
  }
  milestone: {
    title: string
    description: string
    internship: string
  }
  submittedAt: string
  submittedAtDate: string
  files: {
    name: string
    type: string
    size: string
    url: string
  }[]
  notes: string
  prLink: string
  commitHash: string
  status: 'pending' | 'in_progress'
}

export interface ReviewerProject {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  duration: number
  student: {
    name: string
    email: string
  }
  pendingTasks: number
  status: string
}

export interface ReviewerDashboardData {
  tasks: ReviewerTask[]
  stats: {
    total: number
    pending: number
    inProgress: number
    urgent: number
  }
}

export function useReviewerDashboard() {
  return useQuery({
    queryKey: ['reviewer-dashboard'],
    queryFn: async (): Promise<ReviewerDashboardData> => {
      const response = await api.get<{ data: ReviewerDashboardData }>('/students/reviewer/dashboard')
      return response.data
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  })
}

export function useReviewerProjects() {
  return useQuery({
    queryKey: ['reviewer-projects'],
    queryFn: async (): Promise<ReviewerProject[]> => {
      const response = await api.get<{ success: boolean; data: ReviewerProject[]; message: string; timestamp: string }>('/students/reviewer/projects')
      return response.data
    },
  })
}

export interface ReviewHistoryItem {
  id: string
  taskId: string
  student: {
    name: string
    email: string
    avatar: string | null
  }
  project: {
    id: string
    title: string
    duration: string
  }
  task: {
    title: string
    description: string
  }
  reviewedAt: string
  status: 'approved' | 'rejected' | 'changes_requested'
  reviewDuration: number
}

export function useReviewerHistory(projectId?: string, status?: string, projectTitle?: string) {
  return useQuery({
    queryKey: ['reviewer-history', projectId, status, projectTitle],
    queryFn: async (): Promise<ReviewHistoryItem[]> => {
      const params = new URLSearchParams()
      if (projectId) params.append('projectId', projectId)
      if (status && status !== 'all') params.append('status', status)
      if (projectTitle) params.append('projectTitle', projectTitle)

      const url = `/students/reviewer/history?${params.toString()}`
      const response = await api.get<{ success: boolean; data: ReviewHistoryItem[]; message: string; timestamp: string }>(url)
      return response.data
    },
  })
}

export function useApproveTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ taskId, feedback }: { taskId: string; feedback?: string }) => {
      const response = await api.post<{ success: boolean; data: { taskId: string; status: string; message: string }; message: string; timestamp: string }>('/students/tasks/approve', { taskId, feedback })
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviewer-dashboard'] })
      toast.success('Task approved successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to approve task")
    },
  })
}

export function useRejectTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ taskId, feedback }: { taskId: string; feedback?: string }) => {
      const response = await api.post<{ success: boolean; data: { taskId: string; status: string; message: string }; message: string; timestamp: string }>('/students/tasks/reject', { taskId, feedback })
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviewer-dashboard'] })
      toast.success('Task rejected')
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to reject task")
    },
  })
}
