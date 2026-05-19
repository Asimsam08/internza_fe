const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "http://localhost:3002"

export interface CollegeBranding {
  id: string
  name: string
  logoUrl?: string | null
}

export function resolveCollegeLogoUrl(logoUrl?: string | null): string | null {
  if (!logoUrl) return null
  if (logoUrl.startsWith("http")) return logoUrl
  return `${API_BASE}${logoUrl}`
}
