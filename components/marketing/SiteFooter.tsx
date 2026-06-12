import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

import { FooterWatermark } from "@/components/brand/FooterWatermark"

const productLinks = [
  { href: "#audiences", label: "Who it's for" },
  { href: "#product", label: "Platform" },
  { href: "#how", label: "How it works" },
  { href: "#proof", label: "Verification" },
]

const startLinks = [
  { href: "#waitlist", label: "Join waitlist" },
  { href: "/verify/DEMO-SELF-2026", label: "View demo profile", external: true },
]

export function SiteFooter() {
  return (
    <footer className="footer-gradient-bg relative overflow-hidden border-t border-secondary-100/60 pb-[env(safe-area-inset-bottom,0px)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-8 h-72 w-72 rounded-full bg-primary/[0.04] blur-3xl" />
        <div className="absolute -right-32 top-1/3 h-80 w-80 rounded-full bg-accent/[0.07] blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-3 xs:px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 pb-[clamp(5.25rem,21vw,13rem)] pt-12 xs:gap-12 xs:pb-[clamp(6rem,22vw,13rem)] xs:pt-14 sm:pb-[clamp(7rem,22vw,13rem)] lg:grid-cols-[1.2fr_1fr_1fr] lg:gap-10 lg:pt-16">
          <div className="lg:pr-8">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 shrink-0">
                <Image src="/icon.svg" alt="" fill className="object-contain" />
              </div>
              <div>
                <div className="font-display text-lg font-extrabold tracking-tight text-primary">
                  Proof<span className="text-accent">Aura</span>
                </div>
                <div className="text-xs font-medium text-secondary-500">
                  Proof-based internships
                </div>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-secondary-600">
              Students ship real work and earn verified proof. Colleges run structured cohorts —
              all on one platform built for outcomes, not certificates.
            </p>
          </div>

          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-primary/70">
              Product
            </div>
            <nav className="mt-5 flex flex-col gap-3">
              {productLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group inline-flex w-fit items-center gap-1 text-sm font-semibold text-secondary-600 transition-colors hover:text-primary"
                >
                  {link.label}
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-60" />
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-primary/70">
              Get started
            </div>
            <nav className="mt-5 flex flex-col gap-3">
              {startLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group inline-flex w-fit items-center gap-1 text-sm font-semibold text-secondary-600 transition-colors hover:text-primary"
                >
                  {link.label}
                  {link.external ? (
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-80" />
                  ) : null}
                </Link>
              ))}
            </nav>

            <Link
              href="#waitlist"
              className="mt-7 inline-flex items-center gap-2 rounded-xl gradient-brand px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-primary/15 transition-all hover:brightness-110"
            >
              Join the waitlist
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-between gap-4 border-t border-secondary-200/50 py-6 sm:flex-row">
          <p className="text-xs text-secondary-500">
            © {new Date().getFullYear()} ProofAura. All rights reserved.
          </p>
          <p className="text-xs font-semibold text-secondary-500">
            Made with <span className="text-red-500">❤️</span> in India.
          </p>
        </div>
      </div>

      <FooterWatermark />
    </footer>
  )
}
