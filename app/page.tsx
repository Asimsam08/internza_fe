import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  FileCheck2,
  GraduationCap,
  LayoutDashboard,
  Link2,
  Lock,
  Play,
  ShieldCheck,
  Target,
  Timer,
  TrendingUp,
  Users,
} from "lucide-react"
import Link from "next/link"
import { SiteHeader } from "@/components/marketing/SiteHeader"
import { SiteFooter } from "@/components/marketing/SiteFooter"
import { WaitlistSection } from "@/components/marketing/WaitlistSection"
import { AnimateIn } from "@/components/marketing/AnimateIn"
import { HeroSection } from "@/components/marketing/HeroSection"

const audienceCards = [
  {
    icon: <GraduationCap className="h-6 w-6" />,
    title: "Self-paced internships",
    subtitle: "Learn by shipping real work, on your schedule",
    gradient: "from-accent/10 to-accent/5",
    iconBg: "bg-accent/15 text-accent-700",
    features: [
      "Join independently — no college required",
      "4, 8 & 12 week milestone-based internship tracks",
      "Submit proof for every task you complete",
      "Earn a shareable verified profile for recruiters",
    ],
    cta: "Start as a student",
    accent: "border-accent/20 hover:border-accent/40",
  },
  {
    icon: <Building2 className="h-6 w-6" />,
    title: "Cohort management",
    subtitle: "Run structured internship programs at your institution",
    gradient: "from-primary/10 to-primary/5",
    iconBg: "bg-primary/15 text-primary",
    features: [
      "Onboard your college and invite students",
      "Arrange cohorts with custom tracks & deadlines",
      "Monitor progress across every student",
      "Export verified outcomes for placement cells",
    ],
    cta: "Partner with us",
    accent: "border-primary/20 hover:border-primary/40",
  },
]

const productSpecs = [
  {
    icon: <LayoutDashboard className="h-5 w-5" />,
    title: "Student Dashboard",
    desc: "A personalized command center with progress, next actions, and internship status at a glance.",
    preview: "dashboard",
  },
  {
    icon: <Target className="h-5 w-5" />,
    title: "Milestone Tracking",
    desc: "Break internships into projects and tasks with clear statuses — completed, active, or locked.",
    preview: "milestones",
  },
  {
    icon: <FileCheck2 className="h-5 w-5" />,
    title: "Proof Submissions",
    desc: "Attach GitHub repos, docs, screenshots, videos, and deploy URLs as evidence for every task.",
    preview: "proof",
  },
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: "Reviewer Rubric",
    desc: "Human reviewers score submissions on authenticity, completeness, quality, and impact.",
    preview: "review",
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: "College Cohorts",
    desc: "Colleges create cohorts, assign tracks, and oversee student progress from one admin view.",
    preview: "cohort",
  },
  {
    icon: <Link2 className="h-5 w-5" />,
    title: "Verified Profiles",
    desc: "Every approved task builds a public verification page — one link instead of a stack of claims.",
    preview: "verify",
  },
]

