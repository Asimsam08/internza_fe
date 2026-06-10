"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/stores/authStore"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { InternzaLogo } from "@/components/brand/InternzaLogo"
import {
  Search,
  Settings,
  LogOut,
  LayoutDashboard,
  Users,
  FileCheck,
  Award,
  User,
  HelpCircle,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  FileText,
  Building2,
  Mail,
} from "lucide-react"

const adminNav = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Colleges", href: "/super-admin/colleges", icon: Building2 },
  { label: "Waitlist", href: "/admin/waitlist", icon: Mail },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Project Templates", href: "/admin/templates", icon: FileText },
  { label: "Reviews", href: "/admin/reviews", icon: FileCheck },
  { label: "Certificates", href: "/admin/certificates", icon: Award },
  { label: "Analytics", href: "/admin/analytics", icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const logout = useAuthStore((state) => state.logout)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // College admin routes use their own layout + auth (not super admin shell)
  const isCollegeAdminRoute = pathname?.startsWith("/admin/colleges/")

  const handleLogout = async () => {
    await logout()
  }

  if (isCollegeAdminRoute) {
    return <>{children}</>
  }

  return (
    <ProtectedRoute allowedRoles={['super_admin']}>
      <div className="flex h-screen bg-secondary-50">
      {/* Sidebar */}
      <div className={cn(
        "relative bg-white border-r border-secondary-200 flex flex-col transition-all duration-300",
        sidebarCollapsed ? "w-20" : "w-72"
      )}>
        {/* Logo */}
        <div className={cn(
          "flex h-16 items-center border-b border-secondary-100 shrink-0",
          sidebarCollapsed ? "px-2 justify-center" : "gap-3 px-4"
        )}>
          <Link
            href="/admin/dashboard"
            className={cn("flex items-center gap-2", sidebarCollapsed && "w-full justify-center")}
            aria-label="Go to dashboard"
          >
            {sidebarCollapsed ? <InternzaLogo variant="icon" className="h-10 w-10" /> : <InternzaLogo />}
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
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-secondary-400">
            Menu
          </p>
        )}
        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {adminNav.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      sidebarCollapsed ? "justify-center" : "gap-3",
                      isActive
                        ? "bg-primary-50 text-primary-900"
                        : "text-secondary-600 hover:bg-neutral-100"
                    )}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!sidebarCollapsed && item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-secondary-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
                <Input
                  placeholder="Search..."
                  className="w-80 pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm">Admin</span>
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem className="gap-2">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2">
                    <HelpCircle className="h-4 w-4" />
                    <span>Help & Support</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="gap-2 text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-secondary-50">
          {children}
        </main>
      </div>
    </div>
    </ProtectedRoute>
  )
}
