"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CertificatePreviewPanel } from "@/components/certificates/CertificatePreviewPanel"
import {
  getSampleCertificateDownloadUrl,
  getSampleCertificatePreviewUrl,
} from "@/lib/certificates-api"
import { buildPublicVerificationUrl } from "@/lib/certificate-url"
import { downloadCertificatesZip } from "@/lib/hooks/use-college-admin"
import { Download, Loader2, Users } from "lucide-react"
import { toast } from "sonner"

type CohortCertificatesSectionProps = {
  collegeId: string
  cohortId: string
  cohortName: string
  collegeName: string
  collegeLogoUrl?: string | null
  programName: string
  reviewerNames?: string
  studentsCompleted: number
  studentsTotal: number
}

export function CohortCertificatesSection({
  collegeId,
  cohortId,
  cohortName,
  collegeName,
  collegeLogoUrl,
  programName,
  reviewerNames,
  studentsCompleted,
  studentsTotal,
}: CohortCertificatesSectionProps) {
  const [bulkDownloading, setBulkDownloading] = useState(false)

  const handleBulkDownload = async () => {
    setBulkDownloading(true)
    try {
      await downloadCertificatesZip(collegeId, cohortId, `${cohortName.replace(/\s+/g, "_")}_certificates.zip`)
      toast.success("Certificate ZIP download started")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to download certificates")
    } finally {
      setBulkDownloading(false)
    }
  }

  const reviewerLabel =
    reviewerNames && reviewerNames.length > 0 ? reviewerNames : "Program Reviewers"

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-secondary-200 bg-white p-5">
        <div>
          <h3 className="font-semibold text-secondary-900">Cohort certificates</h3>
          <p className="text-sm text-secondary-600 mt-1">
            {studentsCompleted} of {studentsTotal} students completed — bulk ZIP includes PDFs with
            your college logo, reviewer names, and Powered by internza.
          </p>
        </div>
        <Button
          className="gap-2 shrink-0"
          onClick={handleBulkDownload}
          disabled={bulkDownloading || studentsCompleted === 0}
        >
          {bulkDownloading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Download all certificates (ZIP)
        </Button>
      </div>

      {studentsCompleted === 0 ? (
        <p className="text-sm text-secondary-500 flex items-center gap-2">
          <Users className="h-4 w-4" />
          No completed students yet. Bulk download unlocks when at least one student finishes the cohort
          program.
        </p>
      ) : null}

      <CertificatePreviewPanel
        title="Cohort certificate sample"
        description="College branding is primary. Reviewers and Powered by internza appear on issued PDFs."
        previewData={{
          variant: "cohort",
          studentName: "Sample Student",
          programName,
          collegeName,
          collegeLogoUrl,
          cohortName,
          reviewerNames: reviewerLabel,
          verificationId: "SAMPLE-COHORT",
          verificationUrl: buildPublicVerificationUrl("SAMPLE-COHORT"),
        }}
        previewPdfUrl={getSampleCertificatePreviewUrl("cohort", collegeId)}
        downloadPdfUrl={getSampleCertificateDownloadUrl("cohort", collegeId)}
        downloadFilename="internza-cohort-certificate-sample.pdf"
        sample
      />
    </div>
  )
}
