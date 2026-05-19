import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, type ApiResponse } from '@/lib/api-client'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/api-client'
import type { StudentCohortContext } from '@/lib/cohort-labels'

export type { StudentCohortContext } from '@/lib/cohort-labels'

// Types
export interface PlanOption {
  durationType: string
  totalWeeks: number
  title: string
  description: string
  difficulty: string
  skills: string[]
  imageUrl?: string
}

export interface GetPlanOptionsResponse {
  plans: PlanOption[]
  hasActivePlan: boolean
  activePlanId?: string
}

export interface EnrollInPlanDto {
  durationType: string
  customWeeks?: number
  selectedProjectIds?: string[]
}

export interface ProjectTemplate {
  id: string
  title: string
  description: string
  shortDescription: string
  category: string
  difficulty: string
  duration: number
  skills: string[]
  imageUrl: string
  isPublished?: boolean
  createdAt?: string
}

export interface AvailableProjectsResponse {
  totalWeeks: number
  projectsByDuration: Record<number, ProjectTemplate[]>
  allowedCombinations: number[][]
}

export interface EnrollInPlanResponse {
  planId: string
  durationType: string
  totalWeeks: number
  startedAt: string
  message: string
}

export interface TaskTimeline {
  id: string
  projectId?: string
  title: string
  description: string
  order: number
  durationDays: number
  status: string
  startAt: string | null
  dueAt: string | null
  isOverdue: boolean
  isLocked: boolean
  submission?: {
    prLink: string
    commitHash?: string
    description?: string
    screenshots?: string[]
  }
  review?: {
    feedback?: string
  }
}

export interface ProjectInfo {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  duration: number
  order: number
  status: string
  isCompleted: boolean
  completedAt?: string
  startedAt?: string
}

export interface ProjectProgress {
  projectId: string
  projectName: string
  completedTasks: number
  totalTasks: number
  isCompleted: boolean
  approvalRate: number
}

export interface CurrentProject {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  duration: number
  status: string
  tasks: TaskTimeline[]
}

export interface DashboardWarning {
  type: string
  message: string
  severity: 'low' | 'medium' | 'high'
  count: number
}

export interface StudentDashboard {
  planId: string
  cohort?: StudentCohortContext | null
  durationType: string
  totalWeeks: number
  completedWeeks: number
  progressPercentage: number
  planStatus: string
  projects: ProjectInfo[]
  activeProject: ProjectInfo
  nextProject?: ProjectInfo
  projectProgress: ProjectProgress[]
  canUnlockNextProject: boolean
  startedAt: string
  currentProject?: CurrentProject
  currentTask?: TaskTimeline
  completedTaskCount: number
  overdueTaskCount: number
  dueSoonTaskCount: number
  lockedTaskCount: number
  warnings?: DashboardWarning[]
  nextAction: string
  taskTimeline: TaskTimeline[]
}

type StudentDashboardApiData =
  | StudentDashboard
  | {
      hasActivePlan: false
      message?: string
    }

// Single source of truth for the student's progress percentage.
// Derived from approved tasks so all UI surfaces (milestones, dashboard, sidebar)
// stay in sync regardless of how the backend computes its own `progressPercentage`.
export function getStudentProgressPercent(
  dashboard: Pick<StudentDashboard, 'completedTaskCount' | 'taskTimeline'> | null | undefined
): number {
  if (!dashboard) return 0
  const total = dashboard.taskTimeline?.length ?? 0
  if (total === 0) return 0
  return Math.round(((dashboard.completedTaskCount ?? 0) / total) * 100)
}

function isNoActivePlan(data: StudentDashboardApiData): data is { hasActivePlan: false; message?: string } {
  return (
    typeof data === 'object' &&
    data !== null &&
    'hasActivePlan' in data &&
    (data as Record<string, unknown>).hasActivePlan === false
  )
}

// Hooks
export function usePlanOptions() {
  return useQuery({
    queryKey: ['student', 'plan-options'],
    queryFn: async () => {
      try {
        const response = await api.get<ApiResponse<GetPlanOptionsResponse>>('/students/plans/options')
        // Unwrap the TransformInterceptor response
        return response.data || response
      } catch (error) {
        console.error('Failed to fetch plan options:', error)
        // Return fallback data so UI doesn't break
        return {
          plans: [],
          hasActivePlan: false,
        }
      }
    },
    retry: 1,
    retryDelay: 1000,
  })
}

