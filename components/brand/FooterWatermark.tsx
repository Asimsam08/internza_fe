import { cn } from "@/lib/utils"

export function FooterWatermark({ className }: { className?: string }) {
  return (
    <div
      className={cn("footer-watermark pointer-events-none select-none", className)}
      aria-hidden="true"
    >
      <span className="footer-watermark-inter">Inter</span>
      <span className="footer-watermark-nza">nza</span>
    </div>
  )
}
