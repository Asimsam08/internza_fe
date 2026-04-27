import * as React from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"

type InternzaLogoProps = {
  variant?: "mark" | "icon"
  className?: string
}

export function InternzaLogo({ variant = "mark", className }: InternzaLogoProps) {
  if (variant === "icon") {
    return (
      <span className={cn("relative inline-block h-10 w-10", className)} aria-label="Internza">
        <Image
          src="/icon.svg"
          alt=""
          fill
          className="object-contain"
          priority
        />
      </span>
    )
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <InternzaLogo variant="icon" className="h-10 w-10" />
      <div className="leading-tight">
        <div className="font-display text-lg font-extrabold tracking-tight text-primary sm:text-xl">
          Internza
        </div>
        <div className="text-xs font-medium text-secondary-500 tracking-wide">Proof-based internships</div>
      </div>
    </div>
  )
}

