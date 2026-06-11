"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  BadgeCheck,
  CalendarRange,
  CheckCircle2,
  FileStack,
  Sparkles,
  Trophy,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { HeroTypewriter } from "@/components/marketing/HeroTypewriter"
import { cn } from "@/lib/utils"

const metrics = [
  {
    icon: CalendarRange,
    label: "Self-paced tracks",
    value: "4, 8 & 12 week plans",
    iconBg: "bg-primary/10 text-primary",
    accent: "from-primary/20 to-primary/5",
  },
  {
    icon: FileStack,
    label: "Accepted proof formats",
    value: "GitHub PR · Deploy link · Screenshots · Demo video",
    compact: true,
    iconBg: "bg-accent/15 text-accent-700",
    accent: "from-accent/20 to-accent/5",
  },
  {
    icon: BadgeCheck,
    label: "Shareable with recruiters",
    value: "Verified profile",
    iconBg: "bg-emerald-50 text-emerald-700",
    accent: "from-emerald-200/40 to-emerald-50/60",
  },
] as const

const journeyMoments = [
  {
    icon: CheckCircle2,
    label: "Task submitted",
    sub: "Proof uploaded",
    color: "text-primary bg-primary/10",
  },
  {
    icon: BadgeCheck,
    label: "Task approved",
    sub: "Reviewer verified",
    color: "text-accent-700 bg-accent/15",
  },
  {
    icon: Trophy,
    label: "Internship done",
    sub: "Profile shareable",
    color: "text-emerald-700 bg-emerald-50",
  },
]

type HeroSectionProps = {
  dashboard: React.ReactNode
}

