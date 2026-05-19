"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function MyReviewsPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/reviewer/dashboard")
  }, [router])

  return null
}
