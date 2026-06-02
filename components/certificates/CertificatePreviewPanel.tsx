"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CertificatePreviewCard, type CertificatePreviewData } from "./CertificatePreviewCard"
import { fetchPdfBlob } from "@/lib/certificates-api"
import { Download, ExternalLink, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

type CertificatePreviewPanelProps = {
  title: string
  description?: string
  previewData: CertificatePreviewData
  previewPdfUrl: string
  downloadPdfUrl: string
  downloadFilename: string
  sample?: boolean
  authenticated?: boolean
  className?: string
}

async function openPdfInNewTab(url: string, authenticated: boolean) {
  const blob = await fetchPdfBlob(url, {
    credentials: authenticated ? "include" : "omit",
  })
  const objectUrl = URL.createObjectURL(blob)
  window.open(objectUrl, "_blank", "noopener,noreferrer")
  setTimeout(() => URL.revokeObjectURL(objectUrl), 120_000)
}

async function downloadPdfFile(url: string, filename: string, authenticated: boolean) {
  const blob = await fetchPdfBlob(url, {
    credentials: authenticated ? "include" : "omit",
  })
  const objectUrl = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = objectUrl
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(objectUrl)
}

export function CertificatePreviewPanel({
  title,
  description,
  previewData,
  previewPdfUrl,
  downloadPdfUrl,
  downloadFilename,
  sample = false,
  authenticated = false,
  className,
}: CertificatePreviewPanelProps) {
  const [opening, setOpening] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleOpen = async () => {
    setOpening(true)
    setError(null)
    try {
      await openPdfInNewTab(previewPdfUrl, authenticated)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not open PDF")
    } finally {
      setOpening(false)
    }
  }

  const handleDownload = async () => {
    setDownloading(true)
    setError(null)
    try {
      await downloadPdfFile(downloadPdfUrl, downloadFilename, authenticated)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Download failed")
    } finally {
      setDownloading(false)
    }
  }

  return (
    <Card className={cn("border-0 shadow-lg", className)}>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <CardTitle className="text-lg">{title}</CardTitle>
            {sample ? (
              <Badge variant="secondary" className="text-xs">
                Sample
              </Badge>
            ) : (
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs">Issued</Badge>
            )}
          </div>
          {description ? <CardDescription className="mt-1">{description}</CardDescription> : null}
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleOpen}
            disabled={opening || downloading}
          >
            {opening ? <Loader2 className="h-4 w-4 animate-spin" /> : <ExternalLink className="h-4 w-4" />}
            View PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleDownload}
            disabled={opening || downloading}
          >
            {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Download
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <CertificatePreviewCard data={previewData} sample={sample} />
        {error ? <p className="text-sm text-red-600 text-center">{error}</p> : null}
      </CardContent>
    </Card>
  )
}
