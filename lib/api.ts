import { useQuery } from "@tanstack/react-query"
import { Project, Milestone, VerificationProfile, ReviewTask, AdminDashboardStats, User, Batch, StudentProgress, Certificate } from "./types"
import { mockProjects, mockVerificationProfile, mockReviewTasks, mockAdminStats, mockUser, mockBatches, mockStudentProgress, mockCertificates } from "./mockData"

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Auth Hooks
export function useCurrentUser() {
  return useQuery<User>({
    queryKey: ["user"],
    queryFn: async () => {
      await delay(500)
      return mockUser
    },
  })
}

// Project Hooks
export function useProjects() {
  return useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      await delay(800)
      return mockProjects
    },
  })
}

export function useProject(id: string) {
  return useQuery<Project>({
    queryKey: ["project", id],
    queryFn: async () => {
      await delay(600)
      const project = mockProjects.find(i => i.id === id)
      if (!project) throw new Error("Project not found")
      return project
    },
    enabled: !!id,
  })
}

// Milestone Hooks
export function useMilestones(projectId: string) {
  return useQuery<Milestone[]>({
    queryKey: ["milestones", projectId],
    queryFn: async () => {
      await delay(700)
      const project = mockProjects.find(p => p.id === projectId)
      return project?.milestones || []
    },
    enabled: !!projectId,
  })
}

export function useMilestone(projectId: string, milestoneId: string) {
  return useQuery<Milestone>({
    queryKey: ["milestone", projectId, milestoneId],
    queryFn: async () => {
      await delay(400)
      const project = mockProjects.find(p => p.id === projectId)
      const milestone = project?.milestones.find(m => m.id === milestoneId)
      if (!milestone) throw new Error("Milestone not found")
      return milestone
    },
    enabled: !!projectId && !!milestoneId,
  })
}

// Verification Hooks
export function useVerificationProfile(id: string) {
  return useQuery<VerificationProfile>({
    queryKey: ["verification", id],
    queryFn: async () => {
      await delay(600)
      return mockVerificationProfile
    },
    enabled: !!id,
  })
}

// Reviewer Hooks
export function useReviewTasks() {
  return useQuery<ReviewTask[]>({
    queryKey: ["review-tasks"],
    queryFn: async () => {
      await delay(500)
      return mockReviewTasks
    },
  })
}

export function useReviewTask(id: string) {
  return useQuery<ReviewTask>({
    queryKey: ["review-task", id],
    queryFn: async () => {
      await delay(400)
      const task = mockReviewTasks.find(t => t.id === id)
      if (!task) throw new Error("Review task not found")
      return task
    },
    enabled: !!id,
  })
}

// Admin Hooks
export function useAdminStats() {
  return useQuery<AdminDashboardStats>({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      await delay(700)
      return mockAdminStats
    },
  })
}

// Batch Hooks
export function useBatches() {
  return useQuery<Batch[]>({
    queryKey: ["batches"],
    queryFn: async () => {
      await delay(600)
      return mockBatches
    },
  })
}

export function useBatch(id: string) {
  return useQuery<Batch>({
    queryKey: ["batch", id],
    queryFn: async () => {
      await delay(500)
      const batch = mockBatches.find(b => b.id === id)
      if (!batch) throw new Error("Batch not found")
      return batch
    },
    enabled: !!id,
  })
}

// Student Progress Hooks
export function useStudentProgress(studentId: string) {
  return useQuery<StudentProgress[]>({
    queryKey: ["student-progress", studentId],
    queryFn: async () => {
      await delay(500)
      return mockStudentProgress.filter(sp => sp.studentId === studentId)
    },
    enabled: !!studentId,
  })
}

// Certificate Hooks
export function useCertificates(studentId?: string) {
  return useQuery<Certificate[]>({
    queryKey: ["certificates", studentId],
    queryFn: async () => {
      await delay(600)
      if (studentId) {
        return mockCertificates.filter(c => c.studentId === studentId)
      }
      return mockCertificates
    },
  })
}

export function useCertificate(id: string) {
  return useQuery<Certificate>({
    queryKey: ["certificate", id],
    queryFn: async () => {
      await delay(400)
      const cert = mockCertificates.find(c => c.id === id)
      if (!cert) throw new Error("Certificate not found")
      return cert
    },
    enabled: !!id,
  })
}

// Legacy hooks for backward compatibility (deprecated)
export const useInternships = useProjects
export const useInternship = useProject
