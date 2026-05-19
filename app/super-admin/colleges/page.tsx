"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCreateCollege, useSuperAdminColleges, type CollegeRow } from "@/lib/hooks/use-colleges"
import { Loader2, Plus, Building2 } from "lucide-react"
import Image from "next/image"

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "http://localhost:3002"

export default function SuperAdminCollegesPage() {
  const { data: colleges = [], isLoading } = useSuperAdminColleges()
  const createCollege = useCreateCollege()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: "", domain: "", primaryAdminEmail: "" })
  const [logo, setLogo] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const onLogoChange = (file: File | null) => {
    setLogo(file)
    if (file) setPreview(URL.createObjectURL(file))
    else setPreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!logo) return
    await createCollege.mutateAsync({ ...form, logo })
    setOpen(false)
    setForm({ name: "", domain: "", primaryAdminEmail: "" })
    onLogoChange(null)
  }

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <article>
          <h1 className="text-2xl font-bold text-secondary-900">Colleges</h1>
          <p className="text-secondary-600">Onboard colleges and invite placement officers</p>
        </article>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add College
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add College</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <fieldset className="space-y-2 border-0 p-0">
                <Label>College Name *</Label>
                <Input
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </fieldset>
              <fieldset className="space-y-2 border-0 p-0">
                <Label>Domain *</Label>
                <Input
                  required
                  placeholder="vnit.ac.in"
                  value={form.domain}
                  onChange={(e) => setForm((f) => ({ ...f, domain: e.target.value }))}
                />
              </fieldset>
              <fieldset className="space-y-2 border-0 p-0">
                <Label>Logo * (PNG/JPG under 2MB)</Label>
                <Input
                  type="file"
                  accept="image/png,image/jpeg"
                  required
                  onChange={(e) => onLogoChange(e.target.files?.[0] ?? null)}
                />
                {preview ? (
                  <Image src={preview} alt="Preview" width={80} height={80} className="rounded border" />
                ) : null}
              </fieldset>
              <fieldset className="space-y-2 border-0 p-0">
                <Label>Primary Admin Email *</Label>
                <Input
                  type="email"
                  required
                  value={form.primaryAdminEmail}
                  onChange={(e) => setForm((f) => ({ ...f, primaryAdminEmail: e.target.value }))}
                />
              </fieldset>
              <Button type="submit" className="w-full" disabled={createCollege.isPending}>
                {createCollege.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save & Send Invite"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>All Colleges</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
          ) : colleges.length === 0 ? (
            <p className="text-center text-secondary-500 py-8">No colleges yet</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-secondary-500">
                  <th className="pb-2">College</th>
                  <th className="pb-2">Cohorts</th>
                  <th className="pb-2">Students</th>
                </tr>
              </thead>
              <tbody>
                {colleges.map((row: CollegeRow) => (
                  <tr key={row.id} className="border-b border-secondary-100">
                    <td className="py-3">
                      <span className="flex items-center gap-3">
                        {row.logoUrl ? (
                          <Image
                            src={row.logoUrl.startsWith("http") ? row.logoUrl : `${API_BASE}${row.logoUrl}`}
                            alt=""
                            width={32}
                            height={32}
                            className="rounded object-cover h-8 w-8 bg-secondary-100"
                          />
                        ) : (
                          <span className="h-8 w-8 rounded bg-secondary-100 flex items-center justify-center">
                            <Building2 className="h-4 w-4 text-secondary-400" />
                          </span>
                        )}
                        <span>
                          <span className="font-medium block">{row.name}</span>
                          <span className="text-xs text-secondary-500">{row.domain}</span>
                        </span>
                      </span>
                    </td>
                    <td className="py-3">{row.cohortsCount}</td>
                    <td className="py-3">{row.studentsTotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
