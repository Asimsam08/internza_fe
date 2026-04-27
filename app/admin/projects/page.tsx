"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ProjectsRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/admin/templates")
  }, [router])

  return null
}
