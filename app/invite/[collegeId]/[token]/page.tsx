"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { api } from "@/lib/api-client"
import { useAuthStore } from "@/stores/authStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { getHomeRouteForRole, getReviewerWorkspaceRoute } from "@/lib/auth-routes"

export default function InviteLandingPage() {
  const params = useParams()
  const router = useRouter()
  const collegeId = params?.collegeId as string
  const token = params?.token as string
  const login = useAuthStore((s) => s.login)
  type InvitePreview = {
    email: string
    collegeName: string
    userExists: boolean
    requiresPassword: boolean
    type?: string
  }

  const [state, setState] = useState<{
    loading: boolean
    error?: string
    data?: InvitePreview
  }>({ loading: true })

  useEffect(() => {
    api
      .get<{ data: InvitePreview }>(`/invite/${collegeId}/${token}`)
      .then((res) => setState({ loading: false, data: res.data }))
      .catch((e: Error) => setState({ loading: false, error: e.message }))
  }, [collegeId, token])

  const acceptAsLoggedIn = async () => {
    const res = await api.post<{ data?: { user?: Parameters<typeof login>[0] }; user?: Parameters<typeof login>[0] }>(
      `/invite/${collegeId}/${token}/accept`,
      {},
    )
    const user = res.data?.user ?? res.user
    if (!user) throw new Error("Invalid invite response")
    login(user)
    const role = (user?.role as string)?.trim()?.toLowerCase()
    router.push(
      role === "reviewer"
        ? getReviewerWorkspaceRoute()
        : getHomeRouteForRole(role, user?.collegeId ?? collegeId),
    )
  }

  if (state.loading) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </section>
    )
  }

  if (state.error) {
    return (
      <section className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Invite invalid</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-secondary-600">{state.error}</p>
            <p className="text-sm text-secondary-500">Ask your super admin to resend the invite.</p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/login">Go to login</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    )
  }

  const d = state.data!
  const isStudent = d.type?.toUpperCase() === "STUDENT"
  const title = isStudent
    ? `Set up your student account — ${d.collegeName}`
    : `Join ${d.collegeName}`

  return (
    <section className="min-h-screen flex items-center justify-center p-4 bg-secondary-50">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-secondary-600">
            {isStudent
              ? "Create a password to access your cohort internship."
              : "Accept your invitation to continue."}
          </p>
          <p className="text-sm text-secondary-600">{d.email}</p>
          {d.requiresPassword ? (
            <Button
              className="w-full"
              onClick={() =>
                router.push(
                  `/invite/setup?collegeId=${collegeId}&token=${token}&email=${encodeURIComponent(d.email)}`,
                )
              }
            >
              {isStudent ? "Set password & sign in" : "Create account"}
            </Button>
          ) : (
            <>
              <Button className="w-full" onClick={acceptAsLoggedIn}>
                Accept & continue
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/login">Sign in first</Link>
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
