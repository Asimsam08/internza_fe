"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { ProofAuraLogo } from "@/components/brand/ProofAuraLogo"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { useAuthStore } from "@/stores/authStore"
import { useCurrentUser } from "@/lib/hooks/use-auth"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  FileCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  Building2,
} from "lucide-react"
import { resolveStorageUrl } from "@/lib/storage-url"

interface CollegeAdminShellProps {
  collegeId: string
  collegeName?: string
  collegeLogoUrl?: string | null
  children: React.ReactNode
}

export function CollegeAdminShell({
  collegeId,
  collegeName = "College",
  collegeLogoUrl,
  children,
}: CollegeAdminShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const logout = useAuthStore((s) => s.logout)
  const { data: user } = useCurrentUser()
  const [collapsed, setCollapsed] = useState(false)

  const logoSrc = resolveStorageUrl(collegeLogoUrl)

  const nav = [
    {
      name: "Overview",
      href: `/admin/colleges/${collegeId}`,
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: "Team",
      href: `/admin/colleges/${collegeId}/team`,
      icon: Users,
      exact: false,
    },
    {
      name: "Review queue",
      href: "/reviewer/dashboard",
      icon: FileCheck,
      exact: false,
    },
  ]

  const adminEmail = user?.email ?? "Admin"
  const displayCollege = collegeName || "College"

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  return (
    <ProtectedRoute allowedRoles={["college_admin", "super_admin"]}>
      <div className="flex h-screen min-h-screen bg-secondary-50">
        <aside
          className={cn(
            "relative flex flex-col border-r border-secondary-200 bg-white transition-all duration-300",
            collapsed ? "w-[72px]" : "w-64",
          )}
        >
          <header
            className={cn(
              "flex h-16 shrink-0 items-center border-b border-secondary-100",
              collapsed ? "justify-center px-2" : "gap-3 px-4",
            )}
          >
            <Link
              href={`/admin/colleges/${collegeId}`}
              className={cn("flex items-center gap-2 min-w-0", collapsed && "justify-center")}
            >
              {collapsed ? (
                logoSrc ? (
                  <Image src={logoSrc} alt="" width={36} height={36} className="rounded-lg object-cover" />
                ) : (
                  <ProofAuraLogo variant="icon" className="h-9 w-9" />
                )
              ) : (
                <>
                  {logoSrc ? (
                    <Image src={logoSrc} alt="" width={36} height={36} className="rounded-lg object-cover shrink-0" />
                  ) : (
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary">
                      <Building2 className="h-5 w-5" />
                    </span>
                  )}
                  <span className="min-w-0">
                    <span className="block text-xs text-secondary-500 truncate">College Admin</span>
                    <span className="block text-sm font-semibold text-secondary-900 truncate">{displayCollege}</span>
                  </span>
                </>
              )}
            </Link>
            {!collapsed && (
              <button
                type="button"
                onClick={() => setCollapsed(true)}
                className="ml-auto hidden lg:flex p-1.5 rounded-lg bg-secondary-100 text-secondary-600 hover:bg-secondary-200"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}
          </header>

          {collapsed && (
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              className="absolute -right-3 top-20 z-10 hidden lg:flex p-1.5 rounded-lg bg-white border shadow-sm text-secondary-600"
              aria-label="Expand sidebar"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}

          <nav className="flex-1 p-3 space-y-1">
            {!collapsed && (
              <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-secondary-400">Menu</p>
            )}
            {nav.map((item) => {
              const active = item.exact ? pathname === item.href : pathname?.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary-50 text-primary-900"
                      : "text-secondary-600 hover:bg-neutral-100",
                    collapsed && "justify-center px-2",
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && item.name}
                </Link>
              )
            })}
          </nav>

          <footer className="border-t border-secondary-100 p-3">
            <p
              className={cn(
                "flex items-center gap-2 text-xs text-secondary-500",
                collapsed ? "justify-center" : "px-2",
              )}
            >
              <GraduationCap className="h-3.5 w-3.5 shrink-0" />
              {!collapsed && <span className="truncate">Powered by ProofAura</span>}
            </p>
          </footer>
        </aside>

        <section className="flex flex-1 flex-col min-w-0 overflow-hidden">
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-secondary-200 bg-white px-4 sm:px-6">
            <article className="min-w-0">
              <p className="text-xs text-secondary-500">Placement portal</p>
              <h1 className="text-lg font-semibold text-secondary-900 truncate">{displayCollege}</h1>
            </article>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 max-w-[220px]">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="truncate text-sm hidden sm:inline">{adminEmail}</span>
                  <User className="h-4 w-4 shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem disabled className="text-xs text-secondary-500">
                  {adminEmail}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 text-red-600" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>

          <main className="flex-1 overflow-auto bg-secondary-50 p-4 sm:p-6 lg:p-8">{children}</main>
        </section>
      </div>
    </ProtectedRoute>
  )
}
