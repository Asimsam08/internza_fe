// Navigation items for ProofAura MVP
// Only 3 roles: super_admin, reviewer, student

import { Permission, UserRole } from "@/lib/types"
import { 
  LayoutDashboard, 
  Briefcase, 
  CheckSquare, 
  Users, 
  Award, 
  Settings,
  FileCheck,
} from "lucide-react"

export interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  requiredPermission?: Permission
  requiredRoles?: UserRole[]
  badge?: string
}

// Student navigation - minimal and focused
const studentNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/internships", icon: Briefcase },
  { label: "My Tasks", href: "/milestones", icon: CheckSquare },
  { label: "Certificates", href: "/certificates", icon: Award },
]

// Reviewer navigation - focused on review work only
const reviewerNav: NavItem[] = [
  { label: "Dashboard", href: "/reviewer/dashboard", icon: LayoutDashboard },
  { label: "My Reviews", href: "/reviewer/assignments", icon: FileCheck, badge: "New" },
  { label: "Review History", href: "/reviewer/history", icon: CheckSquare },
  { label: "Browse Projects", href: "/reviewer/projects", icon: Briefcase },
]

// Super Admin navigation - complete platform oversight
const adminNav: NavItem[] = [
  { 
    label: "Dashboard", 
    href: "/admin/dashboard", 
    icon: LayoutDashboard,
  },
  { 
    label: "Projects", 
    href: "/admin/projects", 
    icon: Briefcase,
    requiredPermission: "create_project"
  },
  { 
    label: "Users", 
    href: "/admin/users", 
    icon: Users,
    requiredPermission: "manage_users"
  },
  { 
    label: "Review Queue", 
    href: "/admin/reviews", 
    icon: FileCheck,
    requiredPermission: "review_submissions"
  },
  { 
    label: "Certificates", 
    href: "/admin/certificates", 
    icon: Award,
    requiredPermission: "issue_certificate"
  },
  { 
    label: "Analytics", 
    href: "/admin/analytics", 
    icon: Settings,
    requiredPermission: "manage_users"
  },
]

export function getNavigationByRole(role: UserRole | null): NavItem[] {
  if (!role) return studentNav
  
  switch (role) {
    case "super_admin":
      return adminNav
    case "reviewer":
      return reviewerNav
    case "student":
    default:
      return studentNav
  }
}

export function filterNavByPermissions(
  navItems: NavItem[], 
  hasPermission: (p: Permission) => boolean
): NavItem[] {
  return navItems.filter(item => {
    if (item.requiredPermission && !hasPermission(item.requiredPermission)) {
      return false
    }
    return true
  })
}

// Quick actions for MVP
export interface QuickAction {
  label: string
  href: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  requiredPermission?: Permission
}

export const quickActions: QuickAction[] = [
  {
    label: "Submit Proof",
    href: "/submissions",
    description: "Upload work for review",
    icon: FileCheck,
  },
  {
    label: "Browse Projects",
    href: "/internships",
    description: "Find new opportunities",
    icon: Briefcase,
  },
  {
    label: "Review Work",
    href: "/reviewer",
    description: "Check student submissions",
    icon: CheckSquare,
    requiredPermission: "review_submissions",
  },
  {
    label: "Issue Certificate",
    href: "/certificates",
    description: "Certify completion",
    icon: Award,
    requiredPermission: "issue_certificate",
  },
]
