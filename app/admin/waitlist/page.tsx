"use client"

import { useMemo, useState } from "react"
import { Mail, Search, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useWaitlistEntries } from "@/lib/hooks/use-waitlist"

function formatJoinedAt(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso))
}

export default function AdminWaitlistPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { data, isLoading, error } = useWaitlistEntries()

  const total = data?.total ?? 0

  const filteredEntries = useMemo(() => {
    const entries = data?.entries ?? []
    const q = searchQuery.trim().toLowerCase()
    if (!q) return entries
    return entries.filter((entry) => entry.email.toLowerCase().includes(q))
  }, [data?.entries, searchQuery])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-primary">Waitlist</h1>
        <p className="text-sm text-secondary-600">
          Members who signed up for early access from the landing page
        </p>
      </div>

      {isLoading && (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
          Failed to load waitlist. Please try again.
        </div>
      )}

      {!isLoading && !error && (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="border-secondary-100">
              <CardHeader className="pb-2">
                <CardDescription>Total signups</CardDescription>
                <CardTitle className="flex items-center gap-2 text-3xl font-extrabold text-primary">
                  <Users className="h-6 w-6 text-accent" />
                  {total}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-secondary-500">All waitlist members</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-secondary-100">
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-lg">Waitlist emails</CardTitle>
                  <CardDescription>
                    {filteredEntries.length} of {total} shown
                  </CardDescription>
                </div>
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
                  <Input
                    placeholder="Search by email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredEntries.length === 0 ? (
                <div className="rounded-xl border border-dashed border-secondary-200 bg-secondary-50 px-6 py-12 text-center">
                  <Mail className="mx-auto h-8 w-8 text-secondary-400" />
                  <p className="mt-3 text-sm font-semibold text-secondary-700">
                    {searchQuery ? "No matching emails found" : "No waitlist signups yet"}
                  </p>
                  <p className="mt-1 text-xs text-secondary-500">
                    {searchQuery
                      ? "Try a different search term"
                      : "Signups from the landing page will appear here"}
                  </p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-xl border border-secondary-100">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-secondary-100 bg-secondary-50">
                      <tr>
                        <th className="px-4 py-3 font-extrabold text-secondary-700">#</th>
                        <th className="px-4 py-3 font-extrabold text-secondary-700">Email</th>
                        <th className="px-4 py-3 font-extrabold text-secondary-700">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEntries.map((entry, index) => (
                        <tr
                          key={entry.id}
                          className="border-b border-secondary-50 last:border-0 hover:bg-secondary-50/50"
                        >
                          <td className="px-4 py-3 text-secondary-500">{index + 1}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-secondary-400" />
                              <span className="font-semibold text-primary">{entry.email}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="secondary" className="bg-secondary-50 font-medium">
                              {formatJoinedAt(entry.createdAt)}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
