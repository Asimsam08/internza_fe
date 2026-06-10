import Link from "next/link"

import { InternzaLogo } from "@/components/brand/InternzaLogo"

export function SiteFooter() {
  return (
    <footer className="border-t border-secondary-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <InternzaLogo />
            <p className="mt-4 max-w-md text-sm text-secondary-600">
              Internza helps students complete real internship tasks, submit proof, and earn
              verification reviewers can trust.
            </p>
          </div>

          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-secondary-900">
              Product
            </div>
            <div className="mt-4 grid gap-2 text-sm font-semibold text-secondary-600">
              <Link href="#how" className="hover:text-primary">
                How it works
              </Link>
              <Link href="#roles" className="hover:text-primary">
                Roles
              </Link>
              <Link href="#proof" className="hover:text-primary">
                Proof system
              </Link>
            </div>
          </div>

          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-secondary-900">
              Get involved
            </div>
            <div className="mt-4 grid gap-2 text-sm font-semibold text-secondary-600">
              <Link href="#waitlist" className="hover:text-primary">
                Join waitlist
              </Link>
              <Link href="/support" className="hover:text-primary">
                Support
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-secondary-100 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-secondary-500">© {new Date().getFullYear()} Internza.</p>
          <div className="flex gap-4 text-xs font-semibold text-secondary-500">
            <Link href="#" className="hover:text-primary">
              Privacy
            </Link>
            <Link href="#" className="hover:text-primary">
              Terms
            </Link>
            <Link href="#" className="hover:text-primary">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

