"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { InternzaLogo } from "@/components/brand/InternzaLogo"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CurrentWorkWidget } from "@/components/dashboard/CurrentWorkWidget"
import { mockProjectTemplates } from "@/lib/mockData"
import { useAuthStore } from "@/stores/authStore"
import { useCurrentUser } from "@/lib/hooks/use-auth"
import { useStudentDashboard } from "@/lib/hooks/use-student"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { 
  LayoutDashboard, 
  Briefcase, 
  Flag, 
  Upload, 
  Award, 
  Settings,
  HelpCircle,
  LogOut,
  Search,
  Bell,
  ChevronDown,
  Menu,
  X,
  Command,
  ChevronLeft,
  ChevronRight,
  User,
  CreditCard,
  Laptop2Icon
} from "lucide-react"
import { useState, useEffect, useRef } from "react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  // { name: "Internships", href: "/internship", icon: Briefcase },
  { name: "Milestones", href: "/milestones", icon: Flag },
  { name: "Projects", href: "/projects", icon: Laptop2Icon },
  // { name: "Milestones", href: "/milestones", icon: Flag },
  { name: "Submissions", href: "/submissions", icon: Upload },
  { name: "Verification", href: "/verification", icon: Award },
]

const bottomNavigation = [
  { name: "Support", href: "/support", icon: HelpCircle },
]

const allNavigation = [...navigation, ...bottomNavigation]

// Search result type
interface SearchResult {
  id: string
  title: string
  category: string
  type: "internship" | "milestone" | "page"
  href: string
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const logout = useAuthStore((state) => state.logout)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { data: dashboard, isLoading: dashboardLoading } = useStudentDashboard()
  const { data: user } = useCurrentUser()

  useEffect(() => {
    setMounted(true)
  }, [])

  const currentNavItem =
    allNavigation.find((item) => pathname === item.href) ??
    allNavigation.find((item) => item.href !== "/dashboard" && pathname.startsWith(item.href + "/")) ??
    allNavigation.find((item) => item.href === "/dashboard" && pathname === "/dashboard")

  const pageTitle = currentNavItem?.name ?? "Dashboard"
  const currentUser = user

  // Extract first name from studentProfile or use name field
  const userFirstName = currentUser?.studentProfile?.firstName || currentUser?.name?.split(' ')[0] || "User"

  const userName = currentUser?.studentProfile?.firstName || currentUser?.name?.split(' ')[0] || "User"

  // Normalize role for comparison
  const normalizedRole = currentUser?.role?.trim()?.toLowerCase()

  const roleLabel =
    normalizedRole === "student"
      ? "Student"
      : normalizedRole === "reviewer"
        ? "Reviewer"
        : normalizedRole === "super_admin"
          ? "Admin"
          : "User"
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const searchRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Handle search
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      const results: SearchResult[] = []
      
      // Search templates as internships (MVP)
      mockProjectTemplates.forEach((template) => {
        if (
          template.title.toLowerCase().includes(query) ||
          template.category.toLowerCase().includes(query) ||
          template.skills.some((skill) => skill.toLowerCase().includes(query))
        ) {
          results.push({
            id: template.id,
            title: template.title,
            category: template.category,
            type: "internship",
            href: `/internships/${template.id}`
          })
        }
      })
      
      // Search pages
      navigation.forEach(item => {
        if (item.name.toLowerCase().includes(query)) {
          results.push({
            id: item.href,
            title: item.name,
            category: "Page",
            type: "page",
            href: item.href
          })
        }
      })
      
