"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { InternzaLogo } from "@/components/brand/InternzaLogo"

const nav = [
  { href: "#audiences", label: "Who it's for" },
  { href: "#product", label: "Platform" },
  { href: "#how", label: "How it works" },
  { href: "#proof", label: "Verification" },
]

export function SiteHeader({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false)

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-secondary-100/80 bg-white/80 backdrop-blur-md",
        className
      )}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 xs:px-4 sm:h-16 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <InternzaLogo />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-secondary-600 transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="#waitlist">
            <Button variant="gradient" size="sm">
              Join waitlist
            </Button>
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 text-secondary-700 hover:bg-secondary-100 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="md:hidden">
          <div className="border-t border-secondary-100 bg-white px-4 py-4">
            <div className="flex flex-col gap-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-secondary-700 hover:bg-secondary-50"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="my-2 border-t border-secondary-100" />
              <Link href="#waitlist" onClick={() => setOpen(false)}>
                <Button variant="gradient" className="w-full">
                  Join waitlist
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
