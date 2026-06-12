"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CertificatePreviewPanel } from "@/components/certificates/CertificatePreviewPanel"
import { useStudentCertificate } from "@/lib/hooks/use-certificates"
import { useStudentDashboard } from "@/lib/hooks/use-student"
import { useCurrentUser } from "@/lib/hooks/use-auth"
import {
  getSampleCertificateDownloadUrl,
  getSampleCertificatePreviewUrl,
  getStudentCertificateDownloadUrl,
  getStudentCertificatePreviewUrl,
} from "@/lib/certificates-api"
import { buildPublicVerificationUrl } from "@/lib/certificate-url"
import {
  CheckCircle,
  Copy,
  ExternalLink,
  Shield,
  Briefcase,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function VerificationPage() {
  const { data: cert, isLoading: certLoading } = useStudentCertificate()
  const { data: dashboard } = useStudentDashboard()
  const { data: user } = useCurrentUser()
  const [copied, setCopied] = useState(false)

  const programName =
    dashboard && "activeProject" in dashboard && dashboard.activeProject?.title
      ? dashboard.activeProject.title
      : "Internship Program"
  const studentDisplayName =
    user?.name?.trim() ||
    (user?.studentProfile
      ? `${user.studentProfile.firstName} ${user.studentProfile.lastName}`.trim()
      : "") ||
    "Student"

  const isCohort = dashboard && "activePlanType" in dashboard && dashboard.activePlanType === "cohort"
  const issued = cert?.issued === true
  const verificationId = cert?.verificationId ?? cert?.certificateId
  const verifyPageUrl = verificationId
    ? cert?.verificationUrl ?? cert?.verifyUrl ?? buildPublicVerificationUrl(verificationId)
    : ""

  const handleCopyLink = () => {
    if (!verifyPageUrl) return
    navigator.clipboard.writeText(verifyPageUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (certLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-display font-bold text-primary">Verification</h1>
        <p className="text-secondary-600 max-w-2xl">
          View your certificate in the app. Open or download the official PDF when you are ready to
          share it.
        </p>
      </div>

      {isCohort ? (
        <Card className="border border-primary/15 bg-primary/5">
          <CardContent className="p-5 text-sm text-secondary-700">
            You are in a <strong>college cohort</strong> program. Your college admin distributes
            cohort certificates in bulk when students complete the program.
          </CardContent>
        </Card>
      ) : null}

      {issued ? (
        <div className="space-y-6">
          <CertificatePreviewPanel
            title="Your certificate"
            description="ProofAura self-paced internship — official PDF opens in a new tab"
            previewData={{
              variant: "self-paced",
              studentName: studentDisplayName,
              programName,
              durationLabel: "Self-paced program",
              reviewerNames: cert?.reviewerNames,
              verificationId,
              verificationUrl: verifyPageUrl || undefined,
              issuedAt: cert?.issuedAt,
            }}
            previewPdfUrl={getStudentCertificatePreviewUrl()}
            downloadPdfUrl={getStudentCertificateDownloadUrl()}
            downloadFilename={`proofaura-certificate-${verificationId?.slice(0, 8) ?? "issued"}.pdf`}
            authenticated
          />

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5" />
                Verification details
              </CardTitle>
              <CardDescription>Share with employers to prove authenticity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-secondary-50">
                  <p className="text-xs text-secondary-500 mb-1">Verification ID</p>
                  <p className="font-mono font-bold text-primary">{verificationId}</p>
                </div>
                {cert?.issuedAt ? (
                  <div className="p-3 rounded-lg bg-secondary-50">
                    <p className="text-xs text-secondary-500 mb-1">Issued</p>
                    <p className="font-medium text-primary">
                      {new Date(cert.issuedAt).toLocaleDateString()}
                    </p>
                  </div>
                ) : null}
              </div>

              {verifyPageUrl ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary">Public verification link</label>
                  <div className="flex gap-2">
                    <Input value={verifyPageUrl} readOnly className="font-mono text-sm bg-secondary-50" />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCopyLink}
                      className={cn(copied && "border-emerald-200 bg-emerald-50")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                      <a href={verifyPageUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                  {copied ? (
                    <p className="text-sm text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Link copied
                    </p>
                  ) : null}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5 flex flex-wrap items-center gap-3">
              <p className="text-sm text-secondary-600 flex-1">
                {cert?.eligible
                  ? "Your internship is complete — your certificate will appear here once generated."
                  : "Complete your self-paced internship to unlock your certificate."}
              </p>
              {!cert?.eligible ? (
                <Button asChild size="sm" className="gap-2">
                  <Link href="/dashboard">
                    <Briefcase className="h-4 w-4" />
                    Go to dashboard
                  </Link>
                </Button>
              ) : null}
            </CardContent>
          </Card>

          <CertificatePreviewPanel
            title="Self-paced certificate sample"
            description="ProofAura is the primary brand — no logo, wordmark only. PDF opens in a new tab."
            previewData={{
              variant: "self-paced",
              studentName: "Jordan Martinez",
              programName: "Cloud & DevOps Engineering Track",
              durationLabel: "12-week self-paced program",
              reviewerNames: "Alex Rivera",
              verificationId: "DEMO-SELF-2026",
              verificationUrl: buildPublicVerificationUrl("DEMO-SELF-2026"),
            }}
            previewPdfUrl={getSampleCertificatePreviewUrl("self-paced")}
            downloadPdfUrl={getSampleCertificateDownloadUrl("self-paced")}
            downloadFilename="proofaura-self-paced-certificate-sample.pdf"
            sample
          />
        </div>
      )}
    </div>
  )
}