function HeroValueStrip() {
  return (
    <div>
      <p className="mb-4 text-center text-[10px] font-extrabold uppercase tracking-[0.16em] text-secondary-400 xs:mb-5 xs:text-[11px]">
        What you get
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {metrics.map((m) => (
          <div
            key={m.value}
            className="card-hover-lift group relative flex items-start gap-3 overflow-hidden rounded-xl border border-secondary-100/70 bg-white/95 px-4 py-4 text-left shadow-sm card-shadow backdrop-blur-[2px] sm:flex-col sm:items-center sm:gap-0 sm:rounded-2xl sm:px-4 sm:py-5 sm:text-center"
          >
            <div
              className={cn(
                "pointer-events-none absolute inset-x-0 top-0 hidden h-0.5 bg-gradient-to-r opacity-80 sm:block",
                m.accent
              )}
            />
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-transform duration-500 group-hover:scale-110 sm:mx-auto sm:h-10 sm:w-10 sm:rounded-xl",
                m.iconBg
              )}
            >
              <m.icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
            </div>
            <div className="min-w-0 flex-1 sm:mt-3">
              <div
                className={cn(
                  "font-extrabold leading-snug text-primary",
                  "compact" in m && m.compact
                    ? "text-xs sm:text-[13px]"
                    : "text-sm"
                )}
              >
                {m.value}
              </div>
              <div className="mt-0.5 text-[11px] font-semibold leading-snug text-secondary-500 xs:text-xs sm:mt-1">
                {m.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function HeroSection({ dashboard }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl animate-pulse-glow" />
        <div className="absolute -bottom-56 right-[-120px] h-[520px] w-[520px] rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute left-[-80px] top-1/3 h-72 w-72 rounded-full bg-accent/5 blur-3xl" />
      </div>

      {/* Primary hero — headline + CTA only; fills laptop viewport so nothing clips at the fold */}
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center px-3 pb-10 pt-10 text-center xs:px-4 sm:px-6 sm:pb-12 sm:pt-14 lg:min-h-[calc(100dvh-4rem)] lg:px-8 lg:pb-16 lg:pt-16">
        <Badge
          variant="secondary"
          className="mb-5 w-fit border border-accent/20 bg-white/90 px-3 py-1 text-[11px] font-semibold shadow-sm sm:mb-6 sm:text-xs"
        >
          <Sparkles className="mr-1.5 h-3.5 w-3.5 shrink-0 text-accent" />
          Proof-based internships for students & colleges
        </Badge>

        <h1 className="font-display text-[1.65rem] font-extrabold leading-[1.15] tracking-tight text-primary xs:text-[1.85rem] sm:text-5xl lg:text-[3.5rem] lg:leading-[1.12]">
          <HeroTypewriter
            lines={[
              "Turn Every Task You Complete",
              "Into Proof",
              "that gets you hired.",
            ]}

            gradientLineIndex={1}
            className="text-balance"
          />
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-secondary-600 xs:mt-5 xs:text-base sm:mt-6 sm:text-lg">
          {/* Students join self-paced internship tracks, submit evidence for every task, and earn
          shareable verification. Colleges run structured cohorts — all on one platform. */}

          Internza lets students complete self-paced internships, submit proof of every task, and earn shareable verification that opens doors. Colleges manage cohorts effortlessly on the same platform.
        </p>

        <div className="mt-6 flex flex-col items-stretch justify-center gap-2.5 xs:mt-7 xs:gap-3 sm:mt-8 sm:flex-row sm:items-center">
          <Link href="#waitlist" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="gradient"
              className="h-11 w-full gap-2 text-sm sm:h-12 sm:min-w-[180px] sm:text-base"
            >
              Join waitlist
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="#product" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="h-11 w-full border-secondary-200 text-sm sm:h-12 sm:min-w-[180px] sm:text-base"
            >
              Explore the platform
            </Button>
          </Link>
        </div>
      </div>

      {/* Value props + journey — one continuous grid canvas, no dividing band */}
      <div className="mx-auto max-w-6xl space-y-6 px-3 pb-4 pt-4 xs:px-4 sm:space-y-8 sm:px-6 sm:pb-6 sm:pt-6 lg:px-8">
        <HeroValueStrip />

        <div className="relative overflow-hidden rounded-2xl border border-secondary-100/80 bg-white shadow-xl card-shadow-xl sm:rounded-3xl">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-accent/[0.06]" />

          <div className="relative grid md:grid-cols-[1fr_auto] md:items-stretch lg:grid-cols-[1fr_auto]">
            <div className="relative aspect-[4/3] min-h-[200px] xs:aspect-[16/10] xs:min-h-[220px] sm:min-h-[280px] md:aspect-auto md:min-h-[300px] lg:min-h-[380px]">
              <Image
                src="/marketing/hero-student-journey.png"
                alt="Student completing an internship — submitting proof, getting tasks approved, and earning verified completion"
                fill
                className="object-cover object-[center_20%] sm:object-center"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 65vw, 60vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/25 via-transparent to-transparent md:bg-gradient-to-r md:from-primary/15 md:via-transparent md:to-transparent" />
            </div>

            <div className="flex flex-col justify-center gap-2.5 border-t border-secondary-100 bg-secondary-50/40 p-4 xs:gap-3 xs:p-5 sm:p-6 md:w-64 md:border-l md:border-t-0 lg:w-72 xl:w-80">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-primary/70 xs:text-[11px]">
                The journey
              </p>
              {journeyMoments.map((moment, i) => (
                <div
                  key={moment.label}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl border border-white/80 bg-white p-2.5 shadow-sm transition-all duration-500 xs:gap-3 xs:p-3",
                    "animate-in fade-in slide-in-from-right-4 fill-mode-both"
                  )}
                  style={{ animationDelay: `${600 + i * 200}ms`, animationDuration: "600ms" }}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg xs:h-9 xs:w-9",
                      moment.color
                    )}
                  >
                    <moment.icon className="h-3.5 w-3.5 xs:h-4 xs:w-4" />
                  </div>
                  <div className="min-w-0 text-left">
                    <div className="text-xs font-extrabold text-primary xs:text-sm">{moment.label}</div>
                    <div className="text-[11px] font-medium text-secondary-500 xs:text-xs">{moment.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard preview */}
      <div className="mx-auto max-w-4xl px-3 pb-12 pt-8 xs:px-4 xs:pb-14 xs:pt-10 sm:px-6 sm:pb-16 sm:pt-12 lg:px-8 lg:pb-24 lg:pt-16">
        <div className="mb-5 text-center sm:mb-6">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-accent-700 xs:text-[11px]">
            Live workspace preview
          </p>
          <h2 className="mt-1.5 font-display text-lg font-extrabold text-primary xs:mt-2 xs:text-xl sm:text-2xl">
            Your internship command center
          </h2>
          <p className="mx-auto mt-1.5 max-w-lg text-xs text-secondary-600 xs:mt-2 xs:text-sm">
            Track milestones, submit proof, and see exactly what to do next — just like inside the
            platform.
          </p>
        </div>
        <div className="animate-float max-w-full overflow-hidden">{dashboard}</div>
      </div>
    </section>
  )
}
