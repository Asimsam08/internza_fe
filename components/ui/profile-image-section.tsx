"use client"

import { useCurrentUser, useUpdateProfilePicture } from "@/lib/hooks/use-auth"
import { Camera, Loader2 } from "lucide-react"
import Image from "next/image"
import { useRef, useState } from "react"
import { toast } from "sonner"


export function ProfileImageSection() {

  const inputRef = useRef<HTMLInputElement>(null)

  const { data: user } = useCurrentUser()

  const [preview, setPreview] =
    useState<string | null>(null)

  const {
    mutate: updateProfilePicture,
    isPending,
  } = useUpdateProfilePicture()

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {

    const file = e.target.files?.[0]

    if (!file) return

    // Validate type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ]

    if (!allowedTypes.includes(file.type)) {
      return toast.error("Invalid image type")
    }

    // Validate size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      return toast.error("Image must be under 2MB")
    }

    // Local preview immediately
    const localPreview =
      URL.createObjectURL(file)

    setPreview(localPreview)

    updateProfilePicture(file, {
      onError: () => {

        // Revert preview on failure
        setPreview(null)
      },
    })
  }

  return (
    <div className="flex items-center gap-4">

      <div className="relative">

        {/* <img
          src={
            preview ||
            user?.avatar ||
            "https://ui-avatars.com/api/?name=User&background=random"
          }
          alt="Profile"
          className="h-20 w-20 rounded-full object-cover ring-2 ring-white shadow-md"
        /> */}

        <Image alt="Profile" width={80} height={80} className="h-20 w-20 rounded-full object-cover ring-2 ring-white shadow-md"
          src={
            preview ||
            user?.avatar ||
            // "https://ui-avatars.com/api/?name=User&background=random"
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
  user?.name || "User"
)}&background=e5e7eb&color=6b7280`
          }
        />

        <button
          type="button"
          disabled={isPending}
          onClick={() =>
            inputRef.current?.click()
          }
          className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
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
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

      </div>

      <div>

        <p className="font-medium text-secondary-900">
          Profile Photo
        </p>

        <p className="text-[11px] text-secondary-500">
          JPG, PNG, WEBP or GIF.
          Max 2MB.
        </p>

      </div>

    </div>
  )
}