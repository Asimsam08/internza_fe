"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Upload, FileSpreadsheet } from "lucide-react"
import { useImportCohortCsv, type ImportCohortResult } from "@/lib/hooks/use-college-admin"
import { StudentCredentialsPanel } from "./StudentCredentialsPanel"

interface CohortLaunchDialogProps {
  collegeId: string
  cohortId: string
  cohortName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CohortLaunchDialog({
  collegeId,
  cohortId,
  cohortName,
  open,
  onOpenChange,
}: CohortLaunchDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [launchResult, setLaunchResult] = useState<ImportCohortResult | null>(null)
  const importCsv = useImportCohortCsv(collegeId)

  const handleClose = (next: boolean) => {
    if (!next) {
      setFile(null)
      setLaunchResult(null)
    }
    onOpenChange(next)
  }

  const handleLaunch = async () => {
    if (!file) return
    const result = await importCsv.mutateAsync({ cohortId, file })
    setLaunchResult({
      ...result,
      loginUrl: result.loginUrl ?? `${window.location.origin}/login`,
    })
    setFile(null)
  }

  const showCredentials = !!launchResult

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{showCredentials ? "Students enrolled — invite links" : "Launch cohort"}</DialogTitle>
          <DialogDescription>
            {showCredentials ? (
              <>Cohort <strong>{cohortName}</strong> is now live. Students are invited by email.</>
            ) : (
              <>
                Upload students for <strong>{cohortName}</strong>. New students receive a secure setup link by email.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {showCredentials ? (
          <section className="space-y-4">
            <StudentCredentialsPanel
              credentials={launchResult.credentials ?? []}
              loginUrl={launchResult.loginUrl ?? "/login"}
            />
            <p className="text-xs text-secondary-500">
              {launchResult.enrolled} enrolled · {launchResult.skipped} skipped
            </p>
          </section>
        ) : (
          <section className="space-y-4">
            <article className="rounded-lg border border-dashed border-secondary-300 bg-secondary-50 p-4">
              <p className="text-sm font-medium text-secondary-900 flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-primary" />
                CSV format
              </p>
              <p className="mt-1 text-xs text-secondary-600">
                Columns: <code className="bg-white px-1 rounded">email</code>,{" "}
                <code className="bg-white px-1 rounded">name</code>, optional{" "}
                <code className="bg-white px-1 rounded">studentId</code>
              </p>
            </article>
            <fieldset className="space-y-2 border-0 p-0">
              <Label htmlFor="cohort-csv">Student list (CSV)</Label>
              <Input
                id="cohort-csv"
                type="file"
                accept=".csv,text/csv"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              {file ? <p className="text-xs text-secondary-500">{file.name}</p> : null}
            </fieldset>
          </section>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          {showCredentials ? (
            <Button type="button" onClick={() => handleClose(false)}>
              Done
            </Button>
          ) : (
            <>
              <Button type="button" variant="outline" onClick={() => handleClose(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleLaunch} disabled={!file || importCsv.isPending}>
                {importCsv.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                Upload & launch
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
