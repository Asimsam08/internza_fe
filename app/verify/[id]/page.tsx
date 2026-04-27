"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { CheckCircle, MapPin, GraduationCap, ExternalLink, Code, FileText, Zap, Shield, Github } from "lucide-react"

const internships = [
  {
    id: 1,
    period: "SUMMER 2024",
    title: "Senior Frontend Engineering Intern",
    company: "Stripe",
    team: "Engineering Infrastructure Team",
    description: "Architected a high-performance dashboard using React Server Components. Reduced initial bundle size by 42% and implemented a custom verification flow now used by 4,000+ merchants globally.",
    verified: true,
    skills: ["React", "TypeScript", "Performance"],
  },
  {
    id: 2,
    period: "WINTER 2023",
    title: "Systems Architect Intern",
    company: "Protocol Labs",
    team: "IPFS Network Services",
    description: "Contributed to the core Rust implementation of content routing. Optimized DHT lookups by implementing a predictive caching layer using WebAssembly.",
    verified: true,
    skills: ["Rust", "WebAssembly", "DHT"],
  },
  {
    id: 3,
    period: "SUMMER 2023",
    title: "Machine Learning Intern",
    company: "OpenAI",
    team: "Alignment Research Group",
    description: "Developed automated verification tools for large language model outputs. Benchmarked constitutional AI principles across 12 distinct model architectures.",
    verified: true,
    skills: ["Python", "PyTorch", "AI Alignment"],
  },
]

export default function VerificationPage() {
  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-white">I</span>
            </div>
            <span className="font-semibold text-primary">Internza</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-secondary-600 hover:text-primary transition-colors">Dashboard</Link>
            <Link href="/internships" className="text-sm text-secondary-600 hover:text-primary transition-colors">Internships</Link>
          </div>
        </div>

        {/* Profile Header */}
        <Card className="mb-8 overflow-hidden border-secondary-200">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="relative shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
                  alt="Alex Chen"
                  className="h-24 w-24 rounded-xl object-cover ring-2 ring-white shadow-md"
                />
                <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-accent shadow-lg">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent-600">Verified Profile</span>
                </div>
                <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-primary">Alex Chen</h1>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-secondary-600">
                  <span className="flex items-center gap-1">
                    <GraduationCap className="h-4 w-4" />
                    Stanford University
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Palo Alto, CA
                  </span>
                  <span>Class of 2025</span>
                </div>
              </div>
              <div className="text-right shrink-0 hidden sm:block">
                <p className="text-xs text-secondary-500 uppercase tracking-wider">Scan to Verify</p>
                <div className="mt-2 h-20 w-20 rounded-lg bg-secondary-200" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card className="bg-primary text-white border-primary">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Zap className="h-8 w-8 text-accent" />
                <div>
                  <p className="text-xs text-primary-200 uppercase tracking-wider">Verification Score</p>
                  <p className="text-2xl font-bold">Top 1% Rank</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-secondary-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-accent" />
                <div>
                  <p className="text-xs text-secondary-500 uppercase tracking-wider">Internships</p>
                  <p className="text-2xl font-bold text-primary">4 Verified</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-secondary-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-xs text-secondary-500 uppercase tracking-wider">Proof Submissions</p>
                  <p className="text-2xl font-bold text-primary">128 Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Verified Internships */}
        <div className="mb-8">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h2 className="text-xl font-bold text-primary">Verified Internships</h2>
            <Badge variant="success" className="text-xs w-fit">Live Verification Active</Badge>
          </div>

          <div className="space-y-4">
            {internships.map((internship) => (
              <Card key={internship.id} className="border-secondary-200 hover:shadow-md transition-shadow">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary-100">
                      <Code className="h-6 w-6 text-secondary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div>
                          <p className="text-xs font-medium text-secondary-500 uppercase tracking-wider">{internship.period}</p>
                          <h3 className="font-semibold text-primary">{internship.title}</h3>
                          <p className="text-sm text-secondary-600">{internship.company} • {internship.team}</p>
                        </div>
                        <Badge variant="success" className="text-xs w-fit shrink-0">Verified</Badge>
                      </div>
                      <p className="mt-3 text-sm text-secondary-600">{internship.description}</p>
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        {internship.skills.map((skill) => (
                          <span key={skill} className="rounded-full bg-secondary-100 px-3 py-1 text-xs text-secondary-700">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" className="gap-1">
                          <Github className="h-4 w-4" />
                          View Code
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1">
                          <ExternalLink className="h-4 w-4" />
                          Project Preview
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-secondary-200 pt-8">
          <div className="flex flex-col sm:flex-row justify-between gap-4 text-sm text-secondary-500">
            <span>© 2024 Internza. All Rights Reserved.</span>
            <div className="flex gap-4">
              <Link href="/support" className="hover:text-primary transition-colors">Support</Link>
              <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
