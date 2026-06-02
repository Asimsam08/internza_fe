const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api/v1'

export function getApiBaseUrl() {
  return API_BASE_URL
}

export function getSampleCertificatePreviewUrl(
  variant: 'cohort' | 'self-paced',
  collegeId?: string,
) {
  const path = variant === 'cohort' ? 'samples/cohort' : 'samples/self-paced'
  const params = new URLSearchParams({ inline: '1' })
  if (variant === 'cohort' && collegeId) params.set('collegeId', collegeId)
  return `${API_BASE_URL}/certificates/${path}?${params.toString()}`
}

export function getSampleCertificateDownloadUrl(
  variant: 'cohort' | 'self-paced',
  collegeId?: string,
) {
  const path = variant === 'cohort' ? 'samples/cohort' : 'samples/self-paced'
  if (variant === 'cohort' && collegeId) {
    return `${API_BASE_URL}/certificates/${path}?collegeId=${encodeURIComponent(collegeId)}`
  }
  return `${API_BASE_URL}/certificates/${path}`
}

export function getStudentCertificatePreviewUrl() {
  return `${API_BASE_URL}/students/certificate/preview`
}

export function getStudentCertificateDownloadUrl() {
  return `${API_BASE_URL}/students/certificate/download`
}

export function getCertificatesBulkDownloadUrl(collegeId: string, cohortId: string) {
  return `${API_BASE_URL}/admin/colleges/${collegeId}/cohorts/${cohortId}/certificates`
}

export function getVerifyCertificateUrl(verificationId: string) {
  return `${API_BASE_URL}/certificates/verify/${verificationId}`
}

export async function fetchPdfBlob(url: string, options?: { credentials?: RequestCredentials }) {
  const response = await fetch(url, {
    credentials: options?.credentials ?? 'include',
  })
  if (!response.ok) {
    throw new Error(`Failed to load PDF (${response.status})`)
  }
  return response.blob()
}

export function triggerBlobDownload(blob: Blob, filename: string) {
  const objectUrl = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = objectUrl
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(objectUrl)
}

export async function downloadPdfFromUrl(url: string, filename: string) {
  const blob = await fetchPdfBlob(url)
  triggerBlobDownload(blob, filename)
}
