"use client"

import Image from "next/image"
import { Building2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { resolveStorageUrl } from "@/lib/storage-url"

const SIZES = {
  sm: { box: "h-10 w-10", px: 40 },
  md: { box: "h-14 w-14", px: 56 },
  lg: { box: "h-16 w-16", px: 64 },
} as const

interface CollegeLogoMarkProps {
  logoUrl?: string | null
  collegeName?: string
  size?: keyof typeof SIZES
  className?: string
}

export function CollegeLogoMark({
  logoUrl,
  collegeName = "College",
  size = "md",
  className,
}: CollegeLogoMarkProps) {
  const resolved = resolveStorageUrl(logoUrl)
  const { box, px } = SIZES[size]

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.04)]",
        box,
        className,
      )}
    >
      {resolved ? (
        <Image
          src={resolved}
          alt={`${collegeName} logo`}
          width={px}
          height={px}
          className="h-full w-full object-cover"
          unoptimized
        />
      ) : (
        <span
          className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary-50 to-secondary-100 text-secondary-400"
          aria-hidden
        >
          <Building2 className={size === "sm" ? "h-5 w-5" : "h-7 w-7"} />
        </span>
      )}
    </div>
  )
}
