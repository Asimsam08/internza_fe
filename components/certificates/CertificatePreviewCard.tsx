"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { CollegeLogoMark } from "@/components/college/CollegeLogoMark"
import { buildPublicVerificationUrl } from "@/lib/certificate-url"
import { cn } from "@/lib/utils"

export type CertificatePreviewVariant = "cohort" | "self-paced"

export type CertificatePreviewData = {
  variant: CertificatePreviewVariant
  studentName: string
  programName: string
  collegeName?: string
  collegeLogoUrl?: string | null
  cohortName?: string
  reviewerNames?: string
  durationLabel?: string
  verificationId?: string
  /** Full public verify URL; derived from verificationId when omitted */
  verificationUrl?: string
  issuedAt?: string
}

type CertificatePreviewCardProps = {
  data: CertificatePreviewData
  sample?: boolean
  className?: string
}

export function CertificatePreviewCard({ data, sample = false, className }: CertificatePreviewCardProps) {
  const issuedLabel = data.issuedAt
    ? new Date(data.issuedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })

  const isCohort = data.variant === "cohort"
  const verifyUrl =
    data.verificationUrl ??
    (data.verificationId ? buildPublicVerificationUrl(data.verificationId) : undefined)

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-xl border-4 border-double bg-white shadow-xl",
        isCohort ? "border-amber-200/80" : "border-indigo-200/80",
        className,
      )}
    >
      <div
        className={cn(
          "absolute inset-0 opacity-40",
          isCohort
            ? "bg-gradient-to-br from-amber-50/60 via-white to-slate-50"
            : "bg-gradient-to-br from-indigo-50/70 via-white to-violet-50/40",
        )}
      />
      <div className="relative p-6 md:p-10 flex flex-col min-h-[380px]">
        {sample ? (
          <Badge variant="secondary" className="absolute top-4 right-4 text-xs">
            Sample preview
          </Badge>
        ) : null}

        <div className="text-center mb-6">
          {isCohort ? (
            <>
              <div className="flex justify-center mb-3">
                <CollegeLogoMark
                  collegeName={data.collegeName ?? "College"}
                  logoUrl={data.collegeLogoUrl}
                  size="lg"
                />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                {data.collegeName ?? "College Name"}
              </h2>
              {data.cohortName ? (
                <p className="text-sm text-slate-500 mt-1">{data.cohortName}</p>
              ) : null}
            </>
          ) : (
            <>
              <div className="flex justify-center mb-3">
                <Image
                  src="/icon.svg"
                  alt=""
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-xl"
                  aria-hidden
                />
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-indigo-950 lowercase">
                internza
              </h2>
              <p className="text-sm text-slate-500 mt-1">Internship Platform</p>
            </>
          )}
        </div>

        <p
          className={cn(
            "text-center text-[11px] font-semibold uppercase tracking-[0.25em] mb-6",
            isCohort ? "text-amber-700" : "text-indigo-600",
          )}
        >
          Certificate of Completion
        </p>

        <div className="text-center flex-1 px-2 md:px-8">
          <p className="text-sm text-slate-600 mb-3">This is to certify that</p>
          <p className="text-2xl md:text-3xl font-serif italic font-bold text-slate-900 mb-4">
            {data.studentName}
          </p>
          <p className="text-sm text-slate-600 mb-2">
            {isCohort
              ? "has successfully completed the internship program"
              : "has successfully completed the self-paced internship"}
          </p>
          <p className="text-base md:text-lg font-semibold text-slate-900">{data.programName}</p>
          {data.durationLabel && !isCohort ? (
            <p className="text-xs text-slate-500 mt-2">{data.durationLabel}</p>
          ) : null}
          {data.reviewerNames ? (
            <p className="text-xs text-slate-500 mt-3">
              {isCohort ? "Reviewed by" : "Mentored by"} {data.reviewerNames}
            </p>
          ) : null}
        </div>

        <div className="mt-8 pt-4 border-t border-slate-100 text-center space-y-2">
          <p className="text-xs text-slate-500">Issued on {issuedLabel}</p>
          {data.verificationId ? (
            <p className="text-[11px] font-mono text-slate-400">ID: {data.verificationId}</p>
          ) : null}
          {verifyUrl ? (
            <p className="text-[10px] text-slate-500 break-all px-2">
              Verify at{" "}
              <a
                href={verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline font-medium"
              >
                {verifyUrl.replace(/^https?:\/\//, "")}
              </a>
            </p>
          ) : null}
          {isCohort ? (
            <div className="flex items-center justify-center gap-1.5 pt-2 text-xs text-slate-500">
              <Image
                src="/icon.svg"
                alt=""
                width={18}
                height={18}
                className="h-[18px] w-[18px] shrink-0 rounded-md"
                aria-hidden
              />
              <span>
                Powered by <span className="font-semibold text-indigo-700">internza</span>
              </span>
            </div>
          ) : (
            <p className="text-[11px] text-slate-400 pt-1">Verified Internship Platform</p>
          )}
        </div>
      </div>
    </div>
  )
}
