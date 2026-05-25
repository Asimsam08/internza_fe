"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { Label } from "@/components/ui/label"
import { Loader2, Plus, X } from "lucide-react"
import { toast } from "sonner"
import type { UploadedScreenshot } from "@/lib/hooks/use-task-screenshots"

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]
const MAX_BYTES = 5 * 1024 * 1024

export interface ScreenshotItem {
  id: string
  path: string
  previewUrl: string
  status: "uploading" | "done" | "error"
}

interface MultiImageUploadProps {
  min: number
  max?: number
  items: ScreenshotItem[]
  onChange: (items: ScreenshotItem[]) => void
  disabled?: boolean
  onUpload: (files: File[]) => Promise<UploadedScreenshot[]>
}

function validateFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Only JPG, PNG, or WEBP images are allowed"
  }
  if (file.size > MAX_BYTES) {
    return "Each image must be under 5MB"
  }
  return null
}

export function MultiImageUpload({
  min,
  max = 10,
  items,
  onChange,
  disabled,
  onUpload,
}: MultiImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const uploadFiles = async (files: File[]) => {
    const valid: File[] = []
    for (const file of files) {
      const err = validateFile(file)
      if (err) {
        toast.error(err)
        continue
      }
      valid.push(file)
    }
    if (!valid.length) return

    const remaining = max - items.length
    if (valid.length > remaining) {
      toast.error(`You can upload at most ${max} screenshots`)
      return
    }

    const placeholders: ScreenshotItem[] = valid.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      path: "",
      previewUrl: URL.createObjectURL(file),
      status: "uploading",
    }))

    onChange([...items, ...placeholders])
    setUploading(true)

    try {
      const uploaded = await onUpload(valid)
      const completed: ScreenshotItem[] = placeholders.map((p, idx) => {
        const result = uploaded[idx]
        return {
          id: p.id,
          path: result?.path ?? "",
          previewUrl: result?.url ?? p.previewUrl,
          status: result?.path ? "done" : "error",
        }
      })

      const withoutPlaceholders = items.filter(
        (i) => !placeholders.some((p) => p.id === i.id),
      )
      onChange([...withoutPlaceholders, ...completed.filter((c) => c.status === "done")])

      const failed = completed.filter((c) => c.status === "error").length
      if (failed > 0) {
        toast.error(`${failed} screenshot(s) failed to upload. Try again.`)
      }
    } catch {
      onChange(items.filter((i) => !placeholders.some((p) => p.id === i.id)))
    } finally {
      setUploading(false)
      placeholders.forEach((p) => {
        if (p.previewUrl.startsWith("blob:")) URL.revokeObjectURL(p.previewUrl)
      })
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ""
    if (!files.length) return
    await uploadFiles(files)
  }

  const removeItem = (id: string) => {
    onChange(items.filter((i) => i.id !== id))
  }

  const doneCount = items.filter((i) => i.status === "done" && i.path).length

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <Label>
          Screenshots <span className="text-red-500">*</span>
          <span className="text-secondary-500 font-normal ml-1">
            (min {min}, max {max})
          </span>
        </Label>
        <span
          className={`text-xs ${doneCount >= min ? "text-emerald-600" : "text-amber-600"}`}
        >
          {doneCount}/{min} uploaded
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="relative aspect-video rounded-lg border border-secondary-200 bg-secondary-50 overflow-hidden group"
          >
            <Image
              src={item.previewUrl}
              alt="Screenshot"
              fill
              className="object-cover"
              unoptimized
            />
            {item.status === "uploading" && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
            )}
            {item.status === "error" && (
              <div className="absolute inset-0 bg-red-900/50 flex items-center justify-center">
                <p className="text-[10px] text-white">Failed</p>
              </div>
            )}
            {item.status === "done" && !disabled && (
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove screenshot"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        ))}

        {items.length < max && (
          <button
            type="button"
            disabled={disabled || uploading}
            onClick={() => inputRef.current?.click()}
            className="aspect-video rounded-lg border-2 border-dashed border-secondary-300 flex flex-col items-center justify-center gap-1 text-secondary-500 hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <Plus className="h-6 w-6" />
                <span className="text-xs">Add</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_TYPES.join(",")}
        multiple
        className="hidden"
        disabled={disabled || uploading}
        onChange={handleFileChange}
      />

      <p className="text-sm text-secondary-500">
        Upload at least {min} screenshots of your work (JPG, PNG, or WEBP, max 5MB each).
      </p>
    </div>
  )
}
