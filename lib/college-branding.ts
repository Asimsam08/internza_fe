import { resolveStorageUrl } from "@/lib/storage-url"

export interface CollegeBranding {
  id: string
  name: string
  logoUrl?: string | null
}

export function resolveCollegeLogoUrl(logoUrl?: string | null): string | null {
  return resolveStorageUrl(logoUrl)
}