export function useAvailableProjects(durationType: string) {
  return useQuery({
    queryKey: ['student', 'available-projects', durationType],
    queryFn: async () => {
      try {
        const response = await api.get<ApiResponse<AvailableProjectsResponse>>(`/students/plans/${durationType}/projects`)
        // Unwrap the TransformInterceptor response
        return response.data || response
      } catch (error) {
        console.error('Failed to fetch available projects:', error)
        // Return fallback data so UI doesn't break
        return {
          totalWeeks: 0,
          projectsByDuration: {},
          allowedCombinations: [],
        }
      }
    },
    enabled: !!durationType,
    retry: 1,
    retryDelay: 1000,
  })
}

export function useEnrollInPlan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: EnrollInPlanDto) => {
      const response = await api.post<ApiResponse<EnrollInPlanResponse>>('/students/plans/enroll', data)
      // Unwrap the TransformInterceptor response
      return response.data || response
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Enrolled successfully')
      // Invalidate queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['student', 'plan-options'] })
      queryClient.invalidateQueries({ queryKey: ['student', 'dashboard'] })
    },
    onError: (error) => {
      const message = getErrorMessage(error)
      // Show more user-friendly error for network issues
      if (message.includes('fetch') || message.includes('network') || message.includes('ECONNREFUSED')) {
        toast.error('Unable to connect to server. Please check your internet connection.')
      } else {
        toast.error(message)
      }
    },
  })
}

export function useStudentDashboard() {
  return useQuery({
    queryKey: ['student', 'dashboard'],
    queryFn: async () => {
      try {
        const response = await api.get<ApiResponse<StudentDashboardApiData>>('/students/dashboard')
        const data = response.data

        // Backend returns `{ hasActivePlan: false, message }` when no active plan exists.
        if (isNoActivePlan(data)) {
          return null
        }

        return data as StudentDashboard
      } catch (error) {
        console.error('Failed to fetch dashboard:', error)
        // Return null so UI can show "no plan / error" states
        return null
      }
    },
    retry: 1,
    retryDelay: 1000,
  })
}

export interface SubmitTaskDto {
  taskId: string
  prLink: string
  commitHash?: string
  description?: string
  screenshots?: string[]
}

export interface SubmitTaskResponse {
  taskId: string
  status: string
  message: string
}

export function useSubmitTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: SubmitTaskDto) => {
      const response = await api.post<ApiResponse<SubmitTaskResponse>>('/students/tasks/submit', data)
      return response.data || response
    },
    onSuccess: () => {
      toast.success('Task submitted successfully')
      // Invalidate dashboard to refetch updated task status
      queryClient.invalidateQueries({ queryKey: ['student', 'dashboard'] })
    },
    onError: (error) => {
      console.error('Failed to submit task:', error)
      toast.error('Failed to submit task', {
        description: getErrorMessage(error),
      })
    },
  })
}

export interface MilestoneData {
  id: string
  title: string
  description: string
  order: number
  isCompleted: boolean
  tasks: TaskTimeline[]
}

export function useMilestones() {
  return useQuery({
    queryKey: ['student', 'milestones'],
    queryFn: async () => {
      try {
        const response = await api.get<ApiResponse<{ milestones: MilestoneData[] }>>('/students/milestones')
        return response.data || { milestones: [] }
      } catch (error) {
        console.error('Failed to fetch milestones:', error)
        return { milestones: [] }
      }
    },
    retry: 1,
    retryDelay: 1000,
  })
}

export function useProjectTemplates() {
  return useQuery({
    queryKey: ['project', 'templates'],
    queryFn: async () => {
      try {
        const response = await api.get<ApiResponse<ProjectTemplate[]>>('/students/projects/templates')
        return response.data || []
      } catch (error) {
        console.error('Failed to fetch project templates:', error)
        return []
      }
    },
    retry: 1,
    retryDelay: 1000,
  })
}