function DashboardPreview() {
  return (
    <div className="overflow-hidden rounded-xl border border-secondary-100 bg-white shadow-xl card-shadow-xl sm:rounded-2xl">
      <div className="gradient-brand-horizontal px-3 py-4 xs:px-4 xs:py-5 sm:px-6">
        <div className="flex items-start justify-between gap-2 xs:gap-4">
          <div className="flex min-w-0 items-center gap-2.5 xs:gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-base font-bold text-white backdrop-blur-sm xs:h-11 xs:w-11 xs:text-lg">
              P
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-bold text-white xs:text-base sm:text-lg">
                Hello, Prateek! 👋
              </div>
              <div className="truncate text-[11px] font-medium text-white/70 xs:text-xs sm:text-sm">
                GS College · Class of 2026
              </div>
            </div>
          </div>
          <div className="hidden shrink-0 rounded-xl glass-card px-4 py-3 md:block">
            <div className="text-[10px] font-bold uppercase tracking-wider text-accent-200">
              Next action
            </div>
            <div className="mt-0.5 text-xs font-semibold text-white">
              Submit your task before the deadline
            </div>
          </div>
        </div>
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 xs:mt-3 xs:gap-2">
          <span className="rounded-full border border-white/25 px-2 py-0.5 text-[9px] font-bold text-white xs:px-2.5 xs:text-[10px]">
            ✨ 8-WEEK INTERNSHIP
          </span>
          <span className="rounded-full bg-emerald-900/40 px-2 py-0.5 text-[9px] font-bold text-emerald-200 xs:px-2.5 xs:text-[10px]">
            ✅ ACTIVE
          </span>
        </div>
      </div>

      <div className="space-y-3 p-3 xs:space-y-4 xs:p-4 sm:p-6">
        <div className="rounded-xl border border-secondary-100 bg-secondary-50/50 p-3 xs:p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-secondary-500 xs:text-xs">Overall Progress</span>
            <span className="text-xl font-extrabold text-primary xs:text-2xl">44%</span>
          </div>
          <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-secondary-200 xs:mt-3 xs:h-2.5">
            <div className="progress-bar-gradient h-full w-[44%] rounded-full transition-all duration-1000" />
          </div>
          <div className="mt-2.5 flex flex-wrap gap-1.5 xs:mt-3 xs:gap-2">
            <span className="rounded-lg bg-accent/10 px-2 py-0.5 text-[9px] font-bold text-accent-700 xs:px-2.5 xs:py-1 xs:text-[10px]">
              4 Completed
            </span>
            <span className="rounded-lg bg-amber-50 px-2 py-0.5 text-[9px] font-bold text-amber-700 xs:px-2.5 xs:py-1 xs:text-[10px]">
              5 Due Soon
            </span>
            <span className="rounded-lg bg-red-50 px-2 py-0.5 text-[9px] font-bold text-red-600 xs:px-2.5 xs:py-1 xs:text-[10px]">
              0 Overdue
            </span>
          </div>
        </div>

        <div className="space-y-1.5 xs:space-y-2">
          {[
            { title: "Setup development environment", status: "Approved", icon: CheckCircle2, color: "text-accent" },
            { title: "Build portfolio dashboard", status: "Active", icon: Play, color: "text-primary" },
            { title: "Deploy to production", status: "Locked", icon: Lock, color: "text-secondary-400" },
          ].map((task) => (
            <div
              key={task.title}
              className="flex items-center justify-between gap-2 rounded-lg border border-secondary-100 bg-white px-2.5 py-2 xs:rounded-xl xs:px-3 xs:py-2.5"
            >
              <div className="flex min-w-0 items-center gap-2 xs:gap-2.5">
                <task.icon className={`h-3.5 w-3.5 shrink-0 xs:h-4 xs:w-4 ${task.color}`} />
                <span className="truncate text-[11px] font-semibold text-primary xs:text-xs">
                  {task.title}
                </span>
              </div>
              <span className="shrink-0 rounded-md bg-secondary-50 px-1.5 py-0.5 text-[9px] font-bold text-secondary-600 xs:px-2 xs:text-[10px]">
                {task.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <SiteHeader />

      <HeroSection dashboard={<DashboardPreview />} />

      {/* B2C / B2B Audiences */}
      <section id="audiences" className="bg-white">
        <div className="mx-auto max-w-7xl px-3 py-12 xs:px-4 xs:py-16 sm:px-6 lg:px-8 lg:py-24">
          <AnimateIn>
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="secondary" className="mb-4 bg-secondary-50">
                Built for everyone in the internship journey
              </Badge>
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-primary xs:text-3xl sm:text-4xl">
                One platform.{" "}
                <span className="gradient-text">Two powerful paths.</span>
              </h2>
              <p className="mt-4 text-secondary-600">
                Whether you&apos;re a student building your portfolio or a college scaling internship
                programs — ProofAura is designed for you.
              </p>
            </div>
          </AnimateIn>

          <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:items-stretch">
            {audienceCards.map((card, i) => (
              <AnimateIn key={card.title} delay={i * 120} className="h-full">
                <Card
                  className={`card-hover-lift card-shine group relative h-full overflow-hidden border-2 bg-white ${card.accent}`}
                >
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                  />
                  <CardContent className="relative flex h-full flex-col p-7 sm:p-8">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.iconBg}`}
                    >
                      {card.icon}
                    </div>

                    <h3 className="mt-5 text-xl font-extrabold text-primary sm:text-2xl">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-sm font-medium text-secondary-600">{card.subtitle}</p>

                    <ul className="mt-6 space-y-3">
                      {card.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5 text-sm text-secondary-700">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                          <span className="font-semibold">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto pt-8">
                      <Link href="#waitlist">
                        <Button variant="gradient" className="gap-2">
                          {card.cta}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section id="product" className="bg-background">
        <div className="mx-auto max-w-7xl px-3 py-12 xs:px-4 xs:py-16 sm:px-6 lg:px-8 lg:py-24">
          <AnimateIn>
            <div className="max-w-2xl">
              <Badge variant="secondary" className="mb-4 bg-white">
                <TrendingUp className="mr-1.5 h-3.5 w-3.5 text-accent" />
                Platform specifications
              </Badge>
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-primary xs:text-3xl sm:text-4xl">
                Everything you need to run{" "}
                <span className="gradient-text">proof-based internships</span>
              </h2>
              <p className="mt-4 text-secondary-600">
                From milestone tracking to verified outcomes — every feature is built around
                evidence, not empty certificates.
              </p>
            </div>
          </AnimateIn>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {productSpecs.map((spec, i) => (
              <AnimateIn key={spec.title} delay={i * 80}>
                <Card className="card-hover-lift card-shine group h-full border-secondary-100 bg-white">
                  <CardContent className="flex h-full flex-col p-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 text-primary transition-transform duration-500 group-hover:scale-110">
                      {spec.icon}
                    </div>
                    <h3 className="mt-4 text-lg font-extrabold text-primary">{spec.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-secondary-600">
                      {spec.desc}
                    </p>
                    {/* <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-accent-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      Learn more <ArrowRight className="h-3 w-3" />
                    </div> */}
                  </CardContent>
                </Card>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-white">
        <div className="mx-auto max-w-7xl px-3 py-12 xs:px-4 xs:py-16 sm:px-6 lg:px-8 lg:py-24">
          <AnimateIn>
            <div className="max-w-2xl">
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-primary xs:text-3xl sm:text-4xl">
                A simple loop that keeps everyone aligned.
              </h2>
              <p className="mt-4 text-secondary-600">
                Students focus on shipping. Reviewers focus on evidence. Colleges keep programs
                structured and scalable.
              </p>
            </div>
          </AnimateIn>

          <div className="mt-12 grid gap-6 lg:grid-cols-3 lg:items-stretch">
            {[
              {
                step: "01",
                icon: <GraduationCap className="h-5 w-5 text-primary" />,
                title: "Join & get assigned",
                desc: "Students enroll individually or through a college cohort. Tracks and milestones are assigned automatically.",
              },
              {
                step: "02",
                icon: <FileCheck2 className="h-5 w-5 text-primary" />,
                title: "Complete & submit proof",
                desc: "Work through tasks with clear acceptance criteria. Attach GitHub, docs, screenshots, videos, and more.",
              },
              {
                step: "03",
                icon: <ShieldCheck className="h-5 w-5 text-primary" />,
                title: "Get reviewed & verified",
                desc: "Reviewers score using a rubric. Approved work builds a shareable verification profile.",
              },
            ].map((x, i) => (
              <AnimateIn key={x.title} delay={i * 100} className="h-full">
                <Card className="card-hover-lift relative h-full overflow-hidden border-secondary-100">
                  <CardContent className="flex h-full flex-col p-6">
                    <div className="absolute -right-2 -top-4 font-display text-7xl font-extrabold text-secondary-100">
                      {x.step}
                    </div>
                    <div className="relative flex flex-1 flex-col">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        {x.icon}
                      </div>
                      <div className="mt-4 text-lg font-extrabold text-primary">{x.title}</div>
                      <div className="mt-2 flex-1 text-sm leading-relaxed text-secondary-600">
                        {x.desc}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Proof system */}
      <section id="proof" className="bg-background">
        <div className="mx-auto max-w-7xl px-3 py-12 xs:px-4 xs:py-16 sm:px-6 lg:px-8 lg:py-24">
          <AnimateIn>
            <div className="max-w-2xl">
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-primary xs:text-3xl sm:text-4xl">
                Proof that recruiters can trust.
              </h2>
              <p className="mt-4 text-secondary-600">
                Collect evidence for every task and keep a clean audit trail for reviewers and
                placement cells.
              </p>
            </div>
          </AnimateIn>

          <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:items-stretch">
            <AnimateIn className="lg:col-span-7" delay={100}>
              <Card className="card-hover-lift h-full border-secondary-100 bg-white">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-extrabold text-primary">Accepted proof formats</div>
                    <Badge variant="secondary" className="bg-secondary-50">
                      Flexible by task
                    </Badge>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {[
                      "Screenshots",
                      "Docs / PDFs",
                      "GitHub links",
                      "Demo video",
                      "Metrics",
                      "Deploy URL",
                    ].map((label) => (
                      <div
                        key={label}
                        className="flex items-center gap-2 rounded-xl border border-secondary-100 bg-secondary-50/80 px-3 py-3 text-sm font-semibold text-secondary-700 transition-colors hover:border-accent/30 hover:bg-accent/5"
                      >
                        <FileCheck2 className="h-4 w-4 text-accent" />
                        {label}
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-2xl border border-secondary-100 bg-secondary-50/50 p-4">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-primary">
                      <Timer className="h-4 w-4 text-primary" />
                      Review turnaround
                    </div>
                    <div className="mt-2 text-sm font-semibold text-secondary-600">
                      Target: 24–48 hours per submission, tracked per reviewer with full audit trail.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimateIn>

            <AnimateIn className="lg:col-span-5" delay={200}>
              <Card className="card-hover-lift card-shine h-full overflow-hidden border-0 gradient-brand">
                <CardContent className="flex h-full flex-col p-6 sm:p-8">
                  <div className="flex items-center gap-2 text-white">
                    <BadgeCheck className="h-5 w-5" />
                    <div className="text-sm font-extrabold">Verification outcome</div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-white/80">
                    Every approved task contributes to a clean, shareable profile: what you shipped,
                    the evidence, and the reviewer decision.
                  </p>
                  <div className="mt-6 flex-1 rounded-2xl glass-card p-5">
                    <div className="flex items-center gap-2 font-extrabold text-white">
                      <BadgeCheck className="h-4 w-4 text-accent-300" />
                      Proof verified
                    </div>
                    <div className="mt-2 text-sm text-white/75">
                      Share a single link with recruiters instead of sending a resume full of claims.
                    </div>
                    <div className="mt-5">
                      <Link href="/verify/DEMO-SELF-2026">
                        <Button
                          variant="outline"
                          className="border-white/25 bg-white/10 text-white hover:bg-white/20"
                        >
                          View demo profile
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-3 py-12 xs:px-4 xs:py-16 sm:px-6 lg:px-8 lg:py-24">
          <AnimateIn>
            <div className="relative overflow-hidden rounded-2xl gradient-brand-horizontal px-5 py-10 xs:rounded-3xl xs:px-8 xs:py-14 sm:px-12 sm:py-16">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-accent/20 blur-2xl" />
              </div>

              <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <h2 className="font-display text-2xl font-extrabold tracking-tight text-white xs:text-3xl sm:text-4xl">
                    Ready to turn internships into verified proof?
                  </h2>
                  <p className="mt-4 text-white/75">
                    Join students and colleges already on the waitlist. Be first to access self-paced
                    tracks, cohort management, and shareable verification profiles.
                  </p>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Link href="#waitlist">
                      <Button
                        size="lg"
                        className="w-full gap-2 bg-white text-primary shadow-lg hover:bg-white/90 sm:w-auto"
                      >
                        Join waitlist
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/verify/DEMO-SELF-2026">
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full border-white/25 bg-white/10 text-white hover:bg-white/20 sm:w-auto"
                      >
                        View demo profile
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { icon: <GraduationCap className="h-4 w-4 text-accent-300" />, label: "Self-paced tracks" },
                    { icon: <Building2 className="h-4 w-4 text-accent-300" />, label: "College cohorts" },
                    { icon: <FileCheck2 className="h-4 w-4 text-accent-300" />, label: "Proof attachments" },
                    { icon: <BadgeCheck className="h-4 w-4 text-accent-300" />, label: "Shareable verification" },
                  ].map((x) => (
                    <div
                      key={x.label}
                      className="flex items-center gap-2 rounded-2xl glass-card px-4 py-3 text-sm font-semibold text-white"
                    >
                      {x.icon}
                      {x.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      <WaitlistSection />

      <SiteFooter />
    </div>
  )
}