      setSearchResults(results.slice(0, 8))
      setShowSearchResults(true)
      setSelectedIndex(0)
    } else {
      setSearchResults([])
      setShowSearchResults(false)
    }
  }, [searchQuery])

  // Close search results on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Keyboard navigation for search
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSearchResults) return
    
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex(prev => (prev + 1) % searchResults.length)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex(prev => (prev - 1 + searchResults.length) % searchResults.length)
    } else if (e.key === "Enter" && searchResults[selectedIndex]) {
      e.preventDefault()
      handleSearchSelect(searchResults[selectedIndex])
    } else if (e.key === "Escape") {
      setShowSearchResults(false)
      searchInputRef.current?.blur()
    }
  }

  const handleSearchSelect = (result: SearchResult) => {
    setShowSearchResults(false)
    setSearchQuery("")
    router.push(result.href)
  }

  const handleLogout = async () => {
    await logout()
  }

  const isActiveLink = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/internship"
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="flex h-screen bg-neutral-100">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex-col border-r border-secondary-200 bg-white transition-all duration-300 lg:static lg:translate-x-0",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        sidebarCollapsed ? "w-20" : "w-72"
      )}>
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-secondary-100 px-4">
          <Link
            href="/dashboard"
            className={cn("flex items-center gap-2", sidebarCollapsed && "w-full justify-center")}
            aria-label="Go to dashboard"
          >
            {sidebarCollapsed ? <InternzaLogo variant="icon" className="h-10 w-10" /> : <InternzaLogo />}
          </Link>
          <button 
            className="ml-auto lg:hidden p-2 text-secondary-600 hover:text-primary"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
          {/* Collapse toggle - desktop only */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex ml-auto p-1.5 rounded-lg bg-secondary-100 text-secondary-600 hover:bg-secondary-200 transition-colors"
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          {!sidebarCollapsed && (
            <p className="mb-2 px-3 pt-1 text-xs font-semibold uppercase tracking-wider text-secondary-400">
              Menu
            </p>
          )}
          <ul className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = isActiveLink(item.href)
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "group flex items-center rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
                      sidebarCollapsed ? "justify-center" : "gap-3",
                      isActive
                        ? "bg-primary/5 text-primary"
                        : "text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900"
                    )}
                    title={sidebarCollapsed ? item.name : undefined}
                  >
                    <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary" : "text-secondary-500 group-hover:text-secondary-700")} />
                    {!sidebarCollapsed && (
                      <>
                        {item.name}
                        <span
                          className={cn(
                            "ml-auto h-1.5 w-1.5 rounded-full",
                            isActive ? "bg-primary" : "bg-transparent"
                          )}
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Current Work Widget */}
        {!sidebarCollapsed && (
          <div className="px-3 pb-3">
            <CurrentWorkWidget
              dashboard={dashboard ?? null}
              isLoading={dashboardLoading}
              onGoToMilestones={() => router.push("/milestones")}
            />
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="border-t border-secondary-100 p-3">
          <ul className="space-y-1">
            {bottomNavigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "group flex items-center rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                      sidebarCollapsed ? "justify-center" : "gap-3",
                      isActive
                        ? "bg-primary/5 text-primary"
                        : "text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900"
                    )}
                    title={sidebarCollapsed ? item.name : undefined}
                  >
                    <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary" : "text-secondary-500 group-hover:text-secondary-700")} />
                    {!sidebarCollapsed && item.name}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Sidebar profile */}
          <div className="mt-3 pt-3 border-t border-secondary-100">
            {sidebarCollapsed ? (
              <Link
                href="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center rounded-lg p-2 hover:bg-secondary-50 transition-colors"
                title={`${mounted ? (currentUser?.name || "User") : "User"} · ${roleLabel}`}
                aria-label="Open settings"
              >
                <div className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-white">
                  <Image
                    src={mounted ? (currentUser?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop") : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop"}
                    alt="Profile"
                    width={36}
                    height={36}
                    className="h-9 w-9 object-cover"
                  />
                </div>
              </Link>
            ) : (
              <div className="flex items-center gap-3 rounded-xl border border-secondary-100 bg-secondary-50 px-3 py-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-white">
                  <Image
                    src={mounted ? (currentUser?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop") : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop"}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="h-10 w-10 object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-secondary-900">
                    {mounted ? userFirstName : "User"}
                  </div>
                  <div className="mt-0.5 flex items-center gap-2">
                    <Badge variant="secondary" className="h-5 px-2 text-[11px] font-semibold">
                      {roleLabel}
                    </Badge>
                    {mounted && currentUser?.email ? (
                      <span className="truncate text-xs font-medium text-secondary-500">
                        {currentUser.email}
                      </span>
                    ) : null}
                  </div>
                </div>
                <Link href="/settings" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Settings className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center gap-3 border-b border-secondary-200 bg-white px-4 lg:px-6">
          {/* Left: menu + page title */}
          <div className="flex items-center gap-2 min-w-0">
            <button 
              className="lg:hidden p-2 text-secondary-600 hover:text-primary"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="hidden sm:block min-w-0">
              <div className="text-sm font-semibold text-secondary-900 truncate">{pageTitle}</div>
            </div>
            
          </div>

          {/* Middle: search */}
          <div className="flex-1" />
          <div className="relative hidden md:block" ref={searchRef}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
                <Command className="absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 text-secondary-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search internships, pages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
                  className="h-10 w-[22rem] rounded-lg border border-secondary-200 bg-secondary-50 pl-10 pr-10 text-sm text-secondary-700 placeholder:text-secondary-400 focus:border-primary/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
              
              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 rounded-lg border border-secondary-200 bg-white shadow-xl animate-scale-in overflow-hidden z-50">
                  <div className="max-h-80 overflow-y-auto py-2">
                    {searchResults.map((result, index) => (
                      <button
                        key={result.id}
                        onClick={() => handleSearchSelect(result)}
                        className={cn(
                          "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors",
                          index === selectedIndex 
                            ? "bg-primary/5 text-primary" 
                            : "text-secondary-700 hover:bg-secondary-50"
                        )}
                      >
                        <div className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                          result.type === "internship" ? "bg-accent/10" : 
                          result.type === "milestone" ? "bg-primary/10" : "bg-secondary-100"
                        )}>
                          {result.type === "internship" && <Briefcase className="h-4 w-4 text-accent" />}
                          {result.type === "milestone" && <Flag className="h-4 w-4 text-primary" />}
                          {result.type === "page" && <LayoutDashboard className="h-4 w-4 text-secondary-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{result.title}</p>
                          <p className="text-xs text-secondary-500">{result.category}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* No Results */}
              {showSearchResults && searchQuery.trim() && searchResults.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 rounded-lg border border-secondary-200 bg-white shadow-xl p-4 text-center">
                  <p className="text-sm text-secondary-500">No results found for &quot;{searchQuery}&quot;</p>
                </div>
              )}
            </div>

          {/* Right: actions + profile */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Mobile Search Toggle */}
            <button className="md:hidden p-2 text-secondary-500 hover:bg-secondary-50 rounded-lg">
              <Search className="h-5 w-5" />
            </button>
            
            {/* Notifications */}
            <button className="relative rounded-lg p-2 text-secondary-500 hover:bg-secondary-50 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-error" />
            </button>
            
            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 border-l border-secondary-200 pl-4 pr-2 py-2 h-auto hover:bg-secondary-50"
                >
                  <div className="relative h-8 w-8 overflow-hidden rounded-full ring-2 ring-white">
                    <Image
                      src={mounted ? (currentUser?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop") : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop"}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="h-8 w-8 object-cover"
                    />
                  </div>
                  <div className="hidden text-left lg:block">
                    <p className="text-sm font-semibold text-secondary-900 leading-5">
                      {mounted ? userFirstName : "User"}
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
                        src={mounted ? (currentUser?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop") : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop"}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="h-10 w-10 object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-secondary-900">
                          {mounted ? userName : "User"}
                        </p>
                        <Badge variant="secondary" className="h-5 px-2 text-[11px] font-semibold">
                          {roleLabel}
                        </Badge>
                      </div>
                      {mounted && currentUser?.email ? (
                        <p className="mt-0.5 truncate text-xs font-medium text-secondary-500">
                          {currentUser.email}
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
                  <DropdownMenuItem className="gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="gap-2"
                    onSelect={(e) => {
                      e.preventDefault()
                      router.push("/support")
                    }}
                  >
                    <HelpCircle className="h-4 w-4" />
                    <span>Help & Support</span>
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
        <main className="flex-1 overflow-y-auto bg-neutral-100 p-4 lg:p-6">
          <div className="mx-auto max-w-7xl">
            <ProtectedRoute allowedRoles={['student']}>
              {children}
            </ProtectedRoute>
          </div>
        </main>
      </div>
    </div>
  )
}
