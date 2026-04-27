import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-1",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-white hover:bg-primary-600",
        secondary: "border-transparent bg-secondary-100 text-secondary-700 hover:bg-secondary-200",
        accent: "border-transparent bg-accent text-white hover:bg-accent-600",
        outline: "border-secondary-300 bg-white text-secondary-700",
        success: "border-transparent bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
        warning: "border-transparent bg-amber-100 text-amber-700 hover:bg-amber-200",
        error: "border-transparent bg-red-100 text-red-700 hover:bg-red-200",
        info: "border-transparent bg-blue-100 text-blue-700 hover:bg-blue-200",
        pending: "border-transparent bg-secondary-100 text-secondary-600",
        verified: "border-transparent bg-emerald-100 text-emerald-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
