import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  size?: "sm" | "md" | "lg"
  variant?: "default" | "success" | "accent" | "brand"
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, size = "md", variant = "default", ...props }, ref) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100))
    
    const sizes = {
      sm: "h-1.5",
      md: "h-2",
      lg: "h-3",
    }

    const variants = {
      default: "bg-primary",
      success: "bg-emerald-500",
      accent: "bg-accent",
      brand: "bg-gradient-to-r from-primary via-primary to-accent",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-muted",
          sizes[size],
          className
        )}
        {...props}
      >
        <div
          className={cn("h-full transition-all duration-500 ease-out", variants[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    )
  }
)
Progress.displayName = "Progress"

export { Progress }
