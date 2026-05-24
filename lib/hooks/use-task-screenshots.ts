"use client"

import { useMutation } from "@tanstack/react-query"
import { apiUpload, getErrorMessage, unwrapApiData } from "@/lib/api-client"
import { toast } from "sonner"

export interface UploadedScreenshot {
  path: string
  url: string | null
}

interface UploadScreenshotsResponse {
  screenshots: UploadedScreenshot[]
}

export function useUploadTaskScreenshots(taskId: string) {
  return useMutation({
    mutationFn: async (files: File[]): Promise<UploadedScreenshot[]> => {
      const fd = new FormData()
      files.forEach((f) => fd.append("files", f))
      const res = await apiUpload<UploadScreenshotsResponse | { data: UploadScreenshotsResponse }>(
        `/students/tasks/${taskId}/screenshots`,
        fd,
      )
      const payload = unwrapApiData<UploadScreenshotsResponse>(res)
      return payload.screenshots ?? []
    },
    onError: (error: unknown) => {
      toast.error("Screenshot upload failed", {
        description: getErrorMessage(error),
      })
    },
  })
}
