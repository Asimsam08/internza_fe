import { useQuery } from '@tanstack/react-query'
import { api, unwrapApiData } from '@/lib/api-client'

export interface StudentCertificateMeta {
  available?: boolean
  issued: boolean
  eligible?: boolean
  planId?: string
  certificateId?: string
  verificationId?: string
  certificateUrl?: string | null
  issuedAt?: string
  status?: string
  variant?: 'cohort' | 'self-paced'
  cohortName?: string
  collegeName?: string
  downloadPath?: string
  previewPath?: string
  verifyPath?: string
  verifyUrl?: string
  verificationUrl?: string
  reviewerNames?: string
  message?: string
}

export function useStudentCertificate(enabled = true) {
  return useQuery({
    queryKey: ['student', 'certificate'],
    queryFn: async () => {
      const res = await api.get<{ data: StudentCertificateMeta } | StudentCertificateMeta>(
        '/students/certificate',
      )
      return unwrapApiData<StudentCertificateMeta>(res)
    },
    enabled,
    staleTime: 60_000,
  })
}

export interface VerifyCertificateResult {
  valid: boolean
  status: string
  certificateId: string
  verificationId?: string
  verificationUrl?: string
  studentName: string
  programName: string
  reviewerNames?: string
  durationLabel?: string
  skills?: string[]
  issuedAt: string
  variant: 'cohort' | 'self-paced'
  collegeName?: string
  cohortName?: string
}

export function useVerifyCertificate(verificationId: string | null) {
  return useQuery({
    queryKey: ['certificate', 'verify', verificationId],
    queryFn: async () => {
      if (!verificationId?.trim()) return null
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api/v1'}/certificates/verify/${encodeURIComponent(verificationId.trim())}`,
      )
      if (!res.ok) {
        throw new Error(`Certificate not found (${res.status})`)
      }
      const json = (await res.json()) as { data: VerifyCertificateResult } | VerifyCertificateResult
      return unwrapApiData<VerifyCertificateResult>(json)
    },
    enabled: !!verificationId?.trim(),
  })
}
