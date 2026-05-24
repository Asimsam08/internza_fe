"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  useCollegeTeam,
  useInviteReviewer,
  type ReviewerInviteResult,
} from "@/lib/hooks/use-college-admin"
import { MagicLinkFallbackPanel } from "@/components/shared/MagicLinkFallbackPanel"
import { Loader2, Mail, Shield, UserCheck } from "lucide-react"

export default function CollegeTeamPage() {
  const collegeId = useParams().collegeId as string
  const { data: team, isLoading } = useCollegeTeam(collegeId)
  const invite = useInviteReviewer(collegeId)
  const [email, setEmail] = useState("")
  const [recentInvites, setRecentInvites] = useState<
    (ReviewerInviteResult & { email: string })[]
  >([])

  const onInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = email.trim()
    const result = await invite.mutateAsync(trimmed)
    setRecentInvites((prev) => [{ ...result, email: trimmed }, ...prev].slice(0, 8))
    setEmail("")
  }

  if (isLoading) {
    return <Loader2 className="h-8 w-8 animate-spin mx-auto mt-12" />
  }

  return (
    <section className="space-y-8 max-w-4xl">
      <header>
        <h2 className="text-2xl font-bold text-secondary-900 tracking-tight">Team</h2>
        <p className="text-secondary-600 mt-1">
          College admins and faculty reviewers for your internship program.
        </p>
      </header>

      <section className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-primary" />
              Admins
            </CardTitle>
            <CardDescription>Placement officers with full cohort access</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {team?.admins?.length ? (
              team.admins.map((a: { id: string; email: string }) => (
                <article
                  key={a.id}
                  className="flex items-center gap-3 rounded-lg border border-secondary-100 px-3 py-2"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-primary text-xs font-semibold">
                    {a.email[0]?.toUpperCase()}
                  </span>
                  <span className="text-sm truncate">{a.email}</span>
                </article>
              ))
            ) : (
              <p className="text-sm text-secondary-500">No admins listed</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserCheck className="h-5 w-5 text-primary" />
              Reviewers
            </CardTitle>
            <CardDescription>
              Faculty who review submissions — once they accept an invite, they are linked to every cohort
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {team?.reviewers?.length ? (
              team.reviewers.map(
                (r: {
                  id: string
                  email: string
                  reviewerProfile?: { firstName: string; lastName: string; isAvailable?: boolean }
                }) => (
                  <article
                    key={r.id}
                    className="flex items-center justify-between gap-2 rounded-lg border border-secondary-100 px-3 py-2"
                  >
                    <span className="text-sm truncate">
                      {r.reviewerProfile
                        ? `${r.reviewerProfile.firstName} ${r.reviewerProfile.lastName}`.trim()
                        : r.email}
                    </span>
                    {r.reviewerProfile?.isAvailable !== false && (
                      <Badge variant="secondary" className="shrink-0 text-xs">
                        Active
                      </Badge>
                    )}
                  </article>
                ),
              )
            ) : (
              <p className="text-sm text-secondary-500">
                Invite faculty — they are added to all cohorts automatically when they accept.
              </p>
            )}

            <form onSubmit={onInvite} className="pt-4 border-t space-y-3">
              <fieldset className="space-y-2 border-0 p-0">
                <Label htmlFor="reviewer-email" className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  Invite reviewer
                </Label>
                <Input
                  id="reviewer-email"
                  type="email"
                  placeholder="faculty@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </fieldset>
              <Button type="submit" className="w-full" disabled={invite.isPending}>
                {invite.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Send magic invite
              </Button>
            </form>

            {recentInvites.length > 0 ? (
              <MagicLinkFallbackPanel
                className="mt-4"
                title="Recent reviewer invites"
                description="Copy a link to share on WhatsApp or college email if the invite did not arrive."
                items={recentInvites.map((inv) => ({
                  email: inv.email,
                  inviteUrl: inv.inviteUrl,
                  emailSent: inv.emailSent,
                  roleLabel: "Reviewer",
                }))}
                autoExpandOnFailure
              />
            ) : null}
          </CardContent>
        </Card>
      </section>
    </section>
  )
}
