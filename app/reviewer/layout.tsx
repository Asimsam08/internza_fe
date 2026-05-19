"use client"

import * as React from "react"
import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { InternzaLogo } from "@/components/brand/InternzaLogo"
import {
  CheckCircle,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
  Bell,
  Inbox,
  FolderKanban,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/authStore"
import { useCurrentUser } from "@/lib/hooks/use-auth"
import { useReviewerProjects } from "@/lib/hooks/use-reviewer"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { resolveCollegeLogoUrl, type CollegeBranding } from "@/lib/college-branding"
import { Building2 } from "lucide-react"

export default function ReviewerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const logout = useAuthStore((state) => state.logout)
  const { data: user } = useCurrentUser()
  const { data: projects } = useReviewerProjects()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Extract reviewer name from profile
  const reviewerName = user?.reviewerProfile
    ? `${user.reviewerProfile.firstName} ${user.reviewerProfile.lastName}`.trim()
    : user?.name || "Reviewer"

  const reviewerFirstName = user?.reviewerProfile
    ? user.reviewerProfile.firstName
    : user?.name?.split(' ')[0] || "Reviewer"

  const normalizedRole = user?.role?.trim()?.toLowerCase()
  const isCollegeScoped =
    normalizedRole === "reviewer" || normalizedRole === "college_admin"
  const college = (user as { college?: CollegeBranding | null })?.college
  const collegeLogo = resolveCollegeLogoUrl(college?.logoUrl)
  const roleLabel =
    normalizedRole === "college_admin"
      ? "Placement · Reviewer"
      : normalizedRole === "reviewer"
        ? "Faculty Reviewer"
        : "Reviewer"
  const adminHome =
    normalizedRole === "college_admin" && user?.collegeId
      ? `/admin/colleges/${user.collegeId}`
      : null

  const handleLogout = async () => {
    await logout()
  }

  const navigation = [
    {
      name: "Dashboard",
      href: "/reviewer/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Review History",
      href: "/reviewer/history",
      icon: CheckCircle,
    },
    {
      name: "My Assignments",
      href: "/reviewer/projects",
      icon: Briefcase,
    },
  ]

  return (
    <ProtectedRoute allowedRoles={['reviewer', 'college_admin']}>
      <div className="min-h-screen bg-neutral-100">
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside
          className={cn(
            "relative border-r border-secondary-200 bg-white transition-all duration-300 flex flex-col",
            sidebarCollapsed ? "w-20" : "w-64"
          )}
        >
          <div className={cn(
            "flex h-16 items-center border-b border-secondary-100 shrink-0",
            sidebarCollapsed ? "px-2 justify-center" : "gap-3 px-4"
          )}>
            <Link
              href="/reviewer/dashboard"
              className={cn("flex items-center gap-2 min-w-0", sidebarCollapsed && "w-full justify-center")}
              aria-label="Go to dashboard"
            >
              {isCollegeScoped && collegeLogo ? (
                sidebarCollapsed ? (
                  <Image src={collegeLogo} alt="" width={40} height={40} className="rounded-lg object-cover h-10 w-10" />
                ) : (
                  <>
                    <Image src={collegeLogo} alt="" width={36} height={36} className="rounded-lg object-cover shrink-0" />
                    <span className="min-w-0">
                      <span className="block text-xs text-secondary-500 truncate">{college?.name}</span>
                      <span className="block text-sm font-semibold text-secondary-900 truncate">Review queue</span>
                    </span>
                  </>
                )
              ) : sidebarCollapsed ? (
                <InternzaLogo variant="icon" className="h-10 w-10" />
              ) : (
                <InternzaLogo />
              )}
            </Link>
            {!sidebarCollapsed && (
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:flex ml-auto p-1.5 rounded-lg bg-secondary-100 text-secondary-600 hover:bg-secondary-200 transition-colors"
                title="Collapse sidebar"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}
          </div>
          {sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex absolute -right-3 top-[5%] p-1.5 rounded-lg bg-secondary-100 text-secondary-600 hover:bg-secondary-200 transition-colors z-20 shadow-md"
              title="Expand sidebar"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
          {!sidebarCollapsed && (
            <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-wider text-secondary-400 shrink-0">
              Menu
            </p>
          )}
          <nav className="p-4 flex-1 overflow-y-auto">
            {adminHome ? (
              <Link
                href={adminHome}
                className={cn(
                  "mb-3 flex items-center rounded-lg px-3 py-2 text-sm font-medium text-secondary-600 hover:bg-neutral-100",
                  sidebarCollapsed ? "justify-center" : "gap-2",
                )}
                title={sidebarCollapsed ? "College admin" : undefined}
              >
                <Building2 className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && <span>College admin</span>}
              </Link>
            ) : null}
            <ul className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        sidebarCollapsed ? "justify-center" : "gap-3",
                        isActive
                          ? "bg-primary/5 text-primary"
                          : "text-secondary-600 hover:bg-neutral-100"
                      )}
                      title={sidebarCollapsed ? item.name : undefined}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!sidebarCollapsed && item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>

            {!sidebarCollapsed && projects && projects.length > 0 && (
              <div className="mt-6">
                <div className="mb-3 px-3 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-secondary-400">
                    My Assignments
                  </p>
                  {projects.length > 5 && (
                    <Link
                      href="/reviewer/projects"
                      className="text-xs text-primary hover:underline"
                    >
                      View All
                    </Link>
                  )}
                </div>
                <ul className="space-y-1 max-h-[300px] overflow-y-auto">
                  {projects.slice(0, 5).map((project) => (
                    <li key={project.id}>
                      <Link
                        href={`/reviewer/dashboard`}
                        className="flex items-start gap-2 rounded-lg px-3 py-2 text-sm transition-colors text-secondary-600 hover:bg-neutral-100"
                      >
                        <FolderKanban className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{project.title}</p>
                          <p className="text-xs text-secondary-500 truncate">{project.student.name}</p>
                          {project.pendingTasks > 0 && (
                            <Badge variant="secondary" className="mt-1 text-[10px] h-5">
                              {project.pendingTasks} pending
                            </Badge>
                          )}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Header */}
          <header className="flex h-16 items-center justify-between border-b border-secondary-200 bg-white px-4 lg:px-8 shrink-0">
            <div className="flex items-center gap-4 lg:gap-8">
              <div className="relative hidden sm:block">
                <input
                  type="text"
                  placeholder="Search proofs..."
                  className="h-9 w-48 lg:w-64 rounded-lg border border-secondary-200 bg-neutral-100 pl-4 pr-4 text-sm focus:border-secondary-300 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 lg:gap-4">
              <button className="relative rounded-lg p-2 text-secondary-500 hover:bg-secondary-50 hidden sm:block">
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
                <Bell className="h-5 w-5" />
              </button>
              <button className="relative rounded-lg p-2 text-secondary-500 hover:bg-secondary-50 hidden sm:block">
                <Inbox className="h-5 w-5" />
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 border-l border-secondary-200 pl-4 pr-2 py-2 h-auto hover:bg-secondary-50"
                  >
                    <div className="relative h-8 w-8 overflow-hidden rounded-full ring-2 ring-white">
                      <Image
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop"
                        alt="Reviewer"
                        width={32}
                        height={32}
                        className="h-8 w-8 object-cover"
                      />
                    </div>
                    <div className="hidden text-left lg:block">
                      <p className="text-sm font-semibold text-secondary-900 leading-5">
                        {reviewerFirstName}
                      </p>
                      <p className="text-xs text-secondary-500 leading-4">
                        {roleLabel}
                      </p>
                    </div>
                    <ChevronDown className="hidden lg:block h-4 w-4 text-secondary-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72 p-0">
                  <div className="p-3 border-b border-secondary-100">
                    <div className="flex items-start gap-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-white">
                        <Image
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop"
                          alt="Reviewer"
                          width={40}
                          height={40}
                          className="h-10 w-10 object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold text-secondary-900">
                            {reviewerName}
                          </p>
                          <Badge variant="secondary" className="h-5 px-2 text-[11px] font-semibold">
                            {roleLabel}
                          </Badge>
                        </div>
                        {user?.email ? (
                          <p className="mt-0.5 truncate text-xs font-medium text-secondary-500">
                            {user.email}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="p-1">
                    <DropdownMenuItem
                      className="gap-2"
                      onSelect={(e) => {
                        e.preventDefault()
                        router.push("/settings")
                      }}
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="gap-2"
                      onSelect={(e) => {
                        e.preventDefault()
                        router.push("/settings")
                      }}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="gap-2 text-red-600"
                      onSelect={(e) => {
                        e.preventDefault()
                        handleLogout()
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-8">
            <div className="max-w-7xl mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  )
}
