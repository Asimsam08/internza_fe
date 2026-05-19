"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { api } from "@/lib/api-client"
import { useAuthStore } from "@/stores/authStore"
import { useQueryClient } from "@tanstack/react-query"
import { authKeys } from "@/lib/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getHomeRouteForRole, getReviewerWorkspaceRoute } from "@/lib/auth-routes"

function SetupForm() {
  const search = useSearchParams()
  const router = useRouter()
  const login = useAuthStore((s) => s.login)
  const queryClient = useQueryClient()
  const collegeId = search.get("collegeId") ?? ""
  const token = search.get("token") ?? ""
  const email = search.get("email") ?? ""
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await api.post<{ data?: { user?: Parameters<typeof login>[0] }; user?: Parameters<typeof login>[0] }>(
        "/invite/setup",
        { collegeId, token, password },
      )
      const user = res.data?.user ?? res.user
      if (!user) throw new Error("Invalid setup response")
      login(user)
      await queryClient.invalidateQueries({ queryKey: authKeys.currentUser() })
      const role = (user?.role as string)?.trim()?.toLowerCase()
      const dest =
        role === "reviewer"
          ? getReviewerWorkspaceRoute()
          : getHomeRouteForRole(role, user?.collegeId ?? collegeId)
      router.push(dest)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Setup failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-md w-full">
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <fieldset className="space-y-2 border-0 p-0">
            <Label>Email</Label>
            <Input value={email} disabled />
          </fieldset>
          <fieldset className="space-y-2 border-0 p-0">
            <Label>Password</Label>
            <Input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </fieldset>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={loading}>
            Create account & login
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default function InviteSetupPage() {
  return (
    <section className="min-h-screen flex items-center justify-center p-4 bg-secondary-50">
      <Suspense fallback={<p>Loading...</p>}>
        <SetupForm />
      </Suspense>
    </section>
  )
}
