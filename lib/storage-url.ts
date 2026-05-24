const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "http://localhost:3002"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET

/** Resolve storage path, legacy /uploads path, or full URL to a displayable image URL. */
export function resolveStorageUrl(path?: string | null): string | null {
  if (!path) return null
  if (path.startsWith("http")) return path
  if (path.startsWith("/uploads")) return `${API_BASE}${path}`
  if (SUPABASE_URL && SUPABASE_BUCKET) {
    return `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_BUCKET}/${path}`
  }
  return null
}
