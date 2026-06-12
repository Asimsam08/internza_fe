"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { api } from "@/lib/api-client"
import { useAuthStore } from "@/stores/authStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { getReviewerWorkspaceRoute } from "@/lib/auth-routes"

export default function PlatformInviteLandingPage() {
  const params = useParams()
  const router = useRouter()
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
      .get<{ data: InvitePreview }>(`/invite/platform/${token}`)
      .then((res) => setState({ loading: false, data: res.data }))
      .catch((e: Error) => setState({ loading: false, error: e.message }))
  }, [token])

  const acceptAsLoggedIn = async () => {
    const res = await api.post<{
      data?: { user?: Parameters<typeof login>[0] }
      user?: Parameters<typeof login>[0]
    }>(`/invite/platform/${token}/accept`, {})
    const user = res.data?.user ?? res.user
    if (!user) throw new Error("Invalid invite response")
    login(user)
    router.push(getReviewerWorkspaceRoute())
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
            <Button asChild variant="outline" className="w-full">
              <Link href="/login">Go to login</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    )
  }

  const d = state.data!

  return (
    <section className="min-h-screen flex items-center justify-center p-4 bg-secondary-50">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Join ProofAura as a Reviewer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-secondary-600">
            You have been invited as a <strong>global reviewer</strong> for {d.collegeName}.
          </p>
          <p className="text-sm text-secondary-600">Email: {d.email}</p>
          {d.requiresPassword ? (
            <Button
              className="w-full"
              onClick={() =>
                router.push(
                  `/invite/setup?token=${token}&email=${encodeURIComponent(d.email)}`,
                )
              }
            >
              Create account
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
