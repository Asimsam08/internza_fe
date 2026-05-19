"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api, apiUpload } from "@/lib/api-client"
import { toast } from "sonner"

export interface CollegeTeamAdmin {
  id: string
  email: string
}

export interface CollegeTeamReviewer {
  id: string
  email: string
  reviewerProfile?: {
    firstName: string
    lastName: string
    isAvailable?: boolean
  }
}

export interface CollegeTemplateOption {
  id: string
  title: string
  duration: number
}

export interface CollegeReviewerOption {
  id: string
  email: string
}

function unwrapData<T>(res: T | { data: T }): T {
  if (res && typeof res === "object" && "data" in res && (res as { data: T }).data !== undefined) {
    return (res as { data: T }).data
  }
  return res as T
}

export function useCollegeDashboard(collegeId: string) {
  return useQuery({
    queryKey: ["college-admin", collegeId, "dashboard"],
    queryFn: async () => {
      const res = await api.get<{
        data: { college?: { name?: string; logoUrl?: string | null }; stats?: Record<string, unknown> }
      }>(`/admin/colleges/${collegeId}`)
      return res.data
    },
    enabled: !!collegeId,
  })
}

export interface CohortListItem {
  id: string
  name: string
  planTitle: string
  progressLabel: string
  status: string
  studentsTotal: number
  needsLaunch: boolean
  startDate?: string
  endDate?: string
}

export function useCollegeCohorts(collegeId: string) {
  return useQuery({
    queryKey: ["college-admin", collegeId, "cohorts"],
    queryFn: async () => {
      const res = await api.get<{ data: CohortListItem[] }>(`/admin/colleges/${collegeId}/cohorts`)
      return res.data
    },
    enabled: !!collegeId,
  })
}

export function useCollegeTemplatesFor(collegeId: string) {
  return useQuery({
    queryKey: ["college-admin", collegeId, "templates"],
    queryFn: async (): Promise<CollegeTemplateOption[]> => {
      const res = await api.get<{ data: CollegeTemplateOption[] }>(`/admin/colleges/${collegeId}/templates`)
      return res.data ?? []
    },
    enabled: !!collegeId,
  })
}

export function useCollegeReviewers(collegeId: string) {
  return useQuery({
    queryKey: ["college-admin", collegeId, "reviewers"],
    queryFn: async (): Promise<CollegeReviewerOption[]> => {
      const res = await api.get<{ data: CollegeReviewerOption[] }>(`/admin/colleges/${collegeId}/reviewers`)
      return res.data ?? []
    },
    enabled: !!collegeId,
  })
}

export function useCollegeTeam(collegeId: string) {
  return useQuery({
    queryKey: ["college-admin", collegeId, "team"],
    queryFn: async () => {
      const res = await api.get<{
        data: { admins: CollegeTeamAdmin[]; reviewers: CollegeTeamReviewer[] }
      }>(`/admin/colleges/${collegeId}/team`)
      return res.data
    },
    enabled: !!collegeId,
  })
}

export function useCreateCohort(collegeId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      api.post(`/admin/colleges/${collegeId}/cohorts`, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["college-admin", collegeId] })
      toast.success("Cohort created")
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export interface StudentCredential {
  email: string
  name: string
  temporaryPassword?: string
  isNewAccount: boolean
  emailSent: boolean
}

export interface ImportCohortResult {
  enrolled: number
  skipped: number
  credentials?: StudentCredential[]
  loginUrl?: string
}

export function useImportCohortCsv(collegeId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ cohortId, file }: { cohortId: string; file: File }): Promise<ImportCohortResult> => {
      const fd = new FormData()
      fd.append("file", file)
      const res = await apiUpload<{ data: ImportCohortResult } | ImportCohortResult>(
        `/admin/colleges/${collegeId}/cohorts/${cohortId}/students/csv`,
        fd,
      )
      const payload = unwrapData(res)
      return {
        ...payload,
        loginUrl: payload.loginUrl ?? `${typeof window !== "undefined" ? window.location.origin : ""}/login`,
      }
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["college-admin", collegeId] })
      toast.success(`Cohort launched — ${data.enrolled} student(s) enrolled`)
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useIssueStudentCredentials(collegeId: string) {
  return useMutation({
    mutationFn: async (cohortId: string) => {
      const res = await api.post<
        { data: { credentials: StudentCredential[]; loginUrl: string } } | {
          credentials: StudentCredential[]
          loginUrl: string
        }
      >(`/admin/colleges/${collegeId}/cohorts/${cohortId}/students/issue-credentials`, {})
      const payload = unwrapData(res)
      return {
        credentials: payload.credentials ?? [],
        loginUrl: payload.loginUrl ?? `${typeof window !== "undefined" ? window.location.origin : ""}/login`,
      }
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function useInviteReviewer(collegeId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (email: string) =>
      api.post(`/admin/colleges/${collegeId}/team/reviewers/invite`, { email }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["college-admin", collegeId, "team"] })
      toast.success("Reviewer invite sent — they will be added to all cohorts when they accept")
    },
    onError: (e: Error) => toast.error(e.message),
  })
}

export function getCertificatesDownloadUrl(collegeId: string, cohortId: string) {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api/v1"
  return `${base}/admin/colleges/${collegeId}/cohorts/${cohortId}/certificates`
}
