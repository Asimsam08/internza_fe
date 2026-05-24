"use client"

import type { StudentCredential } from "@/lib/hooks/use-college-admin"
import {
  MagicLinkFallbackPanel,
  type MagicLinkItem,
} from "@/components/shared/MagicLinkFallbackPanel"

export function StudentCredentialsPanel({
  credentials,
  loginUrl,
}: {
  credentials: StudentCredential[]
  loginUrl: string
}) {
  if (!credentials.length) return null

  const items: MagicLinkItem[] = credentials
    .map((c) => {
      if (c.isNewAccount && c.inviteUrl) {
        return {
          email: c.email,
          name: c.name,
          inviteUrl: c.inviteUrl,
          emailSent: c.emailSent,
          roleLabel: "Student",
        }
      }
      return {
        email: c.email,
        name: c.name,
        inviteUrl: loginUrl,
        emailSent: c.emailSent,
        roleLabel: "Student",
        note: "Existing account — they sign in with their current password",
      }
    })
    .filter((c) => c.inviteUrl)

  const enrolled = credentials.length
  const emailFailed = credentials.filter((c) => !c.emailSent).length

  return (
    <section className="space-y-3">
      <p className="text-xs text-secondary-600">
        {enrolled} student(s) enrolled
        {emailFailed > 0 ? ` · ${emailFailed} email(s) need manual follow-up` : ""}
      </p>
      <MagicLinkFallbackPanel
        title="Student invite links"
        description="New students use the setup link. Existing students use the login page. Share manually if email did not arrive."
        items={items}
        autoExpandOnFailure
      />
    </section>
  )
}
