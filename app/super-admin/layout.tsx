"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { ProofAuraLogo } from "@/components/brand/ProofAuraLogo"
import { cn } from "@/lib/utils"
import { Building2, Mail } from "lucide-react"

const nav = [
  { label: "Colleges", href: "/super-admin/colleges", icon: Building2 },
  { label: "Waitlist", href: "/admin/waitlist", icon: Mail },
]

export default function SuperAdminPlatformLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <ProtectedRoute allowedRoles={["super_admin"]}>
      <div className="min-h-screen bg-secondary-50 flex">
        <aside className="w-64 border-r bg-white p-4">
          <Link href="/super-admin/colleges" className="block mb-8">
            <ProofAuraLogo />
          </Link>
          <nav className="space-y-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
                  pathname?.startsWith(item.href)
                    ? "bg-primary-50 text-primary-900"
                    : "text-secondary-600 hover:bg-neutral-100",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
          <Link href="/admin/dashboard" className="mt-8 block text-xs text-secondary-500 hover:text-secondary-700">
            ← Legacy admin
          </Link>
        </aside>
        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </ProtectedRoute>
  )
}
