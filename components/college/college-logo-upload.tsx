"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { Camera, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useUpdateCollegeLogo } from "@/lib/hooks/use-college-admin"
import { resolveStorageUrl } from "@/lib/storage-url"
import { Building2 } from "lucide-react"

interface CollegeLogoUploadProps {
  collegeId: string
  logoUrl?: string | null
  collegeName?: string
}

export function CollegeLogoUpload({
  collegeId,
  logoUrl,
  collegeName = "College",
}: CollegeLogoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const { mutate: updateLogo, isPending } = useUpdateCollegeLogo(collegeId)

  const displayUrl =
    preview ?? resolveStorageUrl(logoUrl) ?? null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return

    const allowed = ["image/jpeg", "image/png", "image/jpg"]
    if (!allowed.includes(file.type)) {
      toast.error("Logo must be PNG or JPG")
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo must be under 2MB")
      return
    }

    const localPreview = URL.createObjectURL(file)
    setPreview(localPreview)

    updateLogo(file, {
      onError: () => setPreview(null),
      onSuccess: () => {
        if (localPreview.startsWith("blob:")) URL.revokeObjectURL(localPreview)
      },
    })
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        {displayUrl ? (
          <Image
            src={displayUrl}
            alt={`${collegeName} logo`}
            width={80}
            height={80}
            className="h-20 w-20 rounded-lg object-cover ring-2 ring-white shadow-md bg-white"
            unoptimized
          />
        ) : (
          <div className="h-20 w-20 rounded-lg bg-secondary-100 flex items-center justify-center ring-2 ring-white shadow-md">
            <Building2 className="h-8 w-8 text-secondary-400" />
          </div>
        )}

        <button
          type="button"
          disabled={isPending}
          onClick={() => inputRef.current?.click()}
          className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
          aria-label="Update college logo"
        >
          {isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Camera className="h-3.5 w-3.5" />
          )}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <div>
        <p className="font-medium text-secondary-900">College Logo</p>
        <p className="text-[11px] text-secondary-500">
          PNG or JPG. Max 2MB. Click the camera to update.
        </p>
      </div>
    </div>
  )
}
