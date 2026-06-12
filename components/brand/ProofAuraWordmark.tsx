import { cn } from "@/lib/utils"

type ProofAuraWordmarkProps = {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
}

const sizeClasses = {
  sm: "text-2xl",
  md: "text-3xl",
  lg: "text-4xl",
  xl: "text-5xl sm:text-6xl",
}

export function ProofAuraWordmark({ className, size = "lg" }: ProofAuraWordmarkProps) {
  return (
    <span
      className={cn(
        "font-display font-extrabold tracking-tight",
        sizeClasses[size],
        className
      )}
      aria-label="ProofAura"
    >
      <span className="brand-wordmark-left">Proof</span>
      <span className="brand-wordmark-right">Aura</span>
    </span>
  )
}
