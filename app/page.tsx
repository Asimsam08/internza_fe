// "use cli
// ent"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowRight,
  BadgeCheck,
  FileCheck2,
  GraduationCap,
  LayoutGrid,
  ShieldCheck,
  Sparkles,
  Timer,
  Users,
} from "lucide-react"
import Link from "next/link"
import { SiteHeader } from "@/components/marketing/SiteHeader"
import { SiteFooter } from "@/components/marketing/SiteFooter"
import { WaitlistSection } from "@/components/marketing/WaitlistSection"

const metrics = [
  { label: "Tasks shipped", value: "Proof-first" },
  { label: "Reviews", value: "Human + rubric" },
  { label: "Verification", value: "Shareable link" },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute -bottom-56 right-[-120px] h-[520px] w-[520px] rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pb-20 lg:pt-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <Badge variant="secondary" className="mb-5 bg-white">
                <Sparkles className="mr-1.5 h-3.5 w-3.5 text-accent" />
                Build proof. Get verified. Share one link.
              </Badge>
              <h1 className="font-display text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
                The internship platform that{" "}
                <span className="gradient-text">rewards real work</span>.
              </h1>
              <p className="mt-5 max-w-xl text-base text-secondary-600 sm:text-lg">
                Internza helps students complete task-based internships, submit proofs, and get reviews
                from reviewers—managed by a super admin, tracked end-to-end.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="#waitlist" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full gap-2">
                    Join waitlist
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#how" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full">
                    See how it works
                  </Button>
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3">
                {metrics.map((m) => (
                  <div key={m.label} className="rounded-xl border border-secondary-100 bg-white p-3">
                    <div className="text-xs font-extrabold text-primary">{m.value}</div>
                    <div className="mt-1 text-xs font-semibold text-secondary-500">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <Card className="overflow-hidden border-secondary-100 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                        <LayoutGrid className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-extrabold text-primary">Internship Workspace</div>
                        <div className="text-xs font-semibold text-secondary-500">
                          Tasks → Proof → Review → Verification
                        </div>
                      </div>
                    </div>
                    <Badge variant="verified" className="bg-emerald-100 text-emerald-800">
                      <BadgeCheck className="mr-1 h-3.5 w-3.5" />
                      Verified-ready
                    </Badge>
                  </div>

                  <div className="mt-6 grid gap-3">
                    {[
                      { title: "Task 1: Setup repository", hint: "Attach commits + README", status: "Done" },
                      { title: "Task 2: Implement feature", hint: "PR + screenshots", status: "In review" },
                      { title: "Task 3: Write report", hint: "PDF + metrics", status: "Queued" },
                    ].map((row) => (
                      <div
                        key={row.title}
                        className="flex items-center justify-between rounded-xl border border-secondary-100 bg-secondary-50 px-4 py-3"
                      >
                        <div>
                          <div className="text-sm font-extrabold text-primary">{row.title}</div>
                          <div className="text-xs font-semibold text-secondary-500">{row.hint}</div>
                        </div>
                        <div className="text-xs font-extrabold text-secondary-700">{row.status}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-2xl border border-secondary-100 bg-white p-4">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-primary">
                      <ShieldCheck className="h-4 w-4 text-accent" />
                      Review rubric
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-semibold text-secondary-600 sm:grid-cols-4">
                      {["Authenticity", "Completeness", "Quality", "Impact"].map((x) => (
                        <div key={x} className="rounded-lg bg-secondary-50 px-3 py-2 text-center">
                          {x}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-primary">
              A simple loop that keeps everyone aligned.
            </h2>
            <p className="mt-3 text-secondary-600">
              Students focus on shipping. Reviewers focus on evidence. Admins keep the process clean and
              scalable.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {[
              {
                icon: <GraduationCap className="h-5 w-5 text-primary" />,
                title: "Complete tasks",
                desc: "Students work in small, measurable tasks with clear acceptance criteria.",
              },
              {
                icon: <FileCheck2 className="h-5 w-5 text-primary" />,
                title: "Submit proof",
                desc: "Attach artifacts: GitHub, docs, screenshots, links, videos—whatever proves the work.",
              },
              {
                icon: <ShieldCheck className="h-5 w-5 text-primary" />,
                title: "Get reviewed + verified",
                desc: "Reviewers score using a rubric. Internza generates a shareable verification outcome.",
              },
            ].map((x) => (
              <Card key={x.title} className="border-secondary-100">
                <CardContent className="p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    {x.icon}
                  </div>
                  <div className="mt-4 text-lg font-extrabold text-primary">{x.title}</div>
                  <div className="mt-2 text-sm text-secondary-600">{x.desc}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section id="roles" className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-primary">
                Built for students, reviewers, and super admins.
              </h2>
              <p className="mt-3 text-secondary-600">
                One workflow, three experiences—each with the right controls and visibility.
              </p>
            </div>
            <Link href="#waitlist">
              <Button variant="outline" className="gap-2">
                Join waitlist <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <Card className="border-secondary-100 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                    <Users className="h-5 w-5 text-accent-700" />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-primary">Super Admin</div>
                    <div className="text-xs font-semibold text-secondary-500">
                      Configure programs & reviewers
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid gap-2 text-sm text-secondary-700">
                  {["Create internship tracks", "Assign reviewers", "Audit submissions", "Export outcomes"].map(
                    (x) => (
                      <div key={x} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                        <span className="font-semibold">{x}</span>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-secondary-100 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-primary">Reviewer</div>
                    <div className="text-xs font-semibold text-secondary-500">
                      Review proofs with a rubric
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid gap-2 text-sm text-secondary-700">
                  {["Queue of submissions", "Rubric scoring", "Request changes", "Approve & verify"].map(
                    (x) => (
                      <div key={x} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                        <span className="font-semibold">{x}</span>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-secondary-100 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-100">
                    <GraduationCap className="h-5 w-5 text-secondary-700" />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-primary">Student</div>
                    <div className="text-xs font-semibold text-secondary-500">Ship tasks, submit proof</div>
                  </div>
                </div>
                <div className="mt-4 grid gap-2 text-sm text-secondary-700">
                  {["Task board & deadlines", "Proof uploads/links", "Feedback loop", "Share verified profile"].map(
                    (x) => (
                      <div key={x} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                        <span className="font-semibold">{x}</span>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Proof system */}
      <section id="proof" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-primary">
              Proof that recruiters can trust.
            </h2>
            <p className="mt-3 text-secondary-600">
              Collect evidence for every task and keep a clean audit trail for reviewers.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-12 lg:items-stretch">
            <Card className="border-secondary-100 lg:col-span-7">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-extrabold text-primary">Accepted proof formats</div>
                  <Badge variant="secondary" className="bg-secondary-50">
                    Flexible by task
                  </Badge>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {[
                    { icon: <FileCheck2 className="h-4 w-4" />, label: "Screenshots" },
                    { icon: <FileCheck2 className="h-4 w-4" />, label: "Docs / PDFs" },
                    { icon: <FileCheck2 className="h-4 w-4" />, label: "GitHub links" },
                    { icon: <FileCheck2 className="h-4 w-4" />, label: "Demo video" },
                    { icon: <FileCheck2 className="h-4 w-4" />, label: "Metrics" },
                    { icon: <FileCheck2 className="h-4 w-4" />, label: "Deploy URL" },
                  ].map((x) => (
                    <div
                      key={x.label}
                      className="flex items-center gap-2 rounded-xl border border-secondary-100 bg-secondary-50 px-3 py-3 text-sm font-semibold text-secondary-700"
                    >
                      <span className="text-accent-700">{x.icon}</span>
                      {x.label}
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-secondary-100 bg-white p-4">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-primary">
                    <Timer className="h-4 w-4 text-primary" />
                    Review SLA (MVP default)
                  </div>
                  <div className="mt-2 text-sm font-semibold text-secondary-600">
                    Target: 24–48 hours per submission, tracked per reviewer.
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-secondary-100 bg-primary lg:col-span-5">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-white">
                  <BadgeCheck className="h-5 w-5" />
                  <div className="text-sm font-extrabold">Verification outcome</div>
                </div>
                <p className="mt-3 text-sm text-primary-200">
                  Every approved task contributes to a clean, shareable profile: what you shipped, the
                  evidence, and the reviewer decision.
                </p>
                <div className="mt-6 rounded-2xl bg-white/10 p-4 text-sm text-white">
                  <div className="flex items-center gap-2 font-extrabold">
                    <BadgeCheck className="h-4 w-4 text-accent" />
                    Proof verified
                  </div>
                  <div className="mt-2 text-primary-100">
                    Share a single link with recruiters instead of sending a resume.
                  </div>
                  <div className="mt-4">
                    <Link href="/verify/DEMO-SELF-2026">
                      <Button variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
                        View demo profile
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="relative overflow-hidden rounded-3xl border border-secondary-100 bg-primary px-8 py-14 sm:px-12">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/20 blur-2xl" />
              <div className="absolute -left-24 -bottom-24 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            </div>

            <div className="relative">
              <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <h2 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                    Ship internship work that’s easy to verify.
                  </h2>
                  <p className="mt-4 text-primary-200">
                    This MVP focuses on the most important thing: turning tasks into trusted proof with
                    a clean review workflow.
                  </p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Link href="#waitlist">
                      <Button size="lg" variant="accent" className="w-full sm:w-auto gap-2">
                        Join waitlist
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/verify/DEMO-SELF-2026">
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full border-white/20 bg-white/10 text-white hover:bg-white/20 sm:w-auto"
                      >
                        View demo profile
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { icon: <ShieldCheck className="h-4 w-4 text-accent" />, label: "Reviewer rubric" },
                    { icon: <FileCheck2 className="h-4 w-4 text-accent" />, label: "Proof attachments" },
                    { icon: <Timer className="h-4 w-4 text-accent" />, label: "SLA tracking" },
                    { icon: <BadgeCheck className="h-4 w-4 text-accent" />, label: "Shareable verification" },
                  ].map((x) => (
                    <div
                      key={x.label}
                      className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white"
                    >
                      {x.icon}
                      {x.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WaitlistSection />

      <SiteFooter />
    </div>
  )
}
