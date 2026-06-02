"use client"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, KeyRound, Loader2, MoreHorizontal, Rocket, Users } from "lucide-react"
import { toast } from "sonner"
import { CohortLaunchDialog } from "./CohortLaunchDialog"
import {
  downloadCertificatesZip,
  useIssueStudentCredentials,
  type StudentCredential,
} from "@/lib/hooks/use-college-admin"
import { StudentCredentialsPanel } from "./StudentCredentialsPanel"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

export interface CohortRow {
  id: string
  name: string
  planTitle: string
  progressLabel: string
  status: string
  studentsTotal: number
  needsLaunch: boolean
  startDate?: string
  endDate?: string
}

function statusBadge(status: string, needsLaunch: boolean) {
  if (needsLaunch) {
    return (
      <Badge className="bg-amber-100 text-amber-900 hover:bg-amber-100 border-amber-200">
        Setup pending
      </Badge>
    )
  }
  const map: Record<string, string> = {
    ACTIVE: "bg-emerald-100 text-emerald-900 border-emerald-200",
    DRAFT: "bg-amber-100 text-amber-900 border-amber-200",
    COMPLETED: "bg-blue-100 text-blue-900 border-blue-200",
    ARCHIVED: "bg-secondary-100 text-secondary-700 border-secondary-200",
  }
  const label = status === "ACTIVE" ? "Live" : status.charAt(0) + status.slice(1).toLowerCase()
  return (
    <Badge className={cn("hover:opacity-90", map[status] ?? "bg-secondary-100")}>{label}</Badge>
  )
}

export function CohortsTable({
  collegeId,
  cohorts,
}: {
  collegeId: string
  cohorts: CohortRow[]
}) {
  const [launchTarget, setLaunchTarget] = useState<CohortRow | null>(null)
  const [credentialsOpen, setCredentialsOpen] = useState(false)
  const [issuedLogins, setIssuedLogins] = useState<{
    credentials: StudentCredential[]
    loginUrl: string
  } | null>(null)
  const issueCredentials = useIssueStudentCredentials(collegeId)
  const [certDownloadId, setCertDownloadId] = useState<string | null>(null)

  const handleDownloadCertificates = async (cohort: CohortRow) => {
    setCertDownloadId(cohort.id)
    try {
      await downloadCertificatesZip(
        collegeId,
        cohort.id,
        `${cohort.name.replace(/\s+/g, "_")}_certificates.zip`,
      )
      toast.success("Certificate ZIP downloaded")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to download certificates")
    } finally {
      setCertDownloadId(null)
    }
  }

  const handleIssueLogins = async (cohort: CohortRow) => {
    const result = await issueCredentials.mutateAsync(cohort.id)
    setIssuedLogins(result)
    setCredentialsOpen(true)
  }

  if (cohorts.length === 0) {
    return (
      <article className="rounded-xl border border-dashed border-secondary-300 bg-secondary-50/50 py-12 text-center">
        <Users className="h-10 w-10 text-secondary-400 mx-auto mb-3" />
        <p className="font-medium text-secondary-900">No cohorts yet</p>
        <p className="text-sm text-secondary-500 mt-1">Create your first cohort to enroll students.</p>
      </article>
    )
  }

  return (
    <>
      <section className="overflow-hidden rounded-xl border border-secondary-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-secondary-50/80 text-left text-secondary-600">
              <th className="px-4 py-3 font-medium">Cohort</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">Program</th>
              <th className="px-4 py-3 font-medium">Students</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cohorts.map((c) => (
              <tr key={c.id} className="border-b border-secondary-100 last:border-0 hover:bg-secondary-50/50">
                <td className="px-4 py-4">
                  <Link
                    href={`/admin/colleges/${collegeId}/cohorts/${c.id}`}
                    className="font-medium text-secondary-900 hover:text-primary hover:underline"
                  >
                    {c.name}
                  </Link>
                  {c.startDate && c.endDate ? (
                    <p className="text-xs text-secondary-500 mt-0.5">
                      {new Date(c.startDate).toLocaleDateString()} –{" "}
                      {new Date(c.endDate).toLocaleDateString()}
                    </p>
                  ) : null}
                </td>
                <td className="px-4 py-4 hidden md:table-cell text-secondary-700">{c.planTitle}</td>
                <td className="px-4 py-4 text-secondary-700">{c.progressLabel}</td>
                <td className="px-4 py-4">{statusBadge(c.status, c.needsLaunch)}</td>
                <td className="px-4 py-4 text-right">
                  {c.needsLaunch ? (
                    <Button size="sm" onClick={() => setLaunchTarget(c)}>
                      <Rocket className="h-3.5 w-3.5 mr-1.5" />
                      Upload & launch
                    </Button>
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleIssueLogins(c)}
                          disabled={issueCredentials.isPending}
                        >
                          <KeyRound className="h-4 w-4 mr-2" />
                          Resend invites & show links
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDownloadCertificates(c)}
                          disabled={certDownloadId === c.id}
                          className="gap-2 cursor-pointer"
                        >
                          {certDownloadId === c.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                          Download certificates
                        </DropdownMenuItem>
                        {c.studentsTotal === 0 && (
                          <DropdownMenuItem onClick={() => setLaunchTarget(c)}>
                            <Rocket className="h-4 w-4 mr-2" />
                            Upload students
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {launchTarget && (
        <CohortLaunchDialog
          collegeId={collegeId}
          cohortId={launchTarget.id}
          cohortName={launchTarget.name}
          open={!!launchTarget}
          onOpenChange={(o) => !o && setLaunchTarget(null)}
        />
      )}

      <Dialog open={credentialsOpen} onOpenChange={setCredentialsOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Student enrollment</DialogTitle>
          </DialogHeader>
          {issuedLogins ? (
            <StudentCredentialsPanel
              credentials={issuedLogins.credentials}
              loginUrl={issuedLogins.loginUrl}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}
