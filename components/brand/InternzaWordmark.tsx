import { cn } from "@/lib/utils"

type InternzaWordmarkProps = {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
}

const sizeClasses = {
  sm: "text-2xl",
  md: "text-3xl",
  lg: "text-4xl",
  xl: "text-5xl sm:text-6xl",
}

export function InternzaWordmark({ className, size = "lg" }: InternzaWordmarkProps) {
  return (
    <span
      className={cn(
        "font-display font-extrabold tracking-tight",
        sizeClasses[size],
        className
      )}
      aria-label="Internza"
    >
      <span className="brand-wordmark-left">Inter</span>
      <span className="brand-wordmark-right">nza</span>
    </span>
  )
}
