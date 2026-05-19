/** Post-login / post-invite destination by role */
export function getHomeRouteForRole(
  role: string | undefined,
  collegeId?: string | null,
): string {
  const r = role?.trim()?.toLowerCase()
  if (r === "student") return "/dashboard"
  if (r === "reviewer") return "/reviewer/dashboard"
  if (r === "super_admin" || r === "superadmin") return "/admin/dashboard"
  if (r === "college_admin") {
    return collegeId ? `/admin/colleges/${collegeId}` : "/login"
  }
  return "/login"
}

/** College faculty and placement officers grade from the reviewer workspace */
export function getReviewerWorkspaceRoute(): string {
  return "/reviewer/dashboard"
}

export function canAccessReviewerWorkspace(role: string | undefined): boolean {
  const r = role?.trim()?.toLowerCase()
  return r === "reviewer" || r === "college_admin"
}
