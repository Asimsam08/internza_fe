import * as React from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"

type ProofAuraLogoProps = {
  variant?: "mark" | "icon"
  className?: string
}

export function ProofAuraLogo({ variant = "mark", className }: ProofAuraLogoProps) {
  if (variant === "icon") {
    return (
      <span className={cn("relative inline-block h-10 w-10", className)} aria-label="ProofAura">
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
      <ProofAuraLogo variant="icon" className="h-10 w-10" />
      <div className="leading-tight">
        <div className="font-display text-lg font-extrabold tracking-tight text-primary sm:text-xl">
          Proof<span className="text-accent">Aura</span>
        </div>
        <div className="text-xs font-medium text-secondary-500 tracking-wide">Proof-based internships</div>
      </div>
    </div>
  )
}
