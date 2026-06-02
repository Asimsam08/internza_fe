"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { InternzaLogo } from "@/components/brand/InternzaLogo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useVerifyCertificate } from "@/lib/hooks/use-certificates"
import { buildPublicVerificationUrl } from "@/lib/certificate-url"
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Loader2,
  Shield,
  XCircle,
} from "lucide-react"

export default function PublicVerifyCertificatePage() {
  const params = useParams()
  const verificationId = typeof params.id === "string" ? params.id : ""
  const { data, isLoading, isError, error } = useVerifyCertificate(verificationId)

  const verifyUrl = verificationId ? buildPublicVerificationUrl(verificationId) : ""

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4">
          <Link href="https://internza.vercel.app" className="flex items-center gap-2">
            <InternzaLogo variant="icon" className="h-9 w-9" />
            <span className="font-semibold text-slate-900">Internza</span>
          </Link>
          <Button variant="outline" size="sm" asChild>
            <a href="https://internza.vercel.app" target="_blank" rel="noopener noreferrer">
              internza.vercel.app
              <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center rounded-full bg-indigo-50 p-3">
            <Shield className="h-7 w-7 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Certificate verification</h1>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Anyone can use this page to confirm an Internza internship certificate is authentic.
          </p>
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-slate-700">Verification ID</CardTitle>
            <CardDescription className="font-mono text-sm break-all">{verificationId || "—"}</CardDescription>
          </CardHeader>
        </Card>

        {isLoading ? (
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
                <p className="text-sm font-medium text-slate-700">Verifying certificate…</p>
              </div>

              <div className="animate-pulse space-y-3">
                <div className="h-5 w-56 rounded bg-slate-200/70" />
                <div className="h-4 w-80 max-w-full rounded bg-slate-200/70" />
                <div className="grid sm:grid-cols-2 gap-3 pt-2">
                  <div className="h-20 rounded-lg bg-slate-100" />
                  <div className="h-20 rounded-lg bg-slate-100" />
                  <div className="h-20 rounded-lg bg-slate-100 sm:col-span-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ) : isError || !data ? (
          <Card className="border-red-200 bg-red-50/50">
            <CardContent className="pt-6 flex flex-col items-center text-center gap-3">
              <XCircle className="h-10 w-10 text-red-500" />
              <p className="font-semibold text-slate-900">Certificate not found</p>
              <p className="text-sm text-slate-600 max-w-md">
                {error instanceof Error
                  ? error.message
                  : "This ID is invalid, revoked, or not yet issued. Check the ID on the PDF and try again."}
              </p>
              <Button variant="outline" asChild>
                <Link href="https://internza.vercel.app">Visit Internza</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card
            className={
              data.valid
                ? "border-emerald-200 shadow-md"
                : "border-amber-200 shadow-md"
            }
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">{data.studentName}</CardTitle>
                  <CardDescription className="mt-1">{data.programName}</CardDescription>
                </div>
                <Badge
                  variant={data.valid ? "default" : "secondary"}
                  className={
                    data.valid
                      ? "bg-emerald-600 hover:bg-emerald-600 gap-1"
                      : "gap-1"
                  }
                >
                  {data.valid ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Verified
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3.5 w-3.5" />
                      {data.status}
                    </>
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500 mb-1">Type</p>
                  <p className="font-medium capitalize">
                    {data.variant === "cohort" ? "College cohort" : "Self-paced"}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500 mb-1">Issued</p>
                  <p className="font-medium">
                    {new Date(data.issuedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                {data.collegeName ? (
                  <div className="rounded-lg bg-slate-50 p-3 sm:col-span-2">
                    <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                      <GraduationCap className="h-3.5 w-3.5" />
                      Institution
                    </p>
                    <p className="font-medium">
                      {data.collegeName}
                      {data.cohortName ? ` · ${data.cohortName}` : ""}
                    </p>
                  </div>
                ) : null}
                {data.reviewerNames ? (
                  <div className="rounded-lg bg-slate-50 p-3 sm:col-span-2">
                    <p className="text-xs text-slate-500 mb-1">
                      {data.variant === "cohort" ? "Reviewed by" : "Mentored by"}
                    </p>
                    <p className="font-medium">{data.reviewerNames}</p>
                  </div>
                ) : null}
              </div>

              {data.valid ? (
                <p className="text-sm text-emerald-700 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  This certificate was issued by Internza and matches our records.
                </p>
              ) : (
                <p className="text-sm text-amber-700">
                  This certificate exists but is not in an active issued state ({data.status}).
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {verifyUrl ? (
          <p className="text-center text-xs text-slate-400 break-all">{verifyUrl}</p>
        ) : null}
      </main>
    </div>
  )
}
