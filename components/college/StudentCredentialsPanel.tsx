"use client"

import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { useState } from "react"
import type { StudentCredential } from "@/lib/hooks/use-college-admin"

export function StudentCredentialsPanel({
  credentials,
  loginUrl,
}: {
  credentials: StudentCredential[]
  loginUrl: string
}) {
  const [copied, setCopied] = useState(false)

  const newAccounts = credentials.filter((c) => c.temporaryPassword)

  const copyAll = () => {
    const text = [
      `Internza student login: ${loginUrl}`,
      "",
      ...newAccounts.map(
        (c) => `${c.name} <${c.email}>\nPassword: ${c.temporaryPassword}`,
      ),
    ].join("\n\n")
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!credentials.length) return null

  return (
    <section className="space-y-3 rounded-lg border border-primary-200 bg-primary-50/50 p-4">
      <header>
        <p className="text-sm font-semibold text-secondary-900">Student login details</p>
        <p className="text-xs text-secondary-600 mt-1">
          Share these with students. Login at{" "}
          <a href={loginUrl} className="text-primary underline" target="_blank" rel="noreferrer">
            {loginUrl}
          </a>
        </p>
      </header>
      {newAccounts.length > 0 ? (
        <section className="max-h-48 overflow-y-auto rounded-md border bg-white text-xs">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-secondary-50 text-left text-secondary-600">
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Temporary password</th>
              </tr>
            </thead>
            <tbody>
              {newAccounts.map((c) => (
                <tr key={c.email} className="border-b border-secondary-100 last:border-0">
                  <td className="px-3 py-2 font-mono">{c.email}</td>
                  <td className="px-3 py-2 font-mono font-semibold text-primary">{c.temporaryPassword}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : (
        <p className="text-xs text-secondary-600">
          All students already had accounts — they should sign in with their existing password.
        </p>
      )}
      <Button type="button" size="sm" variant="outline" onClick={copyAll} disabled={!newAccounts.length}>
        {copied ? <Check className="h-3.5 w-3.5 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
        {copied ? "Copied" : "Copy all logins"}
      </Button>
    </section>
  )
}
